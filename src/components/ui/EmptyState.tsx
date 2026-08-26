import React from 'react';
import { Button } from './Button';
import { Compass } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#08012B]/50 border border-dashed border-[#6755C2]/30 my-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#07031A] border border-[#6755C2]/40 flex items-center justify-center text-[#6755C2] mb-4 shadow-[0_0_20px_rgba(103,85,194,0.2)]">
        {icon || <Compass className="w-7 h-7" />}
      </div>
      <h4 className="text-lg font-medium text-[#F4F2FA] font-editorial">{title}</h4>
      <p className="text-xs text-[#8B85A8] max-w-md mt-1.5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-5">
          {actionText}
        </Button>
      )}
    </div>
  );
};
