import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, LayoutDashboard, Brain, Target, Bookmark, BookOpen, Download, Clock,
  MessageSquare, Settings, Sparkles, ArrowRight, Play, CheckCircle2, AlertCircle,
  TrendingUp, Award, ExternalLink, ShieldCheck, Video, Plus, Edit2, Trash2, Check, X, FileText, Briefcase, Code, Star, RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { bookmarkApi } from '../../services/bookmarkApi';
import { careerApi } from '../../services/careerApi';
import { publicApi } from '../../services/publicApi';
import apiClient from '../../services/apiClient';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';

const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'Career Quiz', path: '/quiz', icon: Brain },
  { label: 'Career Matches', path: '/careers', icon: Target },
  { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  { label: 'My Learning', path: '/multimedia', icon: BookOpen },
  { label: 'Resources & Downloads', path: '/resources', icon: Download },
  { label: 'Give Feedback', path: '/feedback', icon: MessageSquare },
];

interface PersonalNote {
  id: string;
  title: string;
  category: string;
  status: 'In Progress' | 'Completed' | 'Planned';
  date: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'student';

  // State
  const [metrics, setMetrics] = useState({ quizScore: 87, careerMatches: 8, bookmarksCount: 12, resourcesCount: 18, activityCount: 15 });
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [publicJobs, setPublicJobs] = useState<any[]>([]);
  const [publicRepos, setPublicRepos] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState(`Based on your profile as a ${role}, your technical background, analytical mindset, and continuous learning fit high-growth engineering and management paths.`);
  const [loading, setLoading] = useState(false);

  // Personal Goals/Notes State
  const [notes, setNotes] = useState<PersonalNote[]>([
    { id: 'n1', title: 'Complete React 19 & Next.js 15 Masterclass', category: 'Skill Development', status: 'In Progress', date: new Date().toISOString().split('T')[0] },
    { id: 'n2', title: 'Optimize Resume for ATS 90%+ Match Rate', category: 'Career Prep', status: 'Completed', date: new Date().toISOString().split('T')[0] },
    { id: 'n3', title: 'Build 3 MERN Stack Open-Source Projects', category: 'Portfolio', status: 'Planned', date: new Date().toISOString().split('T')[0] },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Skill Development');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    // Parallel fast data fetching — zero lag loading
    Promise.allSettled([
      bookmarkApi.getBookmarks(),
      careerApi.getCareers({ limit: 4 }),
      apiClient.get('/activity/user'),
      publicApi.getRemoteJobs('software-development'),
      publicApi.getGithubProjects('react'),
    ]).then(([bmRes, carRes, actRes, jobRes, repoRes]) => {
      if (bmRes.status === 'fulfilled' && bmRes.value.data?.success && Array.isArray(bmRes.value.data.bookmarks)) {
        setBookmarks(bmRes.value.data.bookmarks.slice(0, 3));
        setMetrics((m) => ({ ...m, bookmarksCount: bmRes.value.data.bookmarks.length }));
      }
      if (carRes.status === 'fulfilled' && carRes.value.data?.success && Array.isArray(carRes.value.data.careers)) {
        setMatches(carRes.value.data.careers.slice(0, 4));
        setMetrics((m) => ({ ...m, careerMatches: carRes.value.data.careers.length }));
      }
      if (actRes.status === 'fulfilled' && actRes.value.data?.success && Array.isArray(actRes.value.data.logs)) {
        setUserLogs(actRes.value.data.logs);
        setMetrics((m) => ({ ...m, activityCount: actRes.value.data.logs.length }));
      }
      if (jobRes.status === 'fulfilled' && jobRes.value.data?.success && Array.isArray(jobRes.value.data.jobs)) {
        setPublicJobs(jobRes.value.data.jobs.slice(0, 3));
      }
      if (repoRes.status === 'fulfilled' && repoRes.value.data?.success && Array.isArray(repoRes.value.data.repos)) {
        setPublicRepos(repoRes.value.data.repos.slice(0, 3));
      }
    });

    // AI explanation fetch
    apiClient
      .post('/gemini/analyze', {
        prompt: `Explain in 50 words why a ${role} fits Software Engineering, AI/ML, and Product Management.`,
        context: 'PathSeeker Dashboard AI Explanation',
      })
      .then((r) => {
        if (r.data?.success && r.data.result) setAiExplanation(r.data.result);
      })
      .catch(() => {});
  }, [role]);

