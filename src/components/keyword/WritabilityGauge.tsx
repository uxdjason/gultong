import React from 'react';

interface WritabilityGaugeProps {
  score: number;
  size?: number;
}

export default function WritabilityGauge({ score, size = 64 }: WritabilityGaugeProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-state-danger'; // 0~49
  if (score >= 75) colorClass = 'text-state-success';
  else if (score >= 50) colorClass = 'text-state-warning';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-surface-divider stroke-current"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
        />
        <circle
          className={`${colorClass} stroke-current`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-xl font-bold font-myungjo ${colorClass.replace('text-', 'text-')}`}>
          {score}
        </span>
      </div>
    </div>
  );
}
