import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#8B85A8] tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-[#07031A] text-[#F4F2FA] border border-[#6755C2]/25 rounded-xl px-4 py-2.5 pr-10 text-sm transition-all duration-200 focus:outline-none focus:border-[#6755C2] focus:ring-1 focus:ring-[#6755C2] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
              error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#08012B] text-[#F4F2FA] py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-[#8B85A8]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8B85A8] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
