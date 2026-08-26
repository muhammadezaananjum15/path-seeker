import React from 'react';
import { CareerPathStage } from '../../types';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { CheckCircle2, Milestone, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CareerJourneyTimelineProps {
  stages: CareerPathStage[];
  className?: string;
}

export const CareerJourneyTimeline: React.FC<CareerJourneyTimelineProps> = ({ stages, className }) => {
  return (
    <div className={cn('relative space-y-6', className)}>
      {/* Connecting Vertical Line */}
      <div className="absolute left-6 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-[#6755C2]/40 -z-0" />

      {stages.map((stage, idx) => (
        <div
          key={stage.stage}
          className="relative flex items-start gap-5 group"
        >
          {/* Milestone Checkpoint Node */}
          <div className="w-12 h-12 rounded-2xl bg-[#08012B] border-2 border-[#6755C2] flex items-center justify-center text-[#F4F2FA] font-mono text-xs font-bold shrink-0 shadow-[0_0_20px_rgba(103,85,194,0.3)] z-10 group-hover:scale-110 group-hover:bg-[#402D9C] transition-all duration-300">
            0{idx + 1}
          </div>

          {/* Milestone Details Card */}
          <div className="flex-1 bg-[#08012B] border border-[#6755C2]/25 rounded-2xl p-5 shadow-lg group-hover:border-[#6755C2]/60 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="royal" size="sm">
                  {stage.stage}
                </Badge>
                <span className="text-xs text-[#8B85A8] font-mono">
                  {stage.duration}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#6755C2]">
                Exp. {formatCurrency(stage.expectedSalary)}/yr
              </span>
            </div>

            <h4 className="text-base font-bold font-editorial text-[#F4F2FA] group-hover:text-[#6755C2] transition-colors">
              {stage.title}
            </h4>

            <p className="text-xs text-[#8B85A8] mt-1.5 leading-relaxed">
              {stage.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
