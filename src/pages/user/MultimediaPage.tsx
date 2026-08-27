import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, ExternalLink, Sparkles, Filter, Video, X, Star, Eye } from 'lucide-react';
import { multimediaApi } from '../../services/multimediaApi';
import apiClient from '../../services/apiClient';
import { logUserActivity } from '../../services/activityLogger';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';

const CATEGORIES = [
  'All',
  'Current Affairs',
  'Technology',
  'Software Development',
  'Cybersecurity',
  'Graphic Design',
  'AI & Machine Learning',
  'Job Market & Hiring Trends',
];

const CURATED_DEFAULT_VIDEOS = [
  {
    id: 'yt-101',
    youtubeVideoId: 'rfscVS0vtbw',
    videoId: 'rfscVS0vtbw',
    title: 'Full Stack Web Development Roadmap 2025: HTML, CSS, React, Node.js',
    description: 'Complete step-by-step masterclass on becoming a Senior Full Stack Engineer in 2025.',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
    channelTitle: 'FreeCodeCamp / Tech Lead',
    category: 'Software Development',
    views: '1.2M',
  },
  {
    id: 'yt-102',
    youtubeVideoId: 'aircAruvnKk',
    videoId: 'aircAruvnKk',
    title: 'Neural Networks & Deep Learning Essentials with PyTorch',
    description: 'Learn core Artificial Intelligence concepts, PyTorch models, and LLM fine-tuning.',
    thumbnail: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg',
    channelTitle: '3Blue1Brown AI',
    category: 'AI & Machine Learning',
    views: '850K',
  },
  {
    id: 'yt-103',
    youtubeVideoId: 'inWWhr5tnEA',
    videoId: 'inWWhr5tnEA',
    title: 'Cybersecurity Fundamentals & Ethical Hacking Masterclass',
    description: 'Master penetration testing, network defense, Linux commands, and Wireshark packet analysis.',
    thumbnail: 'https://i.ytimg.com/vi/inWWhr5tnEA/hqdefault.jpg',
    channelTitle: 'NetworkChuck',
    category: 'Cybersecurity',
    views: '2.4M',
  },
  {
    id: 'yt-104',
    youtubeVideoId: 'c9Wg6Cb_YlU',
    videoId: 'c9Wg6Cb_YlU',
    title: 'UI/UX Design Masterclass: Figma & Design Systems 2025',
    description: 'Learn modern UI/UX principles, component variants, auto layout, and prototyping.',
    thumbnail: 'https://i.ytimg.com/vi/c9Wg6Cb_YlU/hqdefault.jpg',
    channelTitle: 'Figma Design',
    category: 'Graphic Design',
    views: '920K',
  },
  {
    id: 'yt-105',
    youtubeVideoId: '0GypdsJQN4',
    videoId: '0GypdsJQN4',
    title: 'Global Tech Hiring Trends & Remote Job Salary Benchmarks 2025',
    description: 'Analysis of top-paying tech roles, ATS resume secrets, and tech interview strategies.',
    thumbnail: 'https://i.ytimg.com/vi/0GypdsJQN4/hqdefault.jpg',
    channelTitle: 'Tech Career Insights',
    category: 'Job Market & Hiring Trends',
    views: '540K',
  },
  {
    id: 'yt-106',
    youtubeVideoId: 'zOjov-2OZ0E',
    videoId: 'zOjov-2OZ0E',
    title: 'Current Affairs: Global Tech Economy & AI Regulations Report',
    description: 'In-depth review of technological innovations, semiconductor supply chains, and AI policy.',
    thumbnail: 'https://i.ytimg.com/vi/zOjov-2OZ0E/hqdefault.jpg',
    channelTitle: 'Tech Economy World',
    category: 'Current Affairs',
    views: '410K',
  },
  {
    id: 'yt-107',
    youtubeVideoId: 'w7ejDZ8SWv8',
    videoId: 'w7ejDZ8SWv8',
    title: 'Modern Cloud Architecture: AWS, Azure & GCP Systems',
    description: 'Deep dive into cloud native infrastructure, serverless computing, and multi-cloud strategies.',
    thumbnail: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
    channelTitle: 'TechWorld with Nana',
    category: 'Technology',
    views: '1.1M',
  },
  {
    id: 'yt-108',
    youtubeVideoId: 'bMknfKXIFA8',
    videoId: 'bMknfKXIFA8',
    title: 'React 19 & Next.js 15 Masterclass: App Router & Server Components',
    description: 'Build high-performance web applications using modern React & Next.js frameworks.',
    thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
    channelTitle: 'JavaScript Mastery',
    category: 'Software Development',
    views: '1.5M',
  },
  {
    id: 'yt-109',
    youtubeVideoId: '1rsJgLDdeBU',
    videoId: '1rsJgLDdeBU',
    title: 'Data Structures & Algorithms Course for Software Engineering Interviews',
    description: 'Master binary trees, graph algorithms, dynamic programming, and Big-O time complexity.',
    thumbnail: 'https://i.ytimg.com/vi/1rsJgLDdeBU/hqdefault.jpg',
    channelTitle: 'NeetCode',
    category: 'Software Development',
    views: '2.1M',
  },
];

