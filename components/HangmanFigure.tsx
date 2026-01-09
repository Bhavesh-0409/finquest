'use client';

interface HangmanFigureProps {
  incorrectAttempts: number;
}

/**
 * HangmanFigure Component
 * 
 * Displays a visual stick figure that builds up as incorrect guesses increase.
 * Body parts are added in this exact sequence:
 * 1. Leg 1 (when incorrectAttempts >= 1)
 * 2. Leg 2 (when incorrectAttempts >= 2)
 * 3. Hand 1 (when incorrectAttempts >= 3)
 * 4. Hand 2 (when incorrectAttempts >= 4)
 * 5. Torso (when incorrectAttempts >= 5)
 * 6. Hang/Noose (when incorrectAttempts >= 6 - final state)
 * 
 * Note: Head is shown when any body part appears (starting at attempt 1)
 * 
 * @param incorrectAttempts - Number of incorrect guesses (0-6)
 */
export default function HangmanFigure({ incorrectAttempts }: HangmanFigureProps) {
  const MAX_ATTEMPTS = 6;
  
  // Determine which parts should be visible based on incorrect attempts
  // Parts are added sequentially as attempts increase
  const showHead = incorrectAttempts >= 1; // Head appears with first wrong guess
  const showLeg1 = incorrectAttempts >= 1;
  const showLeg2 = incorrectAttempts >= 2;
  const showHand1 = incorrectAttempts >= 3;
  const showHand2 = incorrectAttempts >= 4;
  const showTorso = incorrectAttempts >= 5;
  const showHang = incorrectAttempts >= 6; // Show rope/noose when fully failed

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <svg
        width="300"
        height="400"
        viewBox="0 0 300 400"
        className="stroke-white stroke-2 fill-none"
      >
        {/* Gallows structure (always visible) */}
        <line x1="50" y1="50" x2="50" y2="350" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="50" x2="200" y2="50" strokeWidth="4" strokeLinecap="round" />
        <line x1="200" y1="50" x2="200" y2="100" strokeWidth="4" strokeLinecap="round" />

        {/* Hang/Noose (shown when attempts >= 6 - final failure state) */}
        {showHang && (
          <>
            {/* Rope/noose */}
            <line 
              x1="200" 
              y1="100" 
              x2="200" 
              y2="120" 
              strokeWidth="3" 
              stroke="#dc2626"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Head (appears with first wrong guess) */}
        {showHead && (
          <circle
            cx="200"
            cy="140"
            r="20"
            strokeWidth="3"
            className={showHang ? 'stroke-red-500' : 'stroke-white'}
          />
        )}

        {/* Torso (appears at attempt 5) */}
        {showTorso && (
          <line 
            x1="200" 
            y1="160" 
            x2="200" 
            y2="240" 
            strokeWidth="3"
            strokeLinecap="round"
            className={showHang ? 'stroke-red-500' : 'stroke-white'}
          />
        )}

        {/* Hand 1 - Left arm (appears at attempt 3) */}
        {showHand1 && (
          <line 
            x1="200" 
            y1="180" 
            x2="170" 
            y2="210" 
            strokeWidth="3"
            strokeLinecap="round"
            className={showHang ? 'stroke-red-500' : 'stroke-white'}
          />
        )}

        {/* Hand 2 - Right arm (appears at attempt 4) */}
        {showHand2 && (
          <line 
            x1="200" 
            y1="180" 
            x2="230" 
            y2="210" 
            strokeWidth="3"
            strokeLinecap="round"
            className={showHang ? 'stroke-red-500' : 'stroke-white'}
          />
        )}

        {/* Leg 1 - Left leg (appears at attempt 1) */}
        {showLeg1 && (
          <line 
            x1="200" 
            y1="240" 
            x2="175" 
            y2="290" 
            strokeWidth="3"
            strokeLinecap="round"
            className={showHang ? 'stroke-red-500' : 'stroke-white'}
          />
        )}

        {/* Leg 2 - Right leg (appears at attempt 2) */}
        {showLeg2 && (
          <line 
            x1="200" 
            y1="240" 
            x2="225" 
            y2="290" 
            strokeWidth="3"
            strokeLinecap="round"
            className={showHang ? 'stroke-red-500' : 'stroke-white'}
          />
        )}
      </svg>

      {/* Visual indicator text */}
      {incorrectAttempts >= MAX_ATTEMPTS && (
        <p className="text-red-400 font-bold text-lg mt-4 animate-pulse">
          Game Over!
        </p>
      )}
    </div>
  );
}
