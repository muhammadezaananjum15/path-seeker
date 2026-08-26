import React from 'react';
import { StoryTimelineStage } from '../../types';
import { Badge } from '../ui/Badge';
import { Milestone, BookOpen, AlertCircle, Sparkles, Award, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StoryTimelineProps {
  timeline: StoryTimelineStage[];
  className?: string;
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({ timeline, className }) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Education':
        return <BookOpen className="w-4 h-4 text-[#6755C2]" />;
      case 'The Challenge':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'The Turning Point':
        return <Sparkles className="w-4 h-4 text-[#F4F2FA]" />;
      case 'Skills Acquired':
        return <Milestone className="w-4 h-4 text-[#6755C2]" />;
      case 'The Breakthrough':
        return <Award className="w-4 h-4 text-[#F4F2FA]" />;
      case 'Long-term Impact':
        return <TrendingUp className="w-4 h-4 text-[#6755C2]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#6755C2]" />;
    }
  };

  return (
    <div className={cn('relative space-y-8', className)}>
      {/* Central dotted vertical spine */}
      <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-[#6755C2]/40 -z-0" />

      {timeline.map((item, idx) => (
        <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
          {/* Node Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#08012B] border-2 border-[#6755C2] flex items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(103,85,194,0.3)] group-hover:scale-105 group-hover:bg-[#402D9C] transition-all">
            {getStageIcon(item.stage)}
          </div>

          {/* Detailed Box */}
          <div className="flex-1 bg-[#08012B] border border-[#6755C2]/30 rounded-2xl p-6 shadow-md group-hover:border-[#6755C2]/70 transition-all space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="royal" size="sm">
                STAGE 0{idx + 1} · {item.stage.toUpperCase()}
              </Badge>
              <span className="text-xs text-[#8B85A8] font-mono">
                {item.period}
              </span>
            </div>

            <h4 className="text-lg font-bold font-editorial text-[#F4F2FA]">
              {item.title}
            </h4>

            <p className="text-xs sm:text-sm text-[#8B85A8] leading-relaxed">
              {item.description}
            </p>

            {/* Key Lesson Quote */}
            <div className="p-3.5 rounded-xl bg-[#07031A] border-l-2 border-[#6755C2] text-xs font-mono text-[#F4F2FA]/90">
              <span className="text-[#6755C2] font-bold block text-[10px] uppercase mb-0.5">
                Key Strategic Takeaway
              </span>
              &quot;{item.keyLesson}&quot;
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
