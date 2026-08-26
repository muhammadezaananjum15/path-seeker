import React from 'react';
import { cn } from '../../utils/cn';

export interface CareerScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CareerScoreBadge: React.FC<CareerScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className
}) => {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-bold'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-mono font-semibold select-none border transition-all',
        score >= 90
          ? 'bg-[#402D9C] text-[#F4F2FA] border-[#6755C2] shadow-[0_0_12px_rgba(103,85,194,0.3)]'
          : score >= 80
          ? 'bg-[#08012B] text-[#F4F2FA] border-[#6755C2]/60'
          : 'bg-[#07031A] text-[#8B85A8] border-[#8B85A8]/30',
        sizes[size],
        className
      )}
    >
      <span>{score}%</span>
      {showLabel && <span className="text-[10px] uppercase font-sans font-normal opacity-80">Match</span>}
    </div>
  );
};
