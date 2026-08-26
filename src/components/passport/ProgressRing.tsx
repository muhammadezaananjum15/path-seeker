import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 110,
  strokeWidth = 7,
  label,
  sublabel,
  className
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn('relative inline-flex flex-col items-center justify-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#08012B"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-70"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#402D9C" />
              <stop offset="100%" stopColor="#6755C2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-editorial text-[#F4F2FA]">
            {clamped}%
          </span>
          {sublabel && (
            <span className="text-[10px] uppercase tracking-wider text-[#8B85A8] -mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs text-[#8B85A8] mt-2 font-medium tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};
