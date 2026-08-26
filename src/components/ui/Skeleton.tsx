import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#08012B] border border-[#6755C2]/15',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        variant === 'text' && 'h-4 rounded-md w-full',
        className
      )}
      {...props}
    />
  );
};
