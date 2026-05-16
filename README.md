# 🕯️ CANDLE — Daily Cantonese

> A daily Cantonese language learning app inspired by Wordle.  
> Every day you get a new word and phrase to practice — guess the meaning, hear the pronunciation, and build your streak.

🔗 **Repository:** [github.com/IgorLuna10/CANDLE](https://github.com/IgorLuna10/CANDLE)

---

## ✨ Features

- **Daily Word & Phrase** — new Cantonese content every day, cycling through 445 words and 108 phrases
- **Spark Challenges** — guess the English meaning from Jyutping romanisation
- **Word Challenge** — deeper practice: guess pronunciation or meaning, or flip to English → Cantonese mode
- **Text-to-Speech** — hear native Cantonese pronunciation (uses `zh-HK` voice when available)
- **Streak Tracking** — local streak counter that rewards consecutive correct answers
- **Dark Mode** — full dark theme with no flash on load
- **Offline-friendly** — dictionary is bundled locally; no API key required
- **Wiktionary Integration** — live word lookup beyond the local dictionary, cached for offline use

---

## 🗂️ Project Structure

```
CANDLE/
├── public/
│   ├── candle.png            # App icon
│   └── dictionary.json       # 445 words + 108 phrases (local, no API needed)
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Header, nav, dark mode wrapper
│   │   ├── Dashboard.jsx     # Home screen with both spark challenges
│   │   ├── MainChallenge.jsx # Jyutping → English guess card
│   │   ├── WordChallenge.jsx # Deep word practice with mode switching
│   │   ├── PhraseDisplay.jsx # Phrase view with listen + copy
│   │   └── Countdown.jsx     # Countdown to next daily content
│   ├── services/
│   │   └── candle-api.js     # Content selection, Wiktionary, streak, TTS, guess logic
│   ├── App.jsx               # Root — routing between views, dark mode state
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind base + dark mode body styles
├── index.html                # HTML shell with dark-mode flash prevention
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/IgorLuna10/CANDLE.git
cd CANDLE
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 How the Dictionary Works

The dictionary (`public/dictionary.json`) is **fully local** — no external API required to run the app.

- **445 words** — greetings, verbs, adjectives, pronouns, food, places, jobs, transport, and more
- **108 phrases** — daily life, food, directions, health, social, celebrations, weather, and more

Content rotates by **day of year**, so every user worldwide sees the same word on the same day — just like Wordle.

### Wiktionary (live layer)
`candle-api.js` includes a fully wired `fetchFromWiktionary()` method that:
- Fetches live word data from the Wiktionary MediaWiki API
- Parses Jyutping and English definitions from the rendered HTML
- Caches results in `localStorage` so each word is only ever fetched once
- Falls back silently to local data on any failure

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS 3 | Styling |
| Web Speech API | Text-to-speech (built-in browser) |
| Wiktionary API | Live word enrichment |
| localStorage | Streak, progress & wiki cache |

---

## 🤝 Contributing

The easiest way to contribute is expanding `public/dictionary.json`. Each entry follows this format:

```json
// Word
{ "chinese": "靚", "jyutping": "leng3", "english": "beautiful", "category": "adjectives" }

// Phrase
{ "chinese": "你好嗎？", "jyutping": "nei5 hou2 maa3?", "english": "How are you?", "context": "greeting" }
```

---

## 📄 License

MIT — feel free to fork and adapt for other languages.

---

*Built with 🕯️ for Cantonese learners everywhere.*
