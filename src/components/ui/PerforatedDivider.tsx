import React from 'react';
import { cn } from '../../utils/cn';

export interface PerforatedDividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const PerforatedDivider: React.FC<PerforatedDividerProps> = ({
  className,
  orientation = 'horizontal',
  label
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={cn('h-full w-px border-r border-dashed border-[#6755C2]/30', className)} />
    );
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center my-6', className)}>
        <div className="flex-grow border-t border-dashed border-[#6755C2]/30" />
        <span className="flex-shrink mx-4 text-[10px] tracking-widest text-[#8B85A8] uppercase font-mono">
          {label}
        </span>
        <div className="flex-grow border-t border-dashed border-[#6755C2]/30" />
      </div>
    );
  }

  return (
    <div className={cn('w-full border-t border-dashed border-[#6755C2]/30 my-4', className)} />
  );
};
