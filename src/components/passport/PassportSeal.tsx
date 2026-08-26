import React from 'react';
import { cn } from '../../utils/cn';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';

export interface PassportSealProps {
  passportId?: string;
  status?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PassportSeal: React.FC<PassportSealProps> = ({
  passportId = 'PS-2048',
  status = 'VERIFIED EXPLORER',
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'w-20 h-20 text-[8px]',
    md: 'w-28 h-28 text-[9px]',
    lg: 'w-36 h-36 text-[10px]'
  };

  return (
    <div
      className={cn(
        'relative rounded-full border-2 border-dashed border-[#6755C2]/60 flex flex-col items-center justify-center p-2 text-center bg-[#07031A]/90 shadow-[0_0_30px_rgba(64,45,156,0.25)] select-none',
        sizes[size],
        className
      )}
    >
      {/* Outer circular track */}
      <div className="absolute inset-1 rounded-full border border-[#6755C2]/30 pointer-events-none" />

      <Compass className="w-5 h-5 text-[#6755C2] mb-1 animate-pulse" />
      <span className="font-mono font-bold tracking-widest text-[#F4F2FA]">
        PATHSEEKER
      </span>
      <span className="font-mono text-[8px] text-[#6755C2] tracking-wider">
        {passportId}
      </span>
      <span className="text-[7px] text-[#8B85A8] uppercase tracking-widest mt-0.5">
        {status}
      </span>
    </div>
  );
};
