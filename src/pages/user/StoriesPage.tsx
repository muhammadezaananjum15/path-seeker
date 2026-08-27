import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ArrowRight, Quote, PlusCircle, Search, Sparkles, Heart, Clock, Compass, Filter } from 'lucide-react';
import { storyApi } from '../../services/storyApi';
import { mockStories } from '../../data/mockStories';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  const domains = ['All', 'Technology', 'Data Science', 'Design', 'Business', 'Engineering'];

  useEffect(() => {
    setLoading(true);
    storyApi
      .getApprovedStories({ domain: selectedDomain === 'All' ? undefined : selectedDomain })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.stories) && res.data.stories.length > 0) {
          setStories(res.data.stories);
        } else {
          // API returned empty — use mock fallback
          const fallback = mockStories.map((s) => ({
            _id: s.id,
            authorName: s.candidateName,
            headline: s.title,
            storyText: s.summary,
            domain: s.domain,
            imageUrl: s.avatar,
            timeline: s.timeline?.map((t) => ({ year: t.period, title: t.title, description: t.description })),
            status: 'approved',
          }));
          const filtered = selectedDomain === 'All' ? fallback : fallback.filter((s) => s.domain === selectedDomain);
          setStories(filtered);
        }
      })
      .catch((err) => {
        console.warn('Failed to load stories from MongoDB, using local fallback:', err);
        const fallback = mockStories.map((s) => ({
          _id: s.id,
          authorName: s.candidateName,
          headline: s.title,
          storyText: s.summary,
          domain: s.domain,
          imageUrl: s.avatar,
          timeline: s.timeline?.map((t) => ({ year: t.period, title: t.title, description: t.description })),
          status: 'approved',
        }));
        const filtered = selectedDomain === 'All' ? fallback : fallback.filter((s) => s.domain === selectedDomain);
        setStories(filtered);
      })
      .finally(() => setLoading(false));
  }, [selectedDomain]);

  const toggleLike = (id: string) => {
    setLikedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.storyText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.domain?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredStory = stories.length > 0 ? stories[0] : null;

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 text-slate-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero Banner */}
        <div className="relative rounded-[36px] bg-gradient-to-r from-[#07031A] via-[#2A0E80] to-[#4F20C9] p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Real Transformations • MongoDB Powered</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-200">Success Stories</span>
            </h1>
            <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed max-w-2xl">
              Explore true career evolution stories from students, graduates, and career changers who navigated their path using PathSeeker and Ask Pathseeker AI.
            </p>
            <div className="pt-3 flex items-center gap-4 flex-wrap">
              <Link
                to="/submit-story"
                className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Share Your Journey</span>
              </Link>
              <div className="flex items-center gap-6 text-xs font-bold text-purple-200 border-l border-white/20 pl-6 hidden sm:flex">
                <div>
                  <span className="text-lg font-black text-white block">100%</span>
                  <span>Verified Database Stories</span>
                </div>
                <div>
                  <span className="text-lg font-black text-white block">5+</span>
                  <span>Industry Domains</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedDomain === dom
                    ? 'bg-[#4F20C9] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories, names, roles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
            />
          </div>
        </div>

        {/* Featured Story Showcase Card */}
        {featuredStory && !searchQuery && selectedDomain === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-white via-purple-50/40 to-white border border-purple-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  SPOTLIGHT STORY
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase">
                  {featuredStory.domain}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#07031A] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                "{featuredStory.headline}"
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                "{featuredStory.storyText}"
              </p>
              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredStory.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={featuredStory.authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#4F20C9] shadow"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#07031A]">{featuredStory.authorName}</p>
                    <p className="text-xs text-[#4F20C9] font-semibold">PathSeeker Alumni</p>
                  </div>
                </div>

                <Link
                  to={`/stories/${featuredStory._id || featuredStory.id}`}
                  className="px-5 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>Read Full Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-lg border border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Career Milestones
              </h4>
              <div className="space-y-3 text-xs">
                {featuredStory.timeline && featuredStory.timeline.length > 0 ? (
                  featuredStory.timeline.map((step: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-purple-500 pl-3 space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-300">{step.year}</span>
                      <p className="font-bold text-slate-100">{step.title}</p>
                      <p className="text-[11px] text-slate-400">{step.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">Step-by-step career path verified in MongoDB.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stories Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Community Transformations ({filteredStories.length})
            </h3>
            {loading && <span className="text-xs font-bold text-[#4F20C9] animate-pulse">Syncing MongoDB...</span>}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
              <Compass className="w-12 h-12 text-purple-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-[#07031A]">No Stories Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No success stories matched your current filter or query. Be the first to share your journey!
              </p>
              <Link
                to="/submit-story"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F20C9] text-white text-xs font-bold"
              >
                Submit Story
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story, idx) => {
                const storyId = story._id || story.id;
                const isLiked = likedStories[storyId];
                return (
                  <ScrollAnimation key={storyId || idx} delay={idx * 0.08} enable3DTilt={true}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-purple-200 transition-all flex flex-col justify-between space-y-6 h-full relative"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-black uppercase tracking-wider">
                            {story.domain}
                          </span>
                          <button
                            onClick={() => toggleLike(storyId)}
                            className={`p-2 rounded-full transition-colors ${
                              isLiked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400 hover:text-rose-500'
                            }`}
                            title="Inspirational Story"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                          </button>
                        </div>

                        <h3 className="text-lg font-bold text-[#07031A] leading-snug line-clamp-2">
                          "{story.headline}"
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {story.storyText}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={story.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                            alt={story.authorName}
                            className="w-8 h-8 rounded-full object-cover border border-purple-300"
                          />
                          <span className="text-xs font-bold text-slate-800">{story.authorName}</span>
                        </div>

                        <Link
                          to={`/stories/${storyId}`}
                          className="text-xs font-bold text-[#4F20C9] hover:text-purple-700 flex items-center gap-1 group"
                        >
                          <span>Full Journey</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  </ScrollAnimation>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

