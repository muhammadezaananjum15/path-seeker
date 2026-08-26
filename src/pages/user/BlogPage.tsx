import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Sparkles, ArrowRight, Bot, X, ExternalLink,
  Clock, Tag, RefreshCw, Globe, TrendingUp, Filter, ChevronRight,
  Newspaper, Zap, BarChart2, Code2, Briefcase, GraduationCap
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { articleApi } from '../../services/articleApi';

const TOPIC_CHIPS = [
  { label: 'Tech Jobs 2025', query: 'top tech jobs hiring 2025', icon: Code2 },
  { label: 'AI Careers', query: 'artificial intelligence machine learning career 2025', icon: Sparkles },
  { label: 'Remote Work', query: 'remote software engineering jobs 2025', icon: Globe },
  { label: 'Salaries', query: 'software developer salary benchmark 2025', icon: BarChart2 },
  { label: 'Career Pivot', query: 'career change tech 2025 guide', icon: TrendingUp },
  { label: 'MBA vs Tech', query: 'MBA vs tech career comparison 2025', icon: GraduationCap },
  { label: 'Startup Jobs', query: 'startup hiring tech jobs 2025', icon: Zap },
  { label: 'PM Careers', query: 'product manager career path 2025', icon: Briefcase },
];

const FALLBACK_ARTICLES = [
  {
    id: 'fb-1',
    title: 'Top 10 Highest Paying Tech Jobs in 2025',
    snippet: 'AI engineers, cloud architects, and full-stack developers top the salary charts. Learn which roles offer $150K+ packages and the exact skills required.',
    author: 'PathSeeker Editorial',
    published: new Date(Date.now() - 86400000).toISOString(),
    category: 'Industry Insights',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    url: null,
  },
  {
    id: 'fb-2',
    title: 'ATS Resume Guide: Get Shortlisted Every Time',
    snippet: 'Over 90% of Fortune 500 companies filter resumes with ATS. Here\'s exactly how to format, keyword-target, and structure your CV for maximum visibility.',
    author: 'Sarah Jenkins, HR Advisor',
    published: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'Resume & CV',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
    url: null,
  },
  {
    id: 'fb-3',
    title: 'From Biology to Data Analyst: A 6-Month Pivot Story',
    snippet: 'How one graduate leveraged SQL, Python, and a structured PathSeeker roadmap to land a data analytics role — without a CS degree.',
    author: 'PathSeeker Community',
    published: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: 'Career Guides',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    url: null,
  },
  {
    id: 'fb-4',
    title: 'Behavioral Interview Mastery: STAR Method 2025',
    snippet: 'A structured, example-rich guide to confidently answering behavioural questions at FAANG, startups, and global tech companies.',
    author: 'David Vance, Recruiter',
    published: new Date(Date.now() - 86400000 * 7).toISOString(),
    category: 'Interview Prep',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    url: null,
  },
  {
    id: 'fb-5',
    title: 'Cloud Architecture Roadmap: AWS vs Azure vs GCP',
    snippet: 'Which cloud platform should you specialize in? A deep comparison of AWS, Azure and Google Cloud career paths, certifications, and salary data.',
    author: 'PathSeeker Editorial',
    published: new Date(Date.now() - 86400000 * 9).toISOString(),
    category: 'Industry Insights',
    readTime: '9 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    url: null,
  },
  {
    id: 'fb-6',
    title: '10 Non-CS Careers That Pay $100K+ in Tech',
    snippet: 'UI/UX design, product management, technical writing, and DevRel are among the highest-paying roles that don\'t require a computer science degree.',
    author: 'PathSeeker Editorial',
    published: new Date(Date.now() - 86400000 * 12).toISOString(),
    category: 'Career Guides',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    url: null,
  },
];

