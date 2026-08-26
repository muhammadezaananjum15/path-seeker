import React from 'react';
import { User } from '../../types';
import { ProgressRing } from './ProgressRing';
import { PassportSeal } from './PassportSeal';
import { PerforatedDivider } from '../ui/PerforatedDivider';
import { Badge } from '../ui/Badge';
import { Compass, Sparkles, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PassportCardProps {
  user: User;
  onEditProfile?: () => void;
  className?: string;
}

export const PassportCard: React.FC<PassportCardProps> = ({ user, onEditProfile, className }) => {
  return (
    <div
      className={cn(
        'relative bg-[#08012B] border border-[#6755C2]/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(3,3,5,0.9)] overflow-hidden transition-all duration-300 hover:border-[#6755C2]/70',
        className
      )}
    >
      {/* Background document watermark & subtle radial light */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#402D9C]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-[#6755C2]/10 blur-3xl pointer-events-none" />

      {/* Passport Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#6755C2]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#07031A] border border-[#6755C2]/40 flex items-center justify-center text-[#6755C2]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B85A8]">
              OFFICIAL CAREER PASSPORT
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-editorial text-[#F4F2FA]">
                PATHSEEKER DIGITAL DOSSIER
              </h3>
              <Badge variant="royal" size="sm">
                ACTIVE
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[#8B85A8] text-[10px] block">PASSPORT NO.</span>
          <span className="text-[#F4F2FA] font-bold tracking-wider">{user.passportId}</span>
        </div>
      </div>

      {/* Main Identity Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
        {/* Avatar and Role */}
        <div className="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#6755C2]/50 shadow-[0_0_25px_rgba(103,85,194,0.3)]"
            />
            <div className="absolute -bottom-2 -right-2 bg-[#402D9C] text-[#F4F2FA] p-1 rounded-full border-2 border-[#08012B]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-editorial text-[#F4F2FA]">
                {user.name}
              </h2>
              <Badge variant="soft" size="sm">
                {user.role}
              </Badge>
            </div>
            <p className="text-xs text-[#8B85A8] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#6755C2]" />
              <span>{user.location}</span>
              <span>·</span>
              <span>Member since 2026</span>
            </p>
            <p className="text-xs text-[#F4F2FA]/80 line-clamp-2 max-w-xl leading-relaxed pt-1">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Passport Score & Seal */}
        <div className="md:col-span-4 flex items-center justify-end gap-4 border-t md:border-t-0 md:border-l border-[#6755C2]/20 pt-4 md:pt-0 md:pl-6">
          <ProgressRing
            percentage={user.passportScore}
            size={96}
            strokeWidth={6}
            label="Clarity Index"
            sublabel="Score"
          />
          <PassportSeal passportId={user.passportId} size="sm" />
        </div>
      </div>

      <PerforatedDivider label="PASSPORT ATTRIBUTES & CLARITY INDEX" />

      {/* Attributes Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-[#07031A] border border-[#6755C2]/20">
          <span className="text-[10px] text-[#8B85A8] uppercase font-mono block">Primary Target</span>
          <span className="font-semibold text-[#F4F2FA] mt-0.5 block truncate">
            {user.careerPreferences.preferredRoles[0] || 'AI / ML Engineer'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#07031A] border border-[#6755C2]/20">
          <span className="text-[10px] text-[#8B85A8] uppercase font-mono block">Work Style</span>
          <span className="font-semibold text-[#F4F2FA] mt-0.5 block">
            {user.careerPreferences.workStyle} Preference
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#07031A] border border-[#6755C2]/20">
          <span className="text-[10px] text-[#8B85A8] uppercase font-mono block">Target Salary</span>
          <span className="font-semibold text-[#F4F2FA] mt-0.5 block">
            ${(user.careerPreferences.expectedSalary / 1000).toFixed(0)}k / year
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#07031A] border border-[#6755C2]/20">
          <span className="text-[10px] text-[#8B85A8] uppercase font-mono block">Stamps Unlocked</span>
          <span className="font-semibold text-[#F4F2FA] mt-0.5 block">
            {user.unlockedStamps.length} Stamps Issued
          </span>
        </div>
      </div>
    </div>
  );
};
