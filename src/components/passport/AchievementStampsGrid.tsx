import React from 'react';
import { PassportStamp } from './PassportStamp';
import { mockPassportStamps } from '../../data/mockUsers';

export interface AchievementStampsGridProps {
  unlockedStampIds?: string[];
  maxDisplay?: number;
  className?: string;
}

export const AchievementStampsGrid: React.FC<AchievementStampsGridProps> = ({
  unlockedStampIds = ['STAMP-FIRST-STEPS', 'STAMP-QUIZ-PIONEER', 'STAMP-TECH-EXPLORER'],
  maxDisplay,
  className
}) => {
  const stampsToRender = maxDisplay
    ? mockPassportStamps.slice(0, maxDisplay)
    : mockPassportStamps;

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stampsToRender.map((stamp) => {
          const isUnlocked = unlockedStampIds.includes(stamp.id);
          return (
            <PassportStamp
              key={stamp.id}
              title={stamp.title}
              category={stamp.category}
              iconName={stamp.icon}
              description={stamp.description}
              isUnlocked={isUnlocked}
              dateUnlocked={isUnlocked ? stamp.dateUnlocked : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
