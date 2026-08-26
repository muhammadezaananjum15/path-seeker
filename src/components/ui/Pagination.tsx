import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2 mt-8', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-[#08012B] border border-[#6755C2]/20 text-[#8B85A8] hover:text-[#F4F2FA] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer',
            currentPage === page
              ? 'bg-[#402D9C] text-[#F4F2FA] border border-[#6755C2]'
              : 'bg-[#08012B] text-[#8B85A8] hover:text-[#F4F2FA] border border-[#6755C2]/15'
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-[#08012B] border border-[#6755C2]/20 text-[#8B85A8] hover:text-[#F4F2FA] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
