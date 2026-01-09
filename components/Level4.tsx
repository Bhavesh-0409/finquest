'use client';

import { useState, useCallback, useEffect } from 'react';
import RiskHangman from './RiskHangman';

export default function Level4() {
    const [xp, setXp] = useState(0);

    // Handle XP changes - update local state and localStorage
    const handleXpChange = useCallback((delta: number) => {
        setXp(prev => {
            const newXp = Math.max(0, prev + delta);

            // Update XP in localStorage
            const storedUser = localStorage.getItem('finstinct-user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.xp = newXp;
                localStorage.setItem('finstinct-user', JSON.stringify(user));
            }

            return newXp;
        });
    }, []);

    // Load initial XP from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('finstinct-user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setXp(user.xp || 0);
        }
    }, []);

    return (
        <>
            {/* XP Display - Fixed position */}
            <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg z-50">
                ⭐ XP {xp}
            </div>
            <RiskHangman onXpChange={handleXpChange} />
        </>
    );
}
