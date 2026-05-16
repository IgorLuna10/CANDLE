import React from 'react';
import MainChallenge from './MainChallenge';

const Dashboard = ({ content, streak, setView, onChallengeComplete }) => (
    <div className="space-y-16">
        <section className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter bg-gradient-to-br from-primary via-red-500 to-orange-400 bg-clip-text text-transparent">
                蠟燭
            </h1>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-full font-black text-xl tracking-wide shadow-sm">
                🔥 {streak} DAY STREAK
            </div>
        </section>

        {content && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* key prop ensures React re-mounts when content changes */}
                <MainChallenge
                    key={content.mainWord.chinese}
                    word={content.mainWord}
                    onComplete={onChallengeComplete}
                    title="Word Spark Challenge"
                />
                <MainChallenge
                    key={content.mainPhrase.chinese}
                    word={content.mainPhrase}
                    onComplete={onChallengeComplete}
                    title="Sentence Spark Challenge"
                />
            </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto opacity-80 hover:opacity-100 transition-opacity">
            <div
                onClick={() => setView('word')}
                className="group bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:border-primary/30 card-shadow flex items-center gap-6"
            >
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📖</div>
                <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">Daily Word</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Today: <span className="font-serif font-bold text-gray-800 dark:text-gray-200">{content?.dailyWord?.chinese}</span>
                    </p>
                </div>
            </div>

            <div
                onClick={() => setView('phrase')}
                className="group bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:border-primary/30 card-shadow flex items-center gap-6"
            >
                <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💬</div>
                <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">Daily Phrase</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Today: <span className="font-serif font-bold text-gray-800 dark:text-gray-200">{content?.dailyPhrase?.chinese}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;
