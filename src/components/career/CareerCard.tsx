import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Career } from '../../types';
import { Badge } from '../ui/Badge';
import { CareerScoreBadge } from './CareerScoreBadge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useBookmarkStore } from '../../stores/useBookmarkStore';
import { useCareerStore } from '../../stores/useCareerStore';
import { useUIStore } from '../../stores/useUIStore';
import { Bookmark, FileText, Scale, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CareerCardProps {
  career: Career;
  viewMode?: 'grid' | 'editorial';
  className?: string;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, viewMode = 'grid', className }) => {
  const navigate = useNavigate();
  const { isCareerBookmarked, toggleCareerBookmark } = useBookmarkStore();
  const { comparedCareerIds, toggleCompareCareer } = useCareerStore();
  const { openNotesModal, addToast } = useUIStore();

  const isBookmarked = isCareerBookmarked(career.id);
  const isCompared = comparedCareerIds.includes(career.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleCareerBookmark(career.id);
    addToast({
      title: added ? 'Career Saved' : 'Career Removed',
      message: added ? `${career.title} added to your passport bookmarks.` : `${career.title} removed.`,
      type: added ? 'success' : 'info'
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompareCareer(career.id);
  };

  const handleNotes = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openNotesModal(career.id, career.title);
  };

  if (viewMode === 'editorial') {
    return (
      <div
        className={cn(
          'group relative bg-white border border-slate-200/90 hover:border-indigo-500/80 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6',
          className
        )}
      >
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="royal" size="sm">
              {career.domain}
            </Badge>
            <Badge variant="demand-high" size="sm">
              {career.demandLevel} Demand
            </Badge>
            <CareerScoreBadge score={career.matchScore} size="sm" />
          </div>

          <div>
            <Link
              to={`/careers/${career.id}`}
              className="text-lg sm:text-xl font-extrabold font-editorial text-slate-900 group-hover:text-indigo-600 transition-colors"
            >
              {career.title}
            </Link>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-2xl leading-relaxed">
              {career.shortDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {career.requiredSkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-50/70 text-indigo-900 border border-indigo-100 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Avg. Salary</span>
            <span className="text-base font-bold font-mono text-slate-900">
              {formatCurrency(career.averageSalary)}
              <span className="text-xs font-normal text-slate-500">/yr</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompare}
              title={isCompared ? 'Remove from Compare' : 'Compare Career'}
              className={cn(
                'p-2 rounded-xl border text-xs transition-all cursor-pointer',
                isCompared
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              )}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={handleBookmark}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark Career'}
              className={cn(
                'p-2 rounded-xl border text-xs transition-all cursor-pointer',
                isBookmarked
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              )}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/careers/${career.id}`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Grid Card (Matches Part 2 Reference Screenshot)
  return (
    <div
      className={cn(
        'group relative bg-white border border-slate-200/90 hover:border-indigo-500/80 rounded-2xl p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between',
        className
      )}
    >
      {/* Top row with badges and action shortcuts */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="soft" size="sm">
            {career.domain}
          </Badge>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCompare}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              className={cn(
                'p-1.5 rounded-lg border text-xs transition-all cursor-pointer',
                isCompared
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-indigo-600'
              )}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNotes}
              title="Add Note"
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleBookmark}
              title={isBookmarked ? 'Bookmarked' : 'Save to Passport'}
              className={cn(
                'p-1.5 rounded-lg border text-xs transition-all cursor-pointer',
                isBookmarked
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-indigo-600'
              )}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title and description */}
        <Link
          to={`/careers/${career.id}`}
          className="block text-lg font-extrabold font-editorial text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
        >
          {career.title}
        </Link>
        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {career.shortDescription}
        </p>

        {/* Key required skills pills */}
        <div className="flex flex-wrap gap-1.5 my-4">
          {career.requiredSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-50/70 text-indigo-900 border border-indigo-100/80 font-medium"
            >
              {skill}
            </span>
          ))}
          {career.requiredSkills.length > 3 && (
            <span className="text-[10px] text-slate-500 self-center font-mono">
              +{career.requiredSkills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom info section */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Avg. Salary</span>
          <span className="text-sm font-bold font-mono text-slate-900">
            {formatCurrency(career.averageSalary)}
          </span>
        </div>

        <Link
          to={`/careers/${career.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-0.5 duration-200"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
