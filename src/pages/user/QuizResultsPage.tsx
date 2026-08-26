import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, Sparkles, CheckCircle2, ArrowRight, RotateCcw,
  BarChart3, Target, BookOpen, Play, Brain, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as any)?.result;

  React.useEffect(() => {
    if (result) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
          <Brain className="w-8 h-8 text-[#4F20C9]" />
        </div>
        <h1 className="text-2xl font-black text-[#07031A]">No Quiz Result Found</h1>
        <p className="text-sm text-slate-500 max-w-sm">
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
  const aiAnalysis = result?.aiAnalysis || 'Your responses show strong aptitude for technology and software engineering roles.';
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

  return (
    <div className="bg-white min-h-screen py-10 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#290C86] via-[#4F20C9] to-purple-700 text-white text-center space-y-4 shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-300 animate-bounce" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Congratulations! Your Career Passport is Ready 🎉
          </h1>
          <p className="text-sm text-purple-100 max-w-xl mx-auto">
            We analyzed your interest preferences and matched your profile against 1000+ global career roadmaps.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <p className="text-2xl font-black text-white">{score}%</p>
              <p className="text-[10px] uppercase font-bold text-purple-200">Overall Match Score</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <p className="text-lg font-black text-amber-300 truncate max-w-[200px]">{recommendedRole}</p>
              <p className="text-[10px] uppercase font-bold text-purple-200">Recommended Career</p>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-purple-50 border border-purple-100 flex items-start gap-4 shadow-sm"
        >
          <Sparkles className="w-6 h-6 text-[#4F20C9] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-[#07031A] mb-1 uppercase tracking-wider">AI Career Analysis</p>
            <p className="text-sm text-purple-900 leading-relaxed">{aiAnalysis}</p>
          </div>
        </motion.div>

        {/* Domain Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#4F20C9]" />
            <h2 className="text-lg font-black text-[#07031A]">Domain Aptitude Breakdown</h2>
          </div>
          <div className="space-y-4">
            {domainBreakdown.map((item, idx) => (
              <motion.div
                key={item.domain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.08 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{item.domain}</span>
                  <span className="text-[#4F20C9]">{item.match}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.match}%` }}
                    transition={{ delay: 0.5 + idx * 0.08, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#4F20C9] to-purple-400"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Careers List (from DB when available) */}
        {recommendedCareers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Top Matched Career Roles
              </h2>
              <Link to="/quiz" className="text-xs font-bold text-[#4F20C9] hover:underline flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedCareers.map((rec: any, idx: number) => {
                const c = rec.careerId || rec;
                return (
                  <div key={c._id || idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-[#4F20C9] text-xs font-bold">
                          {c.domain || 'Technology'}
                        </span>
                        <span className="text-xs font-black text-emerald-600">
                          {rec.matchPercentage || 92}% Match
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#07031A]">{c.title || recommendedRole}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{c.description}</p>
                      {rec.reason && (
                        <div className="p-3 rounded-2xl bg-purple-50 text-[11px] text-[#4F20C9] font-medium flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#4F20C9] shrink-0 mt-0.5" />
                          <span>{rec.reason}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        ${c.expectedSalaryRange?.max?.toLocaleString() || '155,000'}/yr
                      </span>
                      <Link
                        to={`/careers/${c._id}`}
                        className="px-4 py-2 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold shadow flex items-center gap-1"
                      >
                        <span>View Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
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
          className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-[#4F20C9]" />
            <h3 className="text-lg font-black text-[#07031A]">Your Personalised Next Steps</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nextSteps.map((step: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-[#4F20C9] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 pb-8"
        >
          <Link
            to="/resources"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
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
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 font-bold text-sm hover:border-purple-300 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Retake Quiz
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 font-bold text-sm hover:border-purple-300 transition-all"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
};
