import React, { useState, useRef, useEffect } from 'react';
import { MultimediaItem } from '../../types';
import { formatDuration } from '../../utils/formatters';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, FastForward, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface VideoPlayerProps {
  media: MultimediaItem;
  currentTime?: number;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  media,
  currentTime = 0,
  onTimeUpdate,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(currentTime);
  const [duration, setDuration] = useState(media.durationSeconds || 1200);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Sync external time jumps
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 2) {
      videoRef.current.currentTime = currentTime;
      setCurrentSeconds(currentTime);
    }
  }, [currentTime]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentSeconds(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || media.durationSeconds);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentSeconds(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      className={cn(
        'relative aspect-video w-full rounded-3xl overflow-hidden bg-[#030305] border border-[#6755C2]/40 shadow-[0_20px_50px_rgba(3,3,5,0.9)] group',
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={media.videoUrl}
        poster={media.thumbnailUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
        playsInline
      />

      {/* Center Big Play Button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#402D9C]/90 text-[#F4F2FA] border border-[#6755C2] flex items-center justify-center shadow-[0_0_40px_rgba(103,85,194,0.7)] hover:scale-110 transition-transform cursor-pointer"
        >
          <Play className="w-8 h-8 ml-1 fill-current" />
        </button>
      )}

      {/* Control Overlay Bar */}
      <div
        className={cn(
          'absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent p-4 sm:p-6 transition-opacity duration-300 space-y-3',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Scrubber Range Slider */}
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentSeconds}
            onChange={handleSeek}
            className="w-full accent-[#6755C2] bg-[#07031A] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between text-xs text-[#F4F2FA]">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-[#6755C2] transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMute}
              className="hover:text-[#6755C2] transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="font-mono text-xs text-[#8B85A8]">
              {formatDuration(Math.floor(currentSeconds))} / {formatDuration(Math.floor(duration))}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={handleSpeedChange}
              className="px-2 py-1 rounded bg-[#07031A] border border-[#6755C2]/30 hover:border-[#6755C2] text-xs transition-colors cursor-pointer"
            >
              {playbackSpeed}x
            </button>

            <button
              onClick={toggleFullscreen}
              className="hover:text-[#6755C2] transition-colors cursor-pointer p-1"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