const categoryColors: Record<string, string> = {
  'Industry Insights': 'bg-blue-50 text-blue-700',
  'Career Guides': 'bg-emerald-50 text-emerald-700',
  'Resume & CV': 'bg-amber-50 text-amber-700',
  'Interview Prep': 'bg-rose-50 text-rose-700',
  'Blog Article': 'bg-purple-50 text-purple-700',
  'AI Guidance': 'bg-violet-50 text-violet-700',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export const BlogPage: React.FC = () => {
  // Curated Articles State
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Industry Insights', 'Career Guides', 'Resume & CV', 'Interview Prep', 'Blog Article'];

  // Tavily Live News State
  const [liveQuery, setLiveQuery] = useState('tech industry hiring trends software 2025');
  const [liveBlogs, setLiveBlogs] = useState<any[]>([]);
  const [liveAnswer, setLiveAnswer] = useState('');
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveFetched, setLiveFetched] = useState(false);

  // AI Article Generator State
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiArticle, setAiArticle] = useState<any | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // ── Fetch curated/blogger articles ───────────────────────────────────────
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const res = await articleApi.getArticles({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: articleSearch || undefined,
      });
      if (res.data.success && Array.isArray(res.data.articles) && res.data.articles.length > 0) {
        setArticles(res.data.articles);
      } else {
        setArticles(FALLBACK_ARTICLES);
      }
    } catch {
      setArticles(FALLBACK_ARTICLES);
    } finally {
      setArticlesLoading(false);
    }
  }, [selectedCategory, articleSearch]);

  useEffect(() => {
    fetchArticles();
    fetchLiveBlogs();
  }, [selectedCategory]);

  // ── Fetch Live Tavily Blogs ───────────────────────────────────────────────
  const fetchLiveBlogs = useCallback(async (q?: string) => {
    setLiveLoading(true);
    try {
      const query = q || liveQuery;
      const res = await apiClient.get(`/search/tavily?query=${encodeURIComponent(query)}`);
      if (res.data.success) {
        const results = res.data.data?.results || [];
        setLiveBlogs(results.length > 0 ? results : []);
        setLiveAnswer(res.data.data?.answer || '');
        setLiveFetched(true);
      }
    } catch {
      setLiveFetched(true);
    } finally {
      setLiveLoading(false);
    }
  }, [liveQuery]);

  // ── Generate AI Article ──────────────────────────────────────────────────
  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setShowAiModal(true);
    setAiArticle(null);
    try {
      const res = await apiClient.post('/gemini/generate-article', { topic: aiTopic });
      if (res.data.success && res.data.article) {
        setAiArticle(res.data.article);
      } else {
        // Try fallback endpoint
        const res2 = await articleApi.generateAiArticle({ topic: aiTopic });
        if (res2.data.success && res2.data.article) {
          setAiArticle(res2.data.article);
        }
      }
    } catch {
      setAiArticle({
        title: `Career Strategy: ${aiTopic}`,
        content: `A comprehensive career guide on "${aiTopic}" covering required skills, salary benchmarks, and step-by-step roadmaps for students and professionals in 2025.`,
        category: 'AI Guidance',
        readTime: '5 min read',
        author: 'PathSeeker AI',
      });
    } finally {
      setAiLoading(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = !articleSearch || a.title.toLowerCase().includes(articleSearch.toLowerCase()) || (a.snippet || '').toLowerCase().includes(articleSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : FALLBACK_ARTICLES;

  return (
    <div className="bg-white min-h-screen py-10 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" /> Career Intelligence Blog
          </span>
          <h1
            className="text-4xl sm:text-6xl font-black text-[#07031A] tracking-tight leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Latest Career <span className="text-[#4F20C9]">Insights</span> &amp; Blogs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Curated career articles, live industry news, salary benchmarks, and AI-generated deep-dives — all in one place.
          </p>
        </motion.div>

        {/* ── Live Industry News (Tavily) ─────────────────────────────────── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Live Industry Blog News
                </h2>
                <p className="text-xs text-slate-500 font-medium">Real-time tech hiring &amp; career articles from across the web</p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
              ● Live Powered
            </span>
          </div>

          {/* Topic Chips */}
          <div className="flex flex-wrap gap-2">
            {TOPIC_CHIPS.map(({ label, query, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setLiveQuery(query);
                  fetchLiveBlogs(query);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-[#4F20C9] border border-slate-200 hover:border-purple-300 text-xs font-semibold text-slate-700 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={liveQuery}
                onChange={(e) => setLiveQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLiveBlogs()}
                placeholder="Search live blogs: e.g. Google hiring 2025, Remote jobs, AI careers..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => fetchLiveBlogs()}
              disabled={liveLoading}
              className="px-5 py-3 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs shadow-md uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-all flex-shrink-0"
            >
              {liveLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /><span>Loading...</span></>
              ) : (
                <><Search className="w-4 h-4" /><span>Search</span></>
              )}
            </button>
          </div>

          {/* AI Answer Banner */}
          {liveAnswer && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-medium text-purple-900 leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#4F20C9] shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-[#07031A] block mb-1">AI Summary:</span>
                {liveAnswer}
              </div>
            </div>
          )}

          {/* Live Blog Cards or CTA */}
          {!liveFetched && !liveLoading ? (
            <div className="text-center py-10 space-y-3">
              <Globe className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">Click a topic chip or search to load live industry news</p>
              <button
                onClick={() => fetchLiveBlogs()}
                className="px-6 py-2.5 rounded-full bg-[#4F20C9] text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Load Latest News
              </button>
            </div>
          ) : liveLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : liveBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveBlogs.slice(0, 8).map((blog, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ y: -4 }}
                  href={blog.url || blog.link || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all space-y-2 group flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#4F20C9] truncate max-w-[120px]">
                        {blog.source || 'Career Portal'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4F20C9] transition-colors flex-shrink-0" />
                    </div>
                    <h4 className="text-xs font-bold text-[#07031A] line-clamp-2 leading-snug group-hover:text-[#4F20C9] transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                      {blog.snippet}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#4F20C9] pt-2 block">Read Article →</span>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No live results found. Try a different search term.
            </div>
          )}
        </div>

        {/* ── AI Gemini Article Generator ─────────────────────────────────── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#290C86] via-[#4F20C9] to-purple-700 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Generate a Custom AI Career Article
              </h2>
              <p className="text-xs text-purple-200">Powered by PathSeeker Gemini AI — instant deep-dive career guides</p>
            </div>
          </div>

          <form onSubmit={handleGenerateArticle} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. How to become a Product Manager in 2025, Python roadmap, Cloud Architect salary..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiTopic.trim()}
              className="px-7 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading ? 'Generating...' : 'Generate Article'}
            </button>
          </form>
        </div>

        {/* ── Curated Articles Section ─────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#4F20C9] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Latest Blog Articles
                </h2>
                <p className="text-xs text-slate-500">Expert-written career guides &amp; industry deep-dives</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
                  placeholder="Search articles..."
                  className="pl-9 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] w-44"
                />
              </div>
              <button
                onClick={fetchArticles}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#4F20C9] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300 hover:text-[#4F20C9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Article (first card, large) */}
          {!articlesLoading && displayArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Featured Big Card */}
              <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${categoryColors[displayArticles[0].category] || 'bg-purple-50 text-purple-700'}`}>
                      {displayArticles[0].category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {displayArticles[0].readTime || '5 min read'}
                    </span>
                  </div>
                  {displayArticles[0].imageUrl && (
                    <img
                      src={displayArticles[0].imageUrl}
                      alt={displayArticles[0].title}
                      className="w-full h-44 object-cover rounded-2xl"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <h3 className="text-2xl font-black text-[#07031A] leading-snug" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {displayArticles[0].title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {displayArticles[0].snippet}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{displayArticles[0].author}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(displayArticles[0].published)}</p>
                  </div>
                  {displayArticles[0].url ? (
                    <a
                      href={displayArticles[0].url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-purple-50 text-[#4F20C9] font-bold text-xs uppercase tracking-wider">
                      Featured <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Stack of 2 smaller cards */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {displayArticles.slice(1, 3).map((article, idx) => (
                  <div
                    key={article.id || idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex-1 space-y-3 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${categoryColors[article.category] || 'bg-purple-50 text-purple-700'}`}>
                          {article.category}
                        </span>
                      </div>
                      <h4 className="font-black text-base text-[#07031A] leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{article.snippet}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400">{formatDate(article.published)}</p>
                      {article.url ? (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#4F20C9] hover:underline flex items-center gap-1"
                        >
                          Read <ArrowRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">{article.readTime}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Articles Grid */}
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayArticles.slice(3).map((article, idx) => (
                <motion.div
                  key={article.id || idx}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded-2xl"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${categoryColors[article.category] || 'bg-purple-50 text-purple-700'}`}>
                        {article.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime || '5 min'}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-[#07031A] leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {article.snippet}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-700 truncate max-w-[130px]">{article.author}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(article.published)}</p>
                    </div>
                    {article.url ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#4F20C9] hover:underline flex items-center gap-1"
                      >
                        Read <ArrowRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <Tag className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── AI Article Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !aiLoading && setShowAiModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h3 className="font-black text-xl text-[#07031A]">PathSeeker AI Career Article</h3>
                </div>
                {!aiLoading && (
                  <button
                    onClick={() => setShowAiModal(false)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {aiLoading ? (
                <div className="text-center py-16 space-y-4">
                  <Sparkles className="w-12 h-12 text-[#4F20C9] animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-700">PathSeeker AI is crafting your article...</p>
                  <p className="text-xs text-slate-400">Analyzing career market data and generating insights</p>
                </div>
              ) : aiArticle ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    {aiArticle.category && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${categoryColors[aiArticle.category] || 'bg-purple-50 text-purple-700'}`}>
                        {aiArticle.category}
                      </span>
                    )}
                    {aiArticle.readTime && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {aiArticle.readTime}
                      </span>
                    )}
                  </div>

                  <h4 className="text-2xl font-black text-[#07031A]">{aiArticle.title}</h4>

                  {aiArticle.snippet && (
                    <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-[#4F20C9] pl-4 italic">
                      {aiArticle.snippet}
                    </p>
                  )}

                  <div className="p-5 rounded-2xl bg-slate-50 text-sm leading-relaxed whitespace-pre-line border border-slate-200 text-slate-800">
                    {aiArticle.content}
                  </div>

                  {aiArticle.keyTakeaways?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                      <p className="text-xs font-black text-[#07031A] uppercase tracking-wider">Key Takeaways</p>
                      <ul className="space-y-1.5">
                        {aiArticle.keyTakeaways.map((t: string, i: number) => (
                          <li key={i} className="text-xs text-purple-900 flex items-start gap-2">
                            <span className="text-[#4F20C9] font-bold flex-shrink-0">✓</span> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiArticle.recommendedSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {aiArticle.recommendedSkills.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400">Generated by {aiArticle.author || 'PathSeeker Gemini AI'}</p>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
