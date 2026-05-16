import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WordChallenge from './components/WordChallenge';
import PhraseDisplay from './components/PhraseDisplay';
import { candleAPI } from './services/candle-api';

function App() {
    const [view, setView] = useState('home');
    const [content, setContent] = useState(null);
    const [streak, setStreak] = useState(0);

    // Lazy initializer avoids calling localStorage during SSR / before hydration
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem('candle-theme') === 'dark'
    );

    useEffect(() => {
        const loadData = async () => {
            const data = await candleAPI.getTodaysContent();
            setContent(data);
            setStreak(candleAPI.getStreak());
        };
        loadData();
    }, []);

    // Apply dark class to both <html> and <body> so Tailwind dark: utilities
    // AND the body.dark CSS rule in index.css both work correctly.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('candle-theme', newTheme ? 'dark' : 'light');
    };

    return (
        <Layout currentView={view} setView={setView} isDark={isDark} toggleTheme={toggleTheme}>
            {view === 'home' && (
                <Dashboard
                    content={content}
                    streak={streak}
                    setView={setView}
                    onChallengeComplete={() => setStreak(candleAPI.getStreak())}
                />
            )}
            {view === 'word' && content && (
                <WordChallenge
                    word={content.dailyWord}
                    onBack={() => setView('home')}
                    onNext={() => setView('phrase')}
                />
            )}
            {view === 'phrase' && content && (
                <PhraseDisplay
                    phrase={content.dailyPhrase}
                    onBack={() => setView('home')}
                    onWord={() => setView('word')}
                />
            )}
        </Layout>
    );
}

export default App;
