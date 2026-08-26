import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'royal' | 'soft' | 'outline' | 'demand-very-high' | 'demand-high' | 'demand-moderate' | 'stamp';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all select-none';

  const variants = {
    default: 'bg-[#08012B] text-[#F4F2FA] border border-[#6755C2]/30',
    royal: 'bg-[#402D9C] text-[#F4F2FA] border border-[#6755C2]',
    soft: 'bg-[#6755C2]/20 text-[#F4F2FA] border border-[#6755C2]/40',
    outline: 'bg-transparent text-[#8B85A8] border border-[#8B85A8]/30',
    'demand-very-high': 'bg-[#402D9C]/80 text-[#F4F2FA] border border-[#6755C2] shadow-[0_0_12px_rgba(103,85,194,0.3)]',
    'demand-high': 'bg-[#08012B] text-[#F4F2FA] border border-[#6755C2]/60',
    'demand-moderate': 'bg-[#08012B] text-[#8B85A8] border border-[#6755C2]/20',
    stamp: 'border border-dashed border-[#6755C2] text-[#F4F2FA] uppercase tracking-widest text-[10px] bg-[#07031A]'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5'
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
