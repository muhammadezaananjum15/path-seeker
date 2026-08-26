import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex items-center gap-2 text-xs text-[#8B85A8]', className)} aria-label="Breadcrumb">
      <Link to="/" className="hover:text-[#F4F2FA] transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-[#8B85A8]/50" />
            {isLast || !item.href ? (
              <span className="text-[#F4F2FA] font-medium truncate max-w-[200px]">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-[#F4F2FA] transition-colors truncate max-w-[150px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
