import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-[#8B85A8] tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full bg-[#07031A] text-[#F4F2FA] placeholder-[#8B85A8]/60 border border-[#6755C2]/25 rounded-xl p-3.5 text-sm transition-all duration-200 focus:outline-none focus:border-[#6755C2] focus:ring-1 focus:ring-[#6755C2] disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] resize-y',
            error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8B85A8] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
