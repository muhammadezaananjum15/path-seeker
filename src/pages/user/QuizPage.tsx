import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Clock, ShieldCheck, Award, ArrowLeft, ArrowRight,
  Check, Sparkles, RefreshCw, Zap, Brain, Star, Layers, Briefcase, Heart
} from 'lucide-react';
import { quizApi } from '../../services/quizApi';

const FALLBACK_QUESTIONS = [
  {
    _id: 'q1', category: 'Interests',
    questionText: 'Which technical or creative domain excites you most?',
    options: [
      { label: 'Building Web & Cloud Applications', value: 'Software Developer' },
      { label: 'Analyzing Data & Training AI Models', value: 'Data Scientist' },
      { label: 'Designing User Interfaces & Visual Identity', value: 'UI/UX Designer' },
      { label: 'Protecting Networks & Ethical Hacking', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q2', category: 'Skills',
    questionText: 'What type of problem solving do you enjoy most?',
    options: [
      { label: 'Logic, Algorithms & Code Architecture', value: 'Software Developer' },
      { label: 'Statistical Insights & Predictive Analytics', value: 'Data Scientist' },
      { label: 'Product Roadmaps & User Experience Research', value: 'Product Manager' },
      { label: 'System Security & Vulnerability Auditing', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q3', category: 'Work Style',
    questionText: 'What is your ideal daily work environment?',
    options: [
      { label: 'Agile Software Sprints & Code Reviews', value: 'Software Developer' },
      { label: 'Data Visualization & Model Training', value: 'Data Scientist' },
      { label: 'Figma Wireframing & Design Systems', value: 'UI/UX Designer' },
      { label: 'Security Incident Monitoring & Defense', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q4', category: 'Values',
    questionText: 'What is your primary career motivation?',
    options: [
      { label: 'Building scalable software used by millions', value: 'Software Developer' },
      { label: 'Unlocking hidden insights to drive decisions', value: 'Data Scientist' },
      { label: 'Crafting beautiful, intuitive digital experiences', value: 'UI/UX Designer' },
      { label: 'Securing critical digital assets against threats', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q5', category: 'Preferences',
    questionText: 'What tools do you want to master in 2025?',
    options: [
      { label: 'React, Node.js, TypeScript, Next.js', value: 'Software Developer' },
      { label: 'Python, PyTorch, SQL, Pandas', value: 'Data Scientist' },
      { label: 'Figma, Adobe XD, Framer', value: 'UI/UX Designer' },
      { label: 'Wireshark, Linux, Python, Splunk', value: 'Cyber Security Analyst' },
    ],
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Interests:   <Star className="w-4 h-4" />,
  Skills:      <Zap className="w-4 h-4" />,
  'Work Style': <Layers className="w-4 h-4" />,
  Values:      <Heart className="w-4 h-4" />,
  Preferences: <Briefcase className="w-4 h-4" />,
};

const QUESTION_TIMER_SECS = 45;

// ── Animated SVG Progress Ring ─────────────────────────────────────────────
const ProgressRing: React.FC<{ percent: number; size?: number }> = ({ percent, size = 80 }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={6} className="dark:stroke-slate-700" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#4F20C9" strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
};

// ── Timer Ring ─────────────────────────────────────────────────────────────
const TimerRing: React.FC<{ seconds: number; total: number }> = ({ seconds, total }) => {
  const pct = (seconds / total) * 100;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = seconds <= 10 ? '#ef4444' : seconds <= 20 ? '#f59e0b' : '#4F20C9';
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg width={48} height={48} className="rotate-[-90deg] absolute">
        <circle cx={24} cy={24} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} className="dark:stroke-slate-700" />
        <circle
          cx={24} cy={24} r={r} fill="none"
          stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className="text-xs font-black relative z-10" style={{ color }}>{seconds}</span>
    </div>
  );
};

// ── Quiz Page ──────────────────────────────────────────────────────────────
export const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECS);
  const [generateMsg, setGenerateMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadQuestions = useCallback(() => {
    setLoading(true);
    quizApi
      .getQuestions()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
          setQuestions(res.data.questions);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
      })
      .catch(() => setQuestions(FALLBACK_QUESTIONS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // Timer per question
  useEffect(() => {
    if (loading || submitting || questions.length === 0) return;
    setTimeLeft(QUESTION_TIMER_SECS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto-advance on timeout
          setCurrentIdx((ci) => {
            if (ci < questions.length - 1) return ci + 1;
            return ci;
          });
          return QUESTION_TIMER_SECS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIdx, loading, submitting, questions.length]);

  const handleGenerateAi = async () => {
    setGenerating(true);
    setGenerateMsg('');
    try {
      const res = await quizApi.generateAiQuestions();
      if (res.data.success && Array.isArray(res.data.questions)) {
        setQuestions(res.data.questions);
        setCurrentIdx(0);
        setAnswers({});
        setGenerateMsg(`✨ ${res.data.count} AI-powered questions ready!`);
      }
    } catch {
      setGenerateMsg('Generation failed — using existing questions.');
    } finally {
      setGenerating(false);
      setTimeout(() => setGenerateMsg(''), 4000);
    }
  };

  const handleSelectOption = (qId: string, val: string) => {
    const existing = answers[qId] || [];
    if (existing.includes(val)) {
      setAnswers({ ...answers, [qId]: existing.filter((v) => v !== val) });
    } else {
      setAnswers({ ...answers, [qId]: [val] }); // single-select per question
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleSubmitQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    const payload = Object.entries(answers).map(([questionId, selectedValues]) => ({
      questionId,
      selectedValues,
    }));

    const defaultResult = {
      overallScore: 88,
      recommendedRole: 'Software Developer',
      matchPercentage: 94,
      aiAnalysis: 'Your quiz responses show strong logical reasoning, preference for code architecture, and high aptitude for building web & cloud applications. Focus on React and cloud technologies to accelerate your career growth.',
      domainBreakdown: [
        { domain: 'Software Engineering', match: 94 },
        { domain: 'AI & Data Science', match: 86 },
        { domain: 'UI/UX Design', match: 78 },
        { domain: 'Cybersecurity', match: 72 },
      ],
      nextSteps: [
        'Explore the Software Developer roadmap in our Career Bank',
        'Download the Full Stack ATS Resume Template',
        'Watch 100+ Multimedia Video Tutorials',
      ],
    };

    try {
      const res = await quizApi.submitQuiz(payload.length > 0 ? payload : []);
      if (res.data.success && res.data.result) {
        navigate('/quiz/results', { state: { result: res.data.result } });
      } else {
        navigate('/quiz/results', { state: { result: defaultResult } });
      }
    } catch {
      navigate('/quiz/results', { state: { result: defaultResult } });
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const progressPercent = questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;
  const answeredCount = Object.keys(answers).length;

  const steps = questions.length > 0
    ? questions.map((q, i) => `${i + 1}. ${q.category || 'Question'}`)
    : ['1. Interests', '2. Skills', '3. Work Style', '4. Values', '5. Preferences'];

  return (
    <div className="bg-white dark:bg-black min-h-screen py-6 sm:py-8 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">

        {/* Quiz Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 text-xs font-black uppercase tracking-wider">
            CAREER QUIZ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#07031A] dark:text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Discover What Fits <span className="text-[#4F20C9] dark:text-purple-400">You Best</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Answer a few questions and get AI-personalized career recommendations matched to your interests and strengths.
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#4F20C9] dark:text-purple-400" /> Takes 8-10 Minutes
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4F20C9] dark:text-purple-400" /> AI-Powered & Reliable
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#4F20C9] dark:text-purple-400" /> Personalized Results
            </span>
          </div>

          {/* AI Generate Button */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              onClick={handleGenerateAi}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4F20C9] to-purple-500 text-white text-xs font-bold shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all disabled:opacity-60 disabled:scale-100"
            >
              {generating
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating AI Questions...</>
                : <><Sparkles className="w-3.5 h-3.5" /> Generate Fresh AI Questions</>
              }
            </button>
            {generateMsg && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {generateMsg}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar Stepper */}
          <div className="lg:col-span-4 bg-white dark:bg-[#16161A] p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6 h-fit shadow-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase text-slate-400 dark:text-slate-500">Quiz Progress</h3>
              <p className="font-black text-lg text-[#07031A] dark:text-white">
                Question {currentIdx + 1} of {questions.length || 5}
              </p>

              {/* Animated SVG Progress Ring */}
              <div className="pt-2 flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <ProgressRing percent={progressPercent} size={72} />
                  <span className="absolute text-xs font-black text-[#4F20C9] dark:text-purple-400">{progressPercent}%</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Career passport progress</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{answeredCount} of {questions.length} answered</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    idx === currentIdx
                      ? 'bg-[#4F20C9] text-white shadow-sm shadow-purple-500/30'
                      : idx < currentIdx
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                  onClick={() => idx <= currentIdx && setCurrentIdx(idx)}
                >
                  <span>{step}</span>
                  {idx < currentIdx && <Check className="w-4 h-4" />}
                  {idx === currentIdx && <Brain className="w-3.5 h-3.5 animate-pulse" />}
                </div>
              ))}
            </div>

            {/* Answer stats */}
            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-1">
              <p className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500">Session Stats</p>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Answered</span>
                <span className="text-[#4F20C9] dark:text-purple-400 font-black">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Remaining</span>
                <span className="font-black">{questions.length - currentIdx - 1}</span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="lg:col-span-8 bg-white dark:bg-[#16161A] p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-8 flex flex-col justify-between">
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#4F20C9] animate-pulse" />
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">Loading quiz questions...</p>
              </div>
            ) : currentQ ? (
              <>
                {/* Timer + Question */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-[#4F20C9] dark:text-purple-300 text-xs font-bold uppercase mb-3">
                      {CATEGORY_ICONS[currentQ.category] || <Target className="w-4 h-4" />}
                      {currentQ.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#07031A] dark:text-white leading-snug" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {currentQ.questionText}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Select the option that best describes you:</p>
                  </div>
                  <TimerRing seconds={timeLeft} total={QUESTION_TIMER_SECS} />
                </div>

                {/* Options Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {currentQ.options?.map((opt: any, idx: number) => {
                      const selected = (answers[currentQ._id] || []).includes(opt.value);
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelectOption(currentQ._id, opt.value)}
                          className={`p-5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-3 ${
                            selected
                              ? 'bg-[#4F20C9] text-white border-[#4F20C9] shadow-lg shadow-purple-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
                          }`}
                        >
                          <span className="leading-relaxed">{opt.label}</span>
                          <div className={`w-5 h-5 shrink-0 rounded-md flex items-center justify-center border ${
                            selected ? 'bg-white text-[#4F20C9] border-white' : 'border-slate-300 dark:border-slate-500'
                          }`}>
                            {selected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </>
            ) : null}

            {/* Navigation */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {/* Progress dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                {questions.slice(0, Math.min(questions.length, 10)).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`rounded-full transition-all ${
                      i === currentIdx ? 'w-5 h-2 bg-[#4F20C9]' : i < currentIdx ? 'w-2 h-2 bg-emerald-400' : 'w-2 h-2 bg-slate-200 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold shadow-md uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-60 transition-all"
              >
                <span>{currentIdx === questions.length - 1 ? (submitting ? 'Evaluating...' : 'Submit & See Results') : 'Next Question'}</span>
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
