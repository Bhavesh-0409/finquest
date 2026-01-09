'use client';

import { useState, useCallback, useEffect } from 'react';
import SaveOrInvestGame from './SaveOrInvestGame';

export default function Level3() {
  const [xp, setXp] = useState(0);

  // Handle XP changes - update local state (game display) and localStorage (total XP)
  const handleXpChange = useCallback((delta: number) => {
    // Update game display XP (starts at 0, accumulates during session)
    setXp(prev => Math.max(0, prev + delta));
    
    // Update total XP in localStorage
    const storedUser = localStorage.getItem('finstinct-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const currentTotalXp = user.xp || 0;
      const newTotalXp = Math.max(0, currentTotalXp + delta);
      user.xp = newTotalXp;
      localStorage.setItem('finstinct-user', JSON.stringify(user));
    }
  }, []);

  // Start XP at 0 for the game session
  // XP will accumulate as the user plays

  return (
    <>
      {/* XP Display - Fixed position */}
      <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg z-50">
        ⭐ XP {xp}
      </div>
      <SaveOrInvestGame onXpChange={handleXpChange} />
    </>
  );
}

