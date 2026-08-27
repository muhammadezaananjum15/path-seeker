import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyApi } from '../../services/storyApi';
import { storyService } from '../../services/storyService';
import { ArrowLeft, Calendar, Award, Share2, Sparkles, CheckCircle2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const StoryDetailPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (storyId) {
      setLoading(true);
      storyService
        .fetchStoryById(storyId)
        .then((data) => {
          if (data) setStory(data);
        })
        .finally(() => setLoading(false));
    }
  }, [storyId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#4F20C9] animate-spin" />
          <span>Loading Story details from MongoDB...</span>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-6 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#07031A]">Story Not Found</h2>
        <p className="text-xs text-slate-500">The story you are looking for may have been removed or updated.</p>
        <Link to="/stories" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F20C9] text-white text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Stories Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/stories" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#4F20C9] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Success Stories</span>
          </Link>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-purple-300 flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#4F20C9]" />
            <span>{copied ? 'Copied Link!' : 'Share Story'}</span>
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-8 sm:p-12 rounded-[32px] bg-white border border-slate-200/90 shadow-xl space-y-8">
          {/* Author Banner Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={story.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={story.authorName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-purple-100 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#07031A]">{story.authorName}</h1>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" title="Verified Alumni" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase tracking-wider">
                  {story.domain}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Status</span>
              <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-black uppercase">
                {story.status || 'approved'}
              </span>
            </div>
          </div>

          {/* Headline & Body */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-[#07031A] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              "{story.headline}"
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
              {story.storyText}
            </p>
          </div>

          {/* Career Timeline Section */}
          {story.timeline && story.timeline.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-lg border border-slate-800">
              <h3 className="font-extrabold text-sm uppercase tracking-widest text-purple-400 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Career Journey Milestones
              </h3>
              <div className="space-y-6 relative border-l-2 border-purple-500/50 pl-6 ml-2">
                {story.timeline.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1 relative">
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-slate-900" />
                    <span className="text-xs font-black text-amber-300 tracking-wide uppercase">{item.year}</span>
                    <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

