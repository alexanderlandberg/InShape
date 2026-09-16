interface LevelRingProps {
  level: number;
  xpIntoLevel: number;
  xpToNext: number;
  size?: number;
}

export function LevelRing({ level, xpIntoLevel, xpToNext, size = 96 }: LevelRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = xpToNext > 0 ? Math.min(xpIntoLevel / xpToNext, 1) : 0;
  const offset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <div className="level-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="level-ring__track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="level-ring__progress"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="level-ring__label">
        <span className="level-ring__level">{level}</span>
        <span className="level-ring__caption">Lvl</span>
      </div>
    </div>
  );
}
