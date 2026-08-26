import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'editorial' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6755C2] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer tracking-wide active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#402D9C] text-[#F4F2FA] hover:bg-[#6755C2] shadow-sm hover:shadow-[0_0_20px_rgba(103,85,194,0.35)] border border-[#6755C2]/40',
      secondary:
        'bg-[#08012B] text-[#F4F2FA] hover:bg-[#07031A] hover:border-[#6755C2]/60 border border-[#6755C2]/25',
      editorial:
        'bg-transparent text-[#F4F2FA] border-b border-[#6755C2] rounded-none px-0 hover:text-[#F4F2FA] hover:border-[#F4F2FA] transition-colors',
      outline:
        'border border-[#6755C2]/40 bg-transparent text-[#F4F2FA] hover:bg-[#08012B] hover:border-[#6755C2]',
      ghost:
        'bg-transparent text-[#8B85A8] hover:text-[#F4F2FA] hover:bg-[#08012B]/60',
      danger:
        'bg-red-900/60 text-red-100 hover:bg-red-800/80 border border-red-700/50'
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
      lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold',
      icon: 'p-2.5 rounded-xl'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'editorial' && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#F4F2FA]" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
