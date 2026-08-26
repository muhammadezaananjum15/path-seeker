import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Quote, PlusCircle, CheckCircle2, User, Search, Sparkles } from 'lucide-react';
import { storyApi } from '../../services/storyApi';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Stories');

  const categories = ['All Stories', 'Student Pivots', 'Bootcamp Graduates', 'Career Changers', 'Executive Leaders'];

  useEffect(() => {
    storyApi
      .getApprovedStories()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.stories)) {
          setStories(res.data.stories);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen py-12 text-slate-900">
      <div className="max-w-[1440px] mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
              ALUMNI STORIES & INSPIRATION
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Real Journeys. Real <span className="text-[#4F20C9]">Transformation.</span>
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl font-medium">
              Read how students, graduates, and career changers found their trajectory using PathSeeker.
            </p>
          </div>

          <Link
            to="/submit-story"
            className="px-6 py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your Journey</span>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#4F20C9] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Story Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-12 rounded-[40px] bg-white border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
              FEATURED SUCCESS STORY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#07031A] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              "How I Pivoted from Biology Graduate to Lead Data Analyst in 8 Months"
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              "PathSeeker's AI interest quiz helped me map my analytical lab skills directly to data science. The step-by-step roadmap and ATS resume templates were game-changers during my job hunt."
            </p>
            <div className="pt-2 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#4F20C9] text-white flex items-center justify-center font-black text-sm">
                PS
              </div>
              <div>
                <p className="text-sm font-bold text-[#07031A]">Priya Sharma</p>
                <p className="text-xs text-[#4F20C9] font-semibold">Data Analyst @ HealthTech Global</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Community Transformations
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.map((story, idx) => (
                <ScrollAnimation key={story._id || idx} delay={idx * 0.1} enable3DTilt={true}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="p-7 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-6 h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-black uppercase">
                          {story.domain}
                        </span>
                        <Quote className="w-6 h-6 text-[#4F20C9]/30" />
                      </div>

                      <h3 className="text-xl font-bold text-[#07031A] leading-snug">
                        "{story.headline}"
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {story.storyText}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">By {story.authorName}</span>
                      <Link
                        to={`/stories/${story._id}`}
                        className="text-xs font-bold text-[#4F20C9] hover:underline flex items-center gap-1"
                      >
                        <span>Read Full Journey</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
