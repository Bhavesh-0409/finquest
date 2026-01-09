type PathLineProps = {
  status: "completed" | "current" | "locked";
  fromSide: "left" | "right";
  toSide: "left" | "right";
};

export default function PathLine({ status, fromSide, toSide }: PathLineProps) {
  const colors = {
    completed: "#4ade80", // green-400
    current: "#facc15", // yellow-400
    locked: "#4b5563", // gray-600
  } as const;

  const glowColors = {
    completed: "rgba(74,222,128,0.7)",
    current: "rgba(250,204,21,0.9)",
    locked: "rgba(75,85,99,0.6)",
  } as const;

  const xForSide = (side: "left" | "right") => (side === "left" ? "25" : "75");

  const strokeColor = colors[status];
  const glowColor = glowColors[status];

  return (
    <div className="relative w-full h-16 my-1">
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Soft glow */}
        <defs>
          <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0"
            />
          </filter>
        </defs>

        {/* Faint track behind */}
        <line
          x1={xForSide(fromSide)}
          y1="0"
          x2={xForSide(toSide)}
          y2="100"
          stroke="#1f2937"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Glowing main path */}
        <line
          x1={xForSide(fromSide)}
          y1="0"
          x2={xForSide(toSide)}
          y2="100"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }}
        />
      </svg>
    </div>
  );
}
