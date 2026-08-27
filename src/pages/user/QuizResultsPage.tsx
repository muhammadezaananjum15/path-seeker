import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, Sparkles, CheckCircle2, ArrowRight, RotateCcw,
  BarChart3, Target, BookOpen, Play, Brain, RefreshCw, Share2, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as any)?.result;
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (result) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 }, colors: ['#4F20C9', '#a855f7', '#f59e0b', '#ffffff'] });
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 text-center px-4 transition-colors duration-300">
        <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
          <Brain className="w-8 h-8 text-[#4F20C9]" />
        </div>
        <h1 className="text-2xl font-black text-[#07031A]">No Quiz Result Found</h1>
        <p className="text-sm text-slate-600 max-w-sm">
          It looks like you haven't completed the quiz yet, or your results have expired.
        </p>
        <Link
          to="/quiz"
          className="px-6 py-3 rounded-full bg-[#4F20C9] text-white font-bold text-sm shadow-lg hover:bg-purple-700 transition-all"
        >
          Take the Career Quiz
        </Link>
      </div>
    );
  }

  const score = result?.matchPercentage || result?.overallScore || 91;
  const recommendedRole = result?.recommendedRole || 'Software Developer';
  const aiAnalysis = result?.aiAnalysis || 'Your responses show strong aptitude for technology and software engineering roles. Focus on building real-world projects to accelerate your career.';
  const domainBreakdown: { domain: string; match: number }[] = result?.domainBreakdown || [
    { domain: 'Technology', match: 94 },
    { domain: 'Engineering', match: 88 },
    { domain: 'Design', match: 78 },
    { domain: 'Business', match: 71 },
    { domain: 'Education', match: 65 },
  ];
  const nextSteps: string[] = result?.nextSteps || [
    'Explore the Software Developer roadmap in our Career Bank',
    'Download the Full Stack ATS Resume Template',
    'Watch 100+ Multimedia Video Tutorials',
  ];
  const recommendedCareers: any[] = result?.recommendedCareers || [];

  const handleShare = () => {
    const text = `🎯 My PathSeeker Career Quiz Result:\n📊 Match Score: ${score}%\n💼 Best Career Fit: ${recommendedRole}\n\n${aiAnalysis.slice(0, 120)}...\n\nTake the quiz at PathSeeker! 🚀`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const barColors = ['from-[#4F20C9] to-purple-400', 'from-purple-500 to-indigo-400', 'from-indigo-400 to-blue-400', 'from-blue-400 to-cyan-400', 'from-cyan-400 to-teal-400'];

  return (
    <div className="bg-white min-h-screen py-10 text-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Result Banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1A0B5C] via-[#4F20C9] to-purple-600 text-white text-center space-y-5 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative bg circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl pointer-events-none" />

          <div className="w-16 h-16 mx-auto rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Award className="w-9 h-9 text-amber-300 animate-bounce" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black relative z-10" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Your Career Passport is Ready 🎉
          </h1>
          <p className="text-sm text-purple-200 max-w-xl mx-auto relative z-10">
            We analyzed your preferences and matched your profile against 1,000+ global career roadmaps using AI.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <p className="text-3xl font-black text-white">{score}%</p>
              <p className="text-[10px] uppercase font-bold text-purple-200 mt-0.5">Overall Match Score</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <p className="text-lg font-black text-amber-300 max-w-[200px] truncate">{recommendedRole}</p>
              <p className="text-[10px] uppercase font-bold text-purple-200 mt-0.5">Top Career Match</p>
            </div>
          </div>
        </motion.div>

        {/* Gemini AI Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-[#16161A] border border-purple-100 dark:border-purple-800/50 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#4F20C9] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#07031A] dark:text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                Gemini AI Career Analysis
                <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-[#4F20C9] dark:text-purple-300 text-[9px]">LIVE AI</span>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{aiAnalysis}</p>
            </div>
          </div>
        </motion.div>

        {/* Domain Aptitude Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-md space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#4F20C9] dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#07031A] dark:text-white">Domain Aptitude Breakdown</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your compatibility score across career fields</p>
            </div>
          </div>
          <div className="space-y-5">
            {domainBreakdown.map((item, idx) => (
              <motion.div
                key={item.domain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.08 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{item.domain}</span>
                  <span className="text-[#4F20C9] dark:text-purple-400 font-black">{item.match}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.match}%` }}
                    transition={{ delay: 0.5 + idx * 0.08, duration: 0.9, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${barColors[idx % barColors.length]}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Careers */}
        {recommendedCareers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#07031A] dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Top Matched Career Roles
              </h2>
              <Link to="/quiz" className="text-xs font-bold text-[#4F20C9] dark:text-purple-400 hover:underline flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedCareers.map((rec: any, idx: number) => {
                const c = rec.careerId || rec;
                return (
                  <motion.div
                    key={c._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.06 }}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1C1C22] border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-[#4F20C9] dark:text-purple-300 text-xs font-bold">
                          {c.domain || 'Technology'}
                        </span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {rec.matchPercentage || 92}% Match
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#07031A] dark:text-white">{c.title || recommendedRole}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{c.description}</p>
                      {rec.reason && (
                        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-[11px] text-[#4F20C9] dark:text-purple-300 font-medium flex items-start gap-2">
                          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{rec.reason}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        ${c.expectedSalaryRange?.max?.toLocaleString() || '155,000'}/yr
                      </span>
                      <Link
                        to={`/careers/${c._id}`}
                        className="px-4 py-2 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold shadow flex items-center gap-1 transition-all"
                      >
                        <span>View Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-md space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#4F20C9] dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-black text-[#07031A] dark:text-white">Your Personalised Next Steps</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nextSteps.map((step: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-[#1C1C22] border border-purple-100 dark:border-purple-800/40 space-y-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[#4F20C9] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Share + CTA Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 pb-8"
        >
          {/* Share card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1C1C22] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#4F20C9]" /> Share Your Results
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Copy your career match summary to share with friends or mentors</p>
            </div>
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700'
                  : 'bg-[#4F20C9] text-white hover:bg-purple-700'
              }`}
            >
              {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Summary</>}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/resources"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Download Free PDFs
            </Link>
            <Link
              to="/multimedia"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#4F20C9] text-white font-bold text-sm shadow-lg hover:bg-purple-700 transition-all"
            >
              <Play className="w-4 h-4" /> Watch Video Guides
            </Link>
            <button
              onClick={() => navigate('/quiz')}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-sm hover:border-purple-300 dark:hover:border-purple-500 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retake Quiz
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-sm hover:border-purple-300 dark:hover:border-purple-500 transition-all"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
