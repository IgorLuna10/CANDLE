/**
 * CANDLE Daily API v3.0
 * Unified Cantonese Learning Logic & Content
 *
 * Content strategy (two-layer):
 *   1. LOCAL  — dictionary.json (445 words, 108 phrases). Always used for
 *               the four daily slots. Fast, offline-capable, curated.
 *   2. LIVE   — Wiktionary (en.wiktionary.org MediaWiki API). Fetched on
 *               demand to enrich any entry or to pull words outside the
 *               local dictionary. Results are cached in localStorage so
 *               the same word is never fetched twice.
 *
 * The display contract never changes — every entry, whether local or live,
 * always resolves to { chinese, jyutping, english }.  Components are
 * untouched; only this file changes.
 */

class CandleAPI {
    constructor() {
        this.cacheKey      = 'candle-v2-cache';
        this.progressKey   = 'candle-v2-progress';
        this.wikiCacheKey  = 'candle-wiki-cache';   // localStorage key for Wiktionary results
        this.dictionary    = null;

        // Wiktionary MediaWiki API — action=parse returns rendered HTML
        // which we can scrape for Jyutping + definition without needing
        // CORS credentials.  The &origin=* param enables cross-origin GETs.
        this.WIKI_API = 'https://en.wiktionary.org/w/api.php';
    }

    // ─────────────────────────────────────────────────────────────────
    // LOCAL DICTIONARY
    // ─────────────────────────────────────────────────────────────────