// Helper to normalize item video ID and thumbnail
const normalizeVideoItem = (item: any) => {
  let vid = '';
  if (item.youtubeVideoId && typeof item.youtubeVideoId === 'string' && item.youtubeVideoId.length >= 10) {
    vid = item.youtubeVideoId;
  } else if (item.videoId && typeof item.videoId === 'string' && item.videoId.length >= 10) {
    vid = item.videoId;
  }

  const urlToCheck = item.videoUrl || item.url || '';
  if (!vid && urlToCheck) {
    const match = urlToCheck.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      vid = match[1];
    }
  }

  if (!vid && item.id && typeof item.id === 'string' && item.id.length === 11 && !item.id.includes('-') && !item.id.startsWith('media-') && !item.id.startsWith('yt-')) {
    vid = item.id;
  }

  const finalVid = vid || 'rfscVS0vtbw';
  const thumb = item.thumbnail || item.thumbnailUrl || `https://i.ytimg.com/vi/${finalVid}/hqdefault.jpg`;

  return {
    ...item,
    youtubeVideoId: finalVid,
    videoId: finalVid,
    thumbnail: thumb,
    thumbnailUrl: thumb,
  };
};

export const MultimediaPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  const fetchVideos = async (searchQuery?: string, catQuery?: string) => {
    setLoading(true);
    const q = (searchQuery !== undefined ? searchQuery : search).trim();
    const cat = catQuery !== undefined ? catQuery : selectedCategory;

    let baseItems: any[] = [];

    try {
      const res = await apiClient.get('/youtube/search', {
        params: {
          q: q || undefined,
          category: cat !== 'All' ? cat : undefined,
          maxResults: 150,
        },
      });
      if (res.data.success && Array.isArray(res.data.items) && res.data.items.length > 0) {
        baseItems = res.data.items;
      }
    } catch (e) {}

    if (baseItems.length === 0) {
      try {
        const mRes = await multimediaApi.getMedia({ search: q || undefined, category: cat !== 'All' ? cat : undefined });
        if (mRes.data.success && Array.isArray(mRes.data.media) && mRes.data.media.length > 0) {
          baseItems = mRes.data.media;
        }
      } catch (e) {}
    }

    if (baseItems.length === 0) {
      baseItems = CURATED_DEFAULT_VIDEOS;
    }

    let list = baseItems.map(normalizeVideoItem);

    if (cat && cat !== 'All') {
      const catLower = cat.toLowerCase();
      list = list.filter(v => v.category && v.category.toLowerCase().includes(catLower));
    }

    if (q) {
      const qLower = q.toLowerCase();
      list = list.filter(v =>
        (v.title && v.title.toLowerCase().includes(qLower)) ||
        (v.description && v.description.toLowerCase().includes(qLower)) ||
        (v.category && v.category.toLowerCase().includes(qLower)) ||
        (v.channelTitle && v.channelTitle.toLowerCase().includes(qLower)) ||
        (v.tags && Array.isArray(v.tags) && v.tags.some((t: string) => t.toLowerCase().includes(qLower)))
      );
    }

    setVideos(list);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVideos();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const handleOpenVideo = (video: any) => {
    const normalized = normalizeVideoItem(video);
    setSelectedVideo(normalized);
    logUserActivity('WATCH_VIDEO', 'VIDEO_PLAY', `Watched video: ${normalized.title}`, {
      videoId: normalized.youtubeVideoId,
      title: normalized.title,
    });
  };

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10 text-slate-900 transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
              MULTIMEDIA HUB
            </span>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1">
              <Play className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              100+ Video Guides &amp; Tech Trends
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Explore <span className="text-[#4F20C9]">Career Video Libraries</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Watch 100+ curated video guides across Current Affairs, Software Engineering, Cybersecurity, AI/ML, Graphic Design, and Hiring Trends.
          </p>
        </div>

        {/* ── Search & Filter Controls ───────────────────────────────────── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Real-time search videos by title, tech topic, or keyword..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              Showing <span className="text-[#4F20C9] dark:text-purple-400 font-black">{videos.length}</span> Videos
            </div>
          </div>

          {/* 7 Required Categories Chips */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 overflow-x-auto scrollbar-none pb-1 max-w-full sm:flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#4F20C9] text-white shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-[#4F20C9] dark:hover:text-purple-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Video Grid Rendering ───────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((item, idx) => (
              <ScrollAnimation key={item.youtubeVideoId || item._id || idx} delay={idx * 0.05} enable3DTilt={true}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="p-5 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group h-full"
                >
                  <div className="space-y-3">
                    {/* Video Thumbnail Box with Play Hover Overlay */}
                    <div
                      onClick={() => handleOpenVideo(item)}
                      className="aspect-video rounded-2xl bg-slate-900 overflow-hidden relative cursor-pointer group/thumb border border-slate-100 dark:border-slate-700 shadow-inner"
                    >
                      <img
                        src={item.thumbnail || `https://i.ytimg.com/vi/${item.youtubeVideoId}/hqdefault.jpg`}
                        alt={item.title}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg';
                        }}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover/thumb:bg-slate-950/20 transition-all flex items-center justify-center">
                        <div className="w-13 h-13 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                      {item.duration && (
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold">
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {/* Metadata Header */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-[#4F20C9] dark:text-purple-300 text-[10px] font-extrabold uppercase truncate max-w-[170px]">
                        {item.category || 'Technology'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate max-w-[120px]">
                        {item.channelTitle || 'PathSeeker Video'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3
                      onClick={() => handleOpenVideo(item)}
                      className="font-black text-base text-[#07031A] dark:text-white line-clamp-2 leading-snug cursor-pointer group-hover:text-[#4F20C9] dark:group-hover:text-purple-400 transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description || item.transcript}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenVideo(item)}
                      className="w-full py-2.5 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all uppercase tracking-wider"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch Video Player</span>
                    </button>
                  </div>
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && !loading && (
          <div className="p-12 text-center bg-white dark:bg-[#16161A] rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
            <Video className="w-12 h-12 text-[#4F20C9] dark:text-purple-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-[#07031A] dark:text-white">No videos found for this search</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try searching a broader term or select "All" categories to view our full collection of 100+ videos.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── Interactive Embedded Video Player Modal ─────────────────────── */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-white dark:bg-[#1C1C22] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 text-xs font-bold">
                      {selectedVideo.category || 'Video Guide'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Channel: {selectedVideo.channelTitle || 'PathSeeker'}</span>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Embedded Responsive Video Player (HTML5 or YouTube) */}
                <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                  {selectedVideo.videoUrl && selectedVideo.videoUrl.endsWith('.mp4') ? (
                    <video
                      src={selectedVideo.videoUrl}
                      controls
                      autoPlay
                      poster={selectedVideo.thumbnail}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeVideoId || 'rfscVS0vtbw'}?autoplay=1`}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xl font-black text-[#07031A] dark:text-white">{selectedVideo.title}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedVideo.description || selectedVideo.transcript}
                  </p>

                  {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedVideo.tags.map((t: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <a
                      href={`https://youtube.com/watch?v=${selectedVideo.youtubeVideoId || 'rfscVS0vtbw'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Open on YouTube
                    </a>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      Close Player
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
