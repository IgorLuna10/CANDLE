import React, { useState, useEffect } from 'react';
import { candleAPI } from '../services/candle-api';

const MainChallenge = ({ word, onComplete, title = "Today's Word Spark" }) => {
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const today = candleAPI.getTodayKey();
        const progress = JSON.parse(localStorage.getItem('candle-v2-progress') || '{"log": {}}');
        const actions = progress.log[today] || [];
        const alreadyDone = actions.some(
            a => a.itemId === word.chinese &&
            (a.action === 'main_challenge_correct' || a.action === 'main_challenge_revealed')
        );
        if (alreadyDone) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
            setGuess('');
            setFeedback(null);
        }
    }, [word]);

    const handleCheck = () => {
        const result = candleAPI.evaluateGuess(guess, word.english, 'english');
        if (result.result === 'correct') {
            setFeedback({ type: 'success', text: "✨ Correct! You've illuminated this spark." });
            setIsCorrect(true);
            candleAPI.trackProgress('word', word.chinese, 'main_challenge_correct');
            onComplete && onComplete();
        } else if (result.result === 'close') {
            setFeedback({ type: 'warning', text: "🔥 So close! Almost there..." });
        } else {
            setFeedback({ type: 'error', text: "💨 Not quite. Try another spark!" });
        }
    };

    const handleGiveUp = () => {
        setIsCorrect(true);
        setFeedback({ type: 'warning', text: "🏳️ Answer revealed. Keep practicing!" });
        candleAPI.trackProgress('word', word.chinese, 'main_challenge_revealed');
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white dark:bg-[#1a1a1a] border-2 border-primary/20 dark:border-primary/30 rounded-[2.5rem] p-8 sm:p-10 text-center card-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

                <div className="space-y-2 mb-8">
                    <h2 className="text-primary font-bold tracking-widest uppercase text-sm">{title}</h2>
                    <div className={`font-black font-mono tracking-tight text-gray-900 dark:text-gray-100 ${word.jyutping.length > 20 ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl'}`}>
                        {word.jyutping}
                    </div>
                </div>

                {!isCorrect ? (
                    <div className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                                placeholder="Guess English meaning..."
                                className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-center text-xl font-semibold focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-gray-400"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleCheck}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover shadow-lg shadow-primary/30 active:scale-95 transition-all"
                            >
                                Check
                            </button>
                            <button
                                onClick={handleGiveUp}
                                className="px-6 py-4 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                            >
                                Reveal
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/20 space-y-4">
                            <div className="text-5xl font-bold font-serif">{word.chinese}</div>
                            <div className="text-2xl font-semibold italic text-gray-600 dark:text-gray-400">"{word.english}"</div>
                        </div>
                        <button
                            onClick={() => candleAPI.speak(word.chinese)}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 rounded-full font-bold hover:bg-gray-200 transition-all"
                        >
                            Hear it 🔊
                        </button>
                    </div>
                )}

                {feedback && !isCorrect && (
                    <div className={`mt-6 p-4 rounded-xl font-bold animate-in slide-in-from-top-4 duration-300 ${
                        feedback.type === 'success' ? 'bg-green-100 text-green-700' :
                        feedback.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {feedback.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainChallenge;
