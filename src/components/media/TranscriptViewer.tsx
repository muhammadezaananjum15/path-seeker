import React from 'react';
import { TranscriptItem } from '../../types';
import { Play } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TranscriptViewerProps {
  transcript: TranscriptItem[];
  currentTime: number;
  onSeek: (seconds: number) => void;
  className?: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  currentTime,
  onSeek,
  className
}) => {
  return (
    <div className={cn('bg-[#08012B] border border-[#6755C2]/25 rounded-2xl p-6 shadow-md space-y-4', className)}>
      <div className="flex items-center justify-between pb-3 border-b border-[#6755C2]/20">
        <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#F4F2FA]">
          Interactive Spoken Transcript
        </h4>
        <span className="text-[11px] text-[#8B85A8]">
          Click any timestamp to jump
        </span>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
        {transcript.map((item, idx) => {
          const isCurrent =
            currentTime >= item.timestamp &&
            (idx === transcript.length - 1 || currentTime < transcript[idx + 1].timestamp);

          return (
            <button
              key={idx}
              onClick={() => onSeek(item.timestamp)}
              className={cn(
                'w-full p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5',
                isCurrent
                  ? 'bg-[#402D9C]/50 border-[#6755C2] shadow-[0_0_15px_rgba(103,85,194,0.2)]'
                  : 'bg-[#07031A] border-transparent hover:border-[#6755C2]/30 hover:bg-[#07031A]/80'
              )}
            >
              <div className="flex items-center gap-1 font-mono text-xs text-[#6755C2] shrink-0 pt-0.5">
                <Play className="w-3 h-3 fill-current" />
                <span>{item.formattedTime}</span>
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-[#8B85A8] block uppercase font-mono">
                  {item.speaker}
                </span>
                <p
                  className={cn(
                    'text-xs leading-relaxed mt-0.5',
                    isCurrent ? 'text-[#F4F2FA] font-medium' : 'text-[#8B85A8]'
                  )}
                >
                  {item.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
