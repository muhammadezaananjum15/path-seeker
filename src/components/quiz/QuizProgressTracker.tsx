import React from 'react';
import { Badge } from '../ui/Badge';
import { formatDuration } from '../../utils/formatters';
import { Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface QuizProgressTrackerProps {
  currentIndex: number;
  totalQuestions: number;
  timeRemaining?: number;
  currentDimension: string;
  className?: string;
}

export const QuizProgressTracker: React.FC<QuizProgressTrackerProps> = ({
  currentIndex,
  totalQuestions,
  timeRemaining,
  currentDimension,
  className
}) => {
  const percent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className={cn('bg-[#08012B] border border-[#6755C2]/30 rounded-2xl p-5 shadow-md space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="royal" size="sm">
            {currentDimension}
          </Badge>
          <span className="text-xs font-mono text-[#8B85A8]">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {timeRemaining !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#6755C2]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDuration(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#07031A] h-2 rounded-full overflow-hidden border border-[#6755C2]/20">
        <div
          className="bg-gradient-to-r from-[#402D9C] to-[#6755C2] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#8B85A8] font-mono">
        <span>Assessment Progress</span>
        <span>{percent}% Complete</span>
      </div>
    </div>
  );
};
