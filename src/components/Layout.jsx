import React from 'react';
import Countdown from './Countdown';

const Layout = ({ children, currentView, setView, isDark, toggleTheme }) => (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        <header className="sticky top-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setView('home')}>
                <img src="/candle.png" alt="CANDLE" className="h-7 w-auto sm:h-8" />
                <span className="text-lg sm:text-xl font-extrabold text-primary tracking-tight hidden xs:block">CANDLE</span>
            </div>
            <div className="flex-1 px-2 sm:px-4 flex justify-center">
                <Countdown />
            </div>
            <nav className="shrink-0">
                <ul className="flex items-center gap-2 sm:gap-6">
                    <li>
                        <button 
                            onClick={() => setView('home')}
                            className={`text-sm sm:text-base font-semibold transition-colors ${currentView === 'home' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setView('word')}
                            className={`font-semibold transition-colors ${currentView === 'word' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Word
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setView('phrase')}
                            className={`font-semibold transition-colors ${currentView === 'phrase' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Phrase
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6 sm:p-10">
            {children}
        </main>
    </div>
);

export default Layout;
