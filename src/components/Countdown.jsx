import React, { useState, useEffect } from 'react';

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const diff = tomorrow - now;

            const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

            setTimeLeft(`${h}:${m}:${s}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-1 sm:gap-2 font-mono font-bold text-gray-400 dark:text-gray-500 text-[10px] sm:text-sm">
            <span className="hidden xs:inline">NEXT SPARK IN</span>
            <span className="xs:hidden">NEXT:</span>
            <span className="text-primary tabular-nums">{timeLeft}</span>
        </div>
    );
};

export default Countdown;
