import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { cn } from '../../utils/cn';

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  tag?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  tag,
  title,
  subtitle,
  actions,
  className
}) => {
  return (
    <div className={cn('py-8 sm:py-12 border-b border-[#6755C2]/20 mb-8 sm:mb-12', className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-4" />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          {tag && (
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#6755C2] block">
              {tag}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-[#F4F2FA] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-[#8B85A8] leading-relaxed pt-1">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