    async loadDictionary() {
        if (this.dictionary) return this.dictionary;
        try {
            const response = await fetch('/dictionary.json');
            this.dictionary = await response.json();
            return this.dictionary;
        } catch (e) {
            console.error('Failed to load dictionary.json', e);
            return {
                words:   [{ chinese: '你好',  jyutping: 'nei5 hou2',      english: 'hello' }],
                phrases: [{ chinese: '你好嗎？', jyutping: 'nei5 hou2 maa3?', english: 'How are you?' }]
            };
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // DATE HELPERS
    // ─────────────────────────────────────────────────────────────────

    getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    getDayOfYear() {
        const now   = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        return Math.floor((now - start) / 86_400_000);
    }

    // ─────────────────────────────────────────────────────────────────
    // DAILY CONTENT  (local dictionary — four slots)
    // ─────────────────────────────────────────────────────────────────

    async getTodaysContent() {
        const today  = this.getTodayKey();
        const cached = localStorage.getItem(this.cacheKey);

        if (cached) {
            const data = JSON.parse(cached);
            if (data.date === today) return data.content;
        }

        const dict      = await this.loadDictionary();
        const dayIdx    = this.getDayOfYear();
        const words     = dict.words;    // 445 entries
        const phrases   = dict.phrases;  // 108 entries

        // Half-length offsets guarantee mainWord ≠ dailyWord (and same for phrases)
        const wordOffset   = Math.floor(words.length   / 2);
        const phraseOffset = Math.floor(phrases.length / 2);

        const content = {
            date:         today,
            mainWord:     words  [dayIdx % words.length],
            dailyWord:    words  [(dayIdx + wordOffset)   % words.length],
            mainPhrase:   phrases[dayIdx % phrases.length],
            dailyPhrase:  phrases[(dayIdx + phraseOffset) % phrases.length],
            timestamp:    Date.now()
        };

        localStorage.setItem(this.cacheKey, JSON.stringify({ date: today, content }));
        return content;
    }

    // ─────────────────────────────────────────────────────────────────
    // WIKTIONARY  — live enrichment layer
    // ─────────────────────────────────────────────────────────────────

    /**
     * _getWikiCache()
     * Returns the full Wiktionary result cache from localStorage.
     * Shape: { [chineseWord]: { chinese, jyutping, english, fetchedAt } }
     */
    _getWikiCache() {
        try {
            return JSON.parse(localStorage.getItem(this.wikiCacheKey) || '{}');
        } catch {
            return {};
        }
    }

    _saveWikiCache(cache) {
        localStorage.setItem(this.wikiCacheKey, JSON.stringify(cache));
    }

    /**
     * _parseWiktionaryHTML(html, chineseWord)
     *
     * Parses the rendered HTML returned by action=parse to extract:
     *   - Jyutping  — from the `zh-pron` table row labelled "Cantonese"
     *   - English   — from the first Cantonese / Chinese definition
     *
     * Wiktionary HTML structure (simplified):
     *
     *   <table class="wikitable">               ← pronunciation table
     *     <tr><td>Cantonese (Jyutping)</td>
     *         <td><span class="...">nei5 hou2</span></td></tr>
     *   </table>
     *
     *   <ol>                                    ← definitions list
     *     <li>hello; hi</li>
     *   </ol>
     *
     * We parse this with a lightweight DOMParser — no regex hacks on HTML.
     */
    _parseWiktionaryHTML(html, chineseWord) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // ── 1. Jyutping ────────────────────────────────────────────
        let jyutping = null;

        // Strategy A: look for a table row whose first cell contains "Cantonese"
        // and whose second cell contains jyutping-looking text (digits 1-6)
        const rows = doc.querySelectorAll('tr');
        for (const row of rows) {
            const cells = row.querySelectorAll('td, th');
            if (cells.length < 2) continue;
            const label = cells[0].textContent.trim().toLowerCase();
            if (!label.includes('cantonese')) continue;
            const candidate = cells[1].textContent.trim();
            // Jyutping always ends syllables with a tone digit 1-6
            if (/[a-z][1-6]/.test(candidate)) {
                // Clean: keep only the romanisation portion
                jyutping = candidate
                    .replace(/\[.*?\]/g, '')  // strip bracketed notes
                    .split('\n')[0]            // first line only
                    .trim();
                break;
            }
        }

        // Strategy B: look for a <span> with lang="yue-jyutping" or similar
        if (!jyutping) {
            const span = doc.querySelector('[lang="yue-jyutping"], [class*="jyutping"]');
            if (span) jyutping = span.textContent.trim();
        }

        // ── 2. English definition ───────────────────────────────────
        let english = null;

        // Find the Chinese / Cantonese section then grab the first <li>
        // Wiktionary uses <span id="Chinese"> or <span id="Cantonese"> as anchors
        const sectionAnchors = ['Chinese', 'Cantonese', 'Yue_Chinese'];
        let defSection = null;

        for (const id of sectionAnchors) {
            const anchor = doc.getElementById(id);
            if (anchor) { defSection = anchor; break; }
        }

        if (defSection) {
            // Walk forward from the anchor's parent heading to find the first <ol>/<ul>
            let node = defSection.closest('h1,h2,h3,h4') || defSection.parentElement;
            while (node && node.tagName !== 'BODY') {
                node = node.nextElementSibling;
                if (!node) break;
                if (/^H[1-3]$/.test(node.tagName)) break; // hit next section
                const li = node.querySelector('li');
                if (li) {
                    english = li.textContent
                        .replace(/\(.*?\)/g, '')  // strip parenthetical notes
                        .split(';')[0]             // first sense only
                        .split('\n')[0]
                        .trim();
                    break;
                }
            }
        }

        // Fallback: just grab the very first <li> on the page
        if (!english) {
            const li = doc.querySelector('ol li, ul li');
            if (li) {
                english = li.textContent
                    .replace(/\(.*?\)/g, '')
                    .split(';')[0]
                    .trim();
            }
        }

        if (!jyutping || !english) return null;

        return {
            chinese:   chineseWord,
            jyutping:  jyutping,
            english:   english,
            fetchedAt: Date.now()
        };
    }

    /**
     * fetchFromWiktionary(chineseWord)
     *
     * Public method.  Returns a { chinese, jyutping, english } entry or null.
     *
     * Flow:
     *   1. Check localStorage cache — if hit, return immediately (no network).
     *   2. Fetch the Wiktionary page via action=parse&prop=text.
     *   3. Parse the returned HTML for Jyutping + first English definition.
     *   4. Validate: both fields must be present and jyutping must look like
     *      real jyutping (letters + tone digits).
     *   5. Cache the result (or a sentinel null) so the same word is never
     *      fetched twice in a session.
     *   6. Return the entry, or null on any failure.
     */
    async fetchFromWiktionary(chineseWord) {
        if (!chineseWord) return null;

        // 1. Cache hit
        const cache = this._getWikiCache();
        if (chineseWord in cache) {
            // null sentinel means we already tried and failed — don't retry
            return cache[chineseWord] || null;
        }

        try {
            // 2. Fetch rendered HTML from Wiktionary
            const url = new URL(this.WIKI_API);
            url.searchParams.set('action',  'parse');
            url.searchParams.set('page',    chineseWord);
            url.searchParams.set('prop',    'text');
            url.searchParams.set('format',  'json');
            url.searchParams.set('origin',  '*');   // required for CORS

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            if (data.error || !data.parse?.text?.['*']) {
                // Page doesn't exist or is an error — cache null so we don't retry
                cache[chineseWord] = null;
                this._saveWikiCache(cache);
                return null;
            }

            // 3. Parse the HTML
            const entry = this._parseWiktionaryHTML(data.parse.text['*'], chineseWord);

            // 4. Validate
            if (!entry || !/[a-z][1-6]/.test(entry.jyutping) || entry.english.length < 2) {
                cache[chineseWord] = null;
                this._saveWikiCache(cache);
                return null;
            }

            // 5. Cache success
            cache[chineseWord] = entry;
            this._saveWikiCache(cache);

            // 6. Return
            return entry;

        } catch (e) {
            console.warn(`Wiktionary fetch failed for "${chineseWord}":`, e.message);
            // Don't cache network errors — allow a retry next time
            return null;
        }
    }

    /**
     * enrichEntry(entry)
     *
     * Convenience method used by components that want to show extra
     * Wiktionary detail for an already-known local entry.
     * Falls back silently to the local entry on any failure.
     */
    async enrichEntry(entry) {
        const live = await this.fetchFromWiktionary(entry.chinese);
        if (!live) return entry;
        // Prefer local jyutping (curated) but use live english if richer
        return {
            ...entry,
            english: live.english.length > entry.english.length ? live.english : entry.english
        };
    }

    // ─────────────────────────────────────────────────────────────────
    // STREAK & PROGRESS
    // ─────────────────────────────────────────────────────────────────

    trackProgress(type, itemId, action = 'viewed') {
        let progress = JSON.parse(
            localStorage.getItem(this.progressKey) ||
            '{"log":{},"streaks":{"current":0,"last":""}}'
        );
        const today = this.getTodayKey();

        if (!progress.log[today]) progress.log[today] = [];
        progress.log[today].push({ type, itemId, action, time: Date.now() });

        const isSuccess = action.includes('correct') || action.includes('mastered');

        if (isSuccess) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

            if (progress.streaks.last === yKey) {
                if (progress.streaks.last !== today) {
                    progress.streaks.current += 1;
                    progress.streaks.last = today;
                }
            } else if (progress.streaks.last !== today) {
                progress.streaks.current = 1;
                progress.streaks.last = today;
            }
        }

        localStorage.setItem(this.progressKey, JSON.stringify(progress));
        return progress.streaks.current;
    }