  // CRUD Handlers for Personal Notes/Goals
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const item: PersonalNote = {
      id: `n_${Date.now()}`,
      title: newNoteTitle.trim(),
      category: newNoteCategory,
      status: 'In Progress',
      date: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => [item, ...prev]);
    setNewNoteTitle('');
  };

  const handleToggleStatus = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: n.status === 'Completed' ? 'In Progress' : 'Completed' } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleStartEdit = (note: PersonalNote) => {
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingTitle.trim()) return;
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title: editingTitle.trim() } : n)));
    setEditingNoteId(null);
    setEditingTitle('');
  };

  return (
    <div className="bg-white dark:bg-black text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">

          {/* ── Mobile Nav Pills Bar ── */}
          <div className="lg:hidden col-span-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-2 max-w-full">
            {sidebarItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={label}
                  to={path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#4F20C9] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Sidebar Navigation (Desktop) ── */}
          <div className="hidden lg:block lg:col-span-3 space-y-2">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              {/* User Profile Mini Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center font-black text-lg shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{user?.name || 'User Name'}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 text-[#4F20C9]">
                    {role === 'professional' ? 'Working Pro' : role}
                  </span>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="space-y-1">
                {sidebarItems.map(({ label, path, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={label}
                      to={path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-purple-50 text-[#4F20C9] font-black'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F20C9]' : 'text-slate-400'}`} />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ── Main Dashboard Area (9 cols) ── */}
          <div className="lg:col-span-9 space-y-8">

            {/* Dashboard Welcome Header with Role Badge */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#290C86] via-[#4F20C9] to-purple-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                    {role === 'student' && '🎓 Student Career Passport'}
                    {role === 'graduate' && '🎓 Graduate Career Launcher'}
                    {role === 'professional' && '💼 Working Professional Pivot Hub'}
                    {role === 'admin' && '🛡️ Administrator Control Suite'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Welcome back, {user?.name || 'Explorer'} 👋
                </h1>
                <p className="text-xs sm:text-sm text-purple-200">
                  {role === 'student' && 'Track course roadmaps, build fundamental skills, and explore entry-level tech careers.'}
                  {role === 'graduate' && 'Optimize ATS resumes, master technical interviews, and apply for high-demand job roles.'}
                  {role === 'professional' && 'Execute career pivots, upskill into senior AI & Cloud architecture, and track salary benchmarks.'}
                  {role === 'admin' && 'Manage platform data, review user activity logs, and maintain system health.'}
                </p>
              </div>

              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-5 py-3 rounded-2xl bg-white text-[#4F20C9] font-black text-xs hover:bg-purple-50 transition-all shrink-0 self-start md:self-auto shadow"
                >
                  Manage Admin Suite →
                </Link>
              )}
            </div>

            {/* ── 4 Metrics ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Skill Growth Index', value: '87%', icon: Brain, color: 'text-[#4F20C9] dark:text-purple-400' },
                { label: 'Target Career Matches', value: metrics.careerMatches, icon: Target, color: 'text-purple-600 dark:text-purple-300' },
                { label: 'Saved Study Guides', value: metrics.bookmarksCount, icon: Bookmark, color: 'text-amber-500' },
                { label: 'Activity Records', value: metrics.activityCount, icon: Clock, color: 'text-emerald-600 dark:text-emerald-400' },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <ScrollAnimation key={label} delay={i * 0.08} enable3DTilt={true}>
                  <div className="p-5 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{label}</span>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            {/* ── AI Intelligence Match & Recommendations ── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Personalized Role Fit</h3>
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100 dark:text-slate-700" strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#4F20C9] dark:text-purple-400" strokeDasharray="91, 100" strokeWidth="3.8" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#4F20C9] dark:text-purple-400">91%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Match Score</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Strong alignment with Software Engineering, Data Science, and Leadership.</p>
              </div>

              <div className="md:col-span-7 p-6 rounded-3xl bg-purple-50/60 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-black text-[#4F20C9] dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Career Match Analysis
                  </span>
                  <h3 className="text-lg font-black text-[#07031A] dark:text-white">Why Your Profile Stands Out</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {aiExplanation}
                  </p>
                </div>
                <div className="pt-3 border-t border-purple-200 dark:border-purple-800/40 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 dark:text-slate-400">Tailored for: {role}</span>
                  <Link to="/quiz" className="text-[#4F20C9] dark:text-purple-400 hover:underline flex items-center gap-1">
                    Retake Assessment <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── REAL-TIME JOBS & OPEN SOURCE SHOWCASE IN DASHBOARD ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Live Remote Jobs Feed */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#4F20C9] dark:text-purple-400" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Live Remote Jobs</h3>
                  </div>
                  <Link to="/resources" className="text-xs font-bold text-[#4F20C9] dark:text-purple-400 hover:underline">View All →</Link>
                </div>

                <div className="space-y-3">
                  {(publicJobs.length > 0 ? publicJobs : [
                    { id: 1, title: 'Senior Full-Stack Engineer (React)', company: 'Lemon.io', salary: '$120,000 - $160,000', url: 'https://remotive.com' },
                    { id: 2, title: 'AI Systems Architect', company: 'DataSphere Labs', salary: '$135,000 - $175,000', url: 'https://remotive.com' },
                  ]).map((j) => (
                    <div key={j.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-black text-slate-900 dark:text-white">{j.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{j.company} • <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{j.salary}</span></p>
                      </div>
                      <a href={j.url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 hover:bg-purple-100">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Trending Projects */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#4F20C9] dark:text-purple-400" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Open-Source Repositories</h3>
                  </div>
                  <Link to="/resources" className="text-xs font-bold text-[#4F20C9] dark:text-purple-400 hover:underline">View All →</Link>
                </div>

                <div className="space-y-3">
                  {(publicRepos.length > 0 ? publicRepos : [
                    { id: 101, name: 'react', stars: 220000, description: 'User interface library for web.', url: 'https://github.com/facebook/react' },
                    { id: 102, name: 'next.js', stars: 120000, description: 'React framework for production.', url: 'https://github.com/vercel/next.js' },
                  ]).map((r) => (
                    <div key={r.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <p className="font-black text-[#4F20C9] dark:text-purple-400 truncate">{r.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{r.description}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {r.stars?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── FULL CRUD SYSTEM: Personal Career Goals & Target Notes ── */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4F20C9] dark:text-purple-400" /> My Career Goals &amp; Action Notes (CRUD)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Create, track, update, and manage your custom milestones directly from your dashboard.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 text-xs font-bold self-start sm:self-auto">
                  {notes.length} Active Items
                </span>
              </div>

              {/* Create Note Form */}
              <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Add a new career goal or action item (e.g. Learn TypeScript, Apply to 5 companies)..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Skill Development">Skill Development</option>
                  <option value="Career Prep">Career Prep</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Applications">Applications</option>
                </select>
                <button
                  type="submit"
                  disabled={!newNoteTitle.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </form>

              {/* Notes List (Read, Update, Delete) */}
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggleStatus(note.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 sm:mt-0 cursor-pointer ${
                          note.status === 'Completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-transparent hover:border-[#4F20C9]'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      {editingNoteId === note.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-purple-300 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold text-slate-900 dark:text-white truncate ${
                              note.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {note.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 text-[9px] font-black uppercase">
                              {note.category}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{note.date}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {editingNoteId !== note.id && (
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#4F20C9] hover:border-purple-200 cursor-pointer"
                          title="Edit Title"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Real MongoDB User Activity Log Feed ── */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4F20C9] dark:text-purple-400" /> My Activity Record (Stored in MongoDB)
                </h3>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Live Activity Feed</span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {userLogs.length > 0 ? (
                  userLogs.map((log: any, idx: number) => (
                    <div key={log._id || log.id || idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{log.details || log.action}</p>
                        <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 text-[9px] font-bold uppercase">
                          {log.category || 'ACTION'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {new Date(log.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium py-4 text-center">
                    No recent activity records found in MongoDB. Perform searches, watch videos, or take quizzes to record activity!
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
