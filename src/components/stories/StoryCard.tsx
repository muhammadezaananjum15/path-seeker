import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SuccessStory } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StoryCardProps {
  story: SuccessStory;
  featured?: boolean;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, featured = false, className }) => {
  const navigate = useNavigate();

  if (featured) {
    return (
      <div
        className={cn(
          'group relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden transition-all duration-300 hover:border-indigo-500',
          className
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="royal" size="sm">
                FEATURED STORY
              </Badge>
              <Badge variant="soft" size="sm">
                {story.domain}
              </Badge>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {story.readTimeMinutes} min read
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-editorial text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {story.title}
            </h3>

            {/* Transition Path Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs font-mono">
              <span className="text-slate-500 line-through sm:no-underline">{story.roleFrom}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-slate-900 font-bold">{story.roleTo}</span>
              <span className="text-slate-500 hidden sm:inline">({story.currentCompany})</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl italic">
              &quot;{story.quote}&quot;
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/success-stories/${story.id}`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Read Full Career Journey
              </Button>
            </div>
          </div>

          {/* Candidate Avatar & Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <img
              src={story.avatar}
              alt={story.candidateName}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-600 shadow-md mb-3"
            />
            <h4 className="text-base font-bold font-editorial text-slate-900">
              {story.candidateName}
            </h4>
            <span className="text-xs text-indigo-600 font-semibold mt-0.5">
              {story.roleTo}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Verified Career Milestone
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Story Card
  return (
    <div
      className={cn(
        'group bg-white border border-slate-200/90 hover:border-indigo-500/80 rounded-2xl p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between',
        className
      )}
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="soft" size="sm">
            {story.domain}
          </Badge>
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-500" />
            {story.readTimeMinutes}m read
          </span>
        </div>

        <Link
          to={`/success-stories/${story.id}`}
          className="block text-lg font-extrabold font-editorial text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
        >
          {story.title}
        </Link>

        {/* Transition trajectory */}
        <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] font-mono flex items-center justify-between">
          <span className="text-slate-500 truncate">{story.roleFrom}</span>
          <ArrowRight className="w-3 h-3 text-indigo-600 shrink-0 mx-1.5" />
          <span className="text-slate-900 font-bold truncate">{story.roleTo}</span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic">
          &quot;{story.quote}&quot;
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={story.avatar}
            alt={story.candidateName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <span className="text-xs font-bold text-slate-900">
            {story.candidateName}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/success-stories/${story.id}`)}
          className="text-xs text-indigo-600 font-bold hover:text-indigo-800 px-0"
          rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
        >
          Read Journey
        </Button>
      </div>
    </div>
  );
};
