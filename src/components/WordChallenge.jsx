import React, { useState } from 'react';
import { candleAPI } from '../services/candle-api';

const WordChallenge = ({ word, onBack, onNext }) => {
    const [mode, setMode] = useState('jyutping');
    const [isEnglishChallenge, setIsEnglishChallenge] = useState(false);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [revealed, setRevealed] = useState(false);

    const checkGuess = () => {
        let target, type;
        if (isEnglishChallenge) {
            target = mode === 'chinese' ? word.chinese : word.jyutping;
            type = mode;
        } else {
            target = mode === 'jyutping' ? word.jyutping : word.english;
            type = mode;
        }

        const result = candleAPI.evaluateGuess(guess, target, type);

        if (result.result === 'correct') {
            setFeedback({ type: 'success', text: "🎉 Correct! You've mastered this." });
            setRevealed(true);
            candleAPI.trackProgress('word', word.chinese, `guessed_${mode}_correctly`);
        } else if (result.result === 'partial' || result.result === 'close') {
            setFeedback({ type: 'warning', text: `🤔 So close! ${result.note || ''}` });
        } else {
            setFeedback({ type: 'error', text: "❌ Not quite! Try again." });
        }
    };

    const handleReveal = () => {
        setRevealed(true);
        setFeedback(null);
    };

    const switchChallenge = () => {
        setIsEnglishChallenge(!isEnglishChallenge);
        setMode(isEnglishChallenge ? 'jyutping' : 'chinese');
        setGuess('');
        setFeedback(null);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 text-center card-shadow">

                {!revealed && (
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={switchChallenge}
                            className="text-sm font-bold text-primary hover:underline"
                        >
                            {isEnglishChallenge ? "← Switch to Character Challenge" : "Try English → Cantonese Challenge"}
                        </button>
                    </div>
                )}

                <div className="text-6xl xs:text-8xl sm:text-9xl font-bold font-serif mb-8 text-gray-900 dark:text-gray-100 transition-all duration-500">
                    {isEnglishChallenge && !revealed
                        ? <span className="text-3xl sm:text-4xl italic text-gray-500">"{word.english}"</span>
                        : word.chinese}
                </div>

                {!revealed ? (
                    <div className="space-y-6">
                        <div className="flex justify-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl max-w-xs mx-auto">
                            {isEnglishChallenge ? (
                                <>
                                    <button
                                        onClick={() => { setMode('chinese'); setGuess(''); setFeedback(null); }}
                                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'chinese' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Characters
                                    </button>
                                    <button
                                        onClick={() => { setMode('jyutping'); setGuess(''); setFeedback(null); }}
                                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'jyutping' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Jyutping
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { setMode('jyutping'); setGuess(''); setFeedback(null); }}
                                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'jyutping' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        Jyutping
                                    </button>
                                    <button
                                        onClick={() => { setMode('english'); setGuess(''); setFeedback(null); }}
                                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'english' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500'}`}
                                    >
                                        English
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Challenge Mode</h3>
                            <p className="text-gray-500">Guess the {
                                mode === 'jyutping' ? 'pronunciation' :
                                mode === 'english' ? 'meaning' : 'Chinese characters'
                            }</p>
                            <input
                                type="text"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                                placeholder={
                                    mode === 'jyutping' ? "e.g., nei5 hou2" :
                                    mode === 'chinese' ? "Type characters..." : "Type meaning..."
                                }
                                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <div className="flex gap-3">
                                <button onClick={checkGuess} className="flex-1 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all">
                                    Check Guess
                                </button>
                                <button onClick={handleReveal} className="flex-1 py-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">
                                    Reveal
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in zoom-in duration-500">
                        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/20">
                            <div className="text-4xl font-mono text-primary font-bold mb-2 tracking-wider">{word.jyutping}</div>
                            <div className="text-2xl font-semibold italic text-gray-700 dark:text-gray-300">"{word.english}"</div>
                            <div className="mt-6">
                                <button
                                    onClick={() => candleAPI.speak(word.chinese)}
                                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-all"
                                >
                                    Listen 🔊
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={onBack} className="px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                ← Back to Home
                            </button>
                            <button onClick={onNext} className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all">
                                Daily Phrase →
                            </button>
                        </div>
                    </div>
                )}

                {feedback && (
                    <div className={`mt-6 p-4 rounded-xl font-bold ${
                        feedback.type === 'success' ? 'bg-green-100 text-green-700' :
                        feedback.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    } animate-in fade-in slide-in-from-top-2`}>
                        {feedback.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WordChallenge;
