import React from 'react';
import { cn } from '../../utils/cn';
import { Compass, Target, Layers, MapPin, Award, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export interface PassportStampProps {
  title: string;
  category: string;
  iconName?: string;
  description?: string;
  isUnlocked?: boolean;
  dateUnlocked?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PassportStamp: React.FC<PassportStampProps> = ({
  title,
  category,
  iconName,
  description,
  isUnlocked = true,
  dateUnlocked,
  size = 'md',
  className
}) => {
  const getIcon = () => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={cn(
        'relative group rounded-2xl p-4 transition-all duration-300 select-none',
        isUnlocked
          ? 'bg-[#08012B] border border-dashed border-[#6755C2]/40 hover:border-[#6755C2] shadow-[0_4px_20px_rgba(8,1,43,0.8)] hover:shadow-[0_0_25px_rgba(103,85,194,0.25)] hover:-translate-y-1'
          : 'bg-[#07031A]/40 border border-dashed border-[#8B85A8]/20 opacity-60',
        className
      )}
    >
      {/* Perforated Inner Box */}
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors',
            isUnlocked
              ? 'bg-[#07031A] border-[#6755C2]/50 text-[#6755C2] group-hover:text-[#F4F2FA] group-hover:bg-[#402D9C]'
              : 'bg-[#030305] border-[#8B85A8]/20 text-[#8B85A8]/50'
          )}
        >
          {isUnlocked ? getIcon() : <Lock className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6755C2]">
              {category}
            </span>
            {dateUnlocked && (
              <span className="text-[10px] text-[#8B85A8] font-mono">
                {dateUnlocked}
              </span>
            )}
          </div>

          <h5 className="text-xs font-semibold text-[#F4F2FA] mt-0.5 truncate group-hover:text-[#6755C2] transition-colors">
            {title}
          </h5>

          {description && (
            <p className="text-[11px] text-[#8B85A8] mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Stamp watermark ribbon */}
      {isUnlocked && (
        <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none">
          <span className="text-2xl font-bold font-editorial text-[#6755C2]">SEAL</span>
        </div>
      )}
    </div>
  );
};
