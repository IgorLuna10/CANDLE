import React, { useState } from 'react';
import { candleAPI } from '../services/candle-api';

const PhraseDisplay = ({ phrase, onBack, onWord }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = `${phrase.chinese} (${phrase.jyutping}) - ${phrase.english}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 card-shadow">
                <div className="text-4xl sm:text-5xl font-bold font-serif mb-10 leading-relaxed text-gray-900 dark:text-gray-100">
                    {phrase.chinese}
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/20 space-y-6">
                    <div className="text-2xl font-mono text-primary font-bold tracking-wide leading-relaxed">
                        {phrase.jyutping}
                    </div>
                    <div className="text-3xl font-bold italic text-gray-700 dark:text-gray-300">
                        "{phrase.english}"
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center pt-4">
                        <button
                            onClick={() => candleAPI.speak(phrase.chinese)}
                            className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            Listen 🔊
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`px-8 py-4 rounded-xl font-bold transition-all ${
                                copied
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            {copied ? 'Copied! ✓' : 'Copy 📋'}
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between border-t border-gray-200 dark:border-gray-800 pt-8">
                    <button onClick={onWord} className="px-6 py-3 text-primary font-bold hover:bg-primary/5 rounded-xl transition-all">
                        ← Daily Word
                    </button>
                    <button onClick={onBack} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhraseDisplay;
