import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  labelFormat?: 'percentage' | 'fraction';
  current?: number;
  total?: number;
  colorClass?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 56,
  strokeWidth = 5,
  className = '',
  showLabel = true,
  labelFormat = 'percentage',
  current,
  total,
  colorClass = 'text-[#FFBE0B]'
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#EADFC4]/60 fill-transparent"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} fill-transparent transition-all duration-500 ease-out`}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {labelFormat === 'fraction' && current !== undefined && total !== undefined ? (
            <span className="text-xs font-semibold text-[#2A2312] tabular-nums leading-none">
              {current}/{total}
            </span>
          ) : (
            <span className="text-xs font-bold text-[#2A2312] tabular-nums leading-none">
              {Math.round(normalizedProgress)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};
