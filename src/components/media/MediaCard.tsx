import React from 'react';
import { Link } from 'react-router-dom';
import { MultimediaItem } from '../../types';
import { Badge } from '../ui/Badge';
import { useBookmarkStore } from '../../stores/useBookmarkStore';
import { useUIStore } from '../../stores/useUIStore';
import { Play, Clock, Star, Bookmark } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface MediaCardProps {
  media: MultimediaItem;
  className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, className }) => {
  const { isMediaBookmarked, toggleMediaBookmark } = useBookmarkStore();
  const { addToast } = useUIStore();

  const isBookmarked = isMediaBookmarked(media.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleMediaBookmark(media.id);
    addToast({
      title: added ? 'Masterclass Bookmarked' : 'Removed Bookmark',
      message: added ? `${media.title} saved to your passport.` : `${media.title} removed.`,
      type: added ? 'success' : 'info'
    });
  };

  return (
    <div
      className={cn(
        'group bg-white border border-slate-200 hover:border-indigo-500/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between',
        className
      )}
    >
      {/* Thumbnail Area with overlay badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={media.thumbnailUrl}
          alt={media.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Media Type & Domain */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="royal" size="sm">
            {media.type}
          </Badge>
          <Badge variant="soft" size="sm">
            {media.domain}
          </Badge>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={cn(
            'absolute top-3 right-3 p-1.5 rounded-lg border text-xs transition-all cursor-pointer z-10',
            isBookmarked
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white/90 border-slate-200 text-slate-700 hover:text-indigo-600'
          )}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>

        {/* Center Play Overlay Icon */}
        <Link
          to={`/multimedia/${media.id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </Link>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-indigo-400" />
          <span>{media.durationMinutes}m</span>
        </div>
      </div>

      {/* Media Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/multimedia/${media.id}`}
            className="block text-base font-bold font-editorial text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {media.title}
          </Link>
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {media.description}
          </p>
        </div>

        {/* Instructor and Metrics */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img
              src={media.instructor.avatar}
              alt={media.instructor.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate max-w-[130px]">
                {media.instructor.name}
              </span>
              <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                {media.instructor.company}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-indigo-600 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{media.rating.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
