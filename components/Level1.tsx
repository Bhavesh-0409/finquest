'use client';

import { useState, useCallback } from 'react';
import MoneyHangman from './MoneyHangman';

export default function Level1() {
  const [xp, setXp] = useState(0);

  // Handle XP changes - ensure it never goes below 0
  // Memoized to prevent unnecessary re-renders in MoneyHangman
  const handleXpChange = useCallback((delta: number) => {
    setXp(prev => Math.max(0, prev + delta));
  }, []);

  // Render the game immediately (no intro slides)
  return (
    <>
      {/* XP Display - Fixed position */}
      <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg z-50">
        ⭐ XP {xp}
      </div>
      <MoneyHangman onXpChange={handleXpChange} />
    </>
  );
}