    getStreak() {
        const p = JSON.parse(
            localStorage.getItem(this.progressKey) || '{"streaks":{"current":0}}'
        );
        return p.streaks.current;
    }

    // ─────────────────────────────────────────────────────────────────
    // SPEECH
    // ─────────────────────────────────────────────────────────────────

    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const hkVoice = voices.find(v => v.lang === 'zh-HK' || v.name.includes('Hong Kong'));
        if (hkVoice) utterance.voice = hkVoice;
        else utterance.lang = 'zh-HK';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    // ─────────────────────────────────────────────────────────────────
    // GUESS EVALUATION
    // ─────────────────────────────────────────────────────────────────

    evaluateGuess(guess, target, type = 'jyutping') {
        const clean = s => s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '').trim();
        const g = clean(guess);
        const t = clean(target);

        if (g === t) return { result: 'correct', match: 100 };

        if (type === 'chinese') {
            if (t.includes(g) && g.length > 0) return { result: 'partial', match: 50, note: 'Characters match!' };
        }
        if (type === 'english') {
            if (t.includes(g) && g.length > 3) return { result: 'close', match: 70 };
        }
        if (type === 'jyutping') {
            const tones  = s => (s.match(/[1-6]/g) || []).join('');
            if (tones(guess) === tones(target)) return { result: 'partial', match: 50, note: 'Tones correct!' };
        }

        return { result: 'incorrect', match: 0 };
    }
}

export const candleAPI = new CandleAPI();
