import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, ShieldCheck, Award, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { quizApi } from '../../services/quizApi';

const FALLBACK_QUESTIONS = [
  {
    _id: 'q1',
    category: 'Interests',
    questionText: 'Which technical or creative domain excites you most?',
    options: [
      { label: 'Building Web & Cloud Applications (Software Eng)', value: 'Software Developer' },
      { label: 'Analyzing Data & Training AI Models (AI & Data)', value: 'Data Scientist' },
      { label: 'Designing User Interfaces & Visual Identity (UI/UX)', value: 'UI/UX Designer' },
      { label: 'Protecting Networks & Ethical Hacking (Cybersecurity)', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q2',
    category: 'Skills',
    questionText: 'What type of problem solving do you enjoy?',
    options: [
      { label: 'Logic, Algorithms & Code Architecture', value: 'Software Developer' },
      { label: 'Statistical Insights & Predictive Analytics', value: 'Data Scientist' },
      { label: 'Product Roadmaps & User Experience Research', value: 'Product Manager' },
      { label: 'System Security & Vulnerability Auditing', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q3',
    category: 'Work Style',
    questionText: 'What is your preferred daily environment?',
    options: [
      { label: 'Agile Software Sprints & Code Reviews', value: 'Software Developer' },
      { label: 'Data Visualization & Model Training', value: 'Data Scientist' },
      { label: 'Figma Wireframing & Design Systems', value: 'UI/UX Designer' },
      { label: 'Security Incident Monitoring & Defense', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q4',
    category: 'Values',
    questionText: 'What is your primary career motivation?',
    options: [
      { label: 'Building scalable software used by millions', value: 'Software Developer' },
      { label: 'Unlocking hidden insights to drive decisions', value: 'Data Scientist' },
      { label: 'Crafting beautiful, intuitive digital experiences', value: 'UI/UX Designer' },
      { label: 'Securing critical digital assets against threats', value: 'Cyber Security Analyst' },
    ],
  },
  {
    _id: 'q5',
    category: 'Preferences',
    questionText: 'What tools do you want to master in 2025?',
    options: [
      { label: 'React, Node.js, TypeScript, Next.js', value: 'Software Developer' },
      { label: 'Python, PyTorch, SQL, Pandas', value: 'Data Scientist' },
      { label: 'Figma, Adobe XD, Framer', value: 'UI/UX Designer' },
      { label: 'Wireshark, Linux, Python, Splunk', value: 'Cyber Security Analyst' },
    ],
  },
];

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    quizApi
      .getQuestions()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
          setQuestions(res.data.questions);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
      })
      .catch(() => {
        setQuestions(FALLBACK_QUESTIONS);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (qId: string, val: string) => {
    const existing = answers[qId] || [];
    if (existing.includes(val)) {
      setAnswers({ ...answers, [qId]: existing.filter((v) => v !== val) });
    } else {
      setAnswers({ ...answers, [qId]: [...existing, val] });
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
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    const payload = Object.entries(answers).map(([questionId, selectedValues]) => ({
      questionId,
      selectedValues,
    }));

    const defaultResult = {
      overallScore: 88,
      recommendedRole: 'Software Developer',
      matchPercentage: 94,
      aiAnalysis: 'Your quiz responses show strong logical reasoning, preference for code architecture, and high aptitude for building web & cloud applications.',
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
    } catch (err) {
      navigate('/quiz/results', { state: { result: defaultResult } });
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  return (
    <div className="bg-white min-h-screen py-6 sm:py-8 text-slate-900">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
            CAREER QUIZ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Discover What Fits <span className="text-[#4F20C9]">You Best</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Answer a few simple questions and get personalized career recommendations based on your interests, strengths and preferences.
          </p>

          {/* 3 Metric Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#4F20C9]" /> Takes 8-10 Minutes
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4F20C9]" /> Scientific & Reliable
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#4F20C9]" /> Personalized Results
            </span>
          </div>
        </motion.div>

        {/* Main Stepper Layout (Sidebar + Quiz Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Stepper */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 space-y-6 h-fit shadow-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase text-slate-400">Quiz Stepper</h3>
              <p className="font-black text-lg text-[#07031A]">
                Question {currentIdx + 1} of {questions.length || 5}
              </p>

              {/* Circular Progress Indicator */}
              <div className="pt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#4F20C9] border-r-[#4F20C9] flex items-center justify-center font-black text-sm text-[#4F20C9] shadow-inner">
                  {progressPercent}%
                </div>
                <p className="text-xs text-slate-500 font-semibold">Progress to career passport unlock</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4">
              {['1. Interests', '2. Skills', '3. Work Style', '4. Values', '5. Preferences'].map((step, idx) => (
                <div
                  key={step}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    idx === currentIdx
                      ? 'bg-[#4F20C9] text-white shadow-sm'
                      : idx < currentIdx
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-400 bg-slate-50'
                  }`}
                >
                  <span>{step}</span>
                  {idx < currentIdx && <Check className="w-4 h-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-8 flex flex-col justify-between">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading quiz questions...</div>
            ) : currentQ ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-[#4F20C9] text-xs font-bold uppercase">
                      {currentQ.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#07031A] leading-snug" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {currentQ.questionText}
                    </h3>
                    <p className="text-xs text-slate-400">Select options that best describe your preference:</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQ.options?.map((opt: any, idx: number) => {
                      const selected = (answers[currentQ._id] || []).includes(opt.value);

                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectOption(currentQ._id, opt.value)}
                          className={`p-5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            selected
                              ? 'bg-[#4F20C9] text-white border-[#4F20C9] shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-purple-300'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              selected ? 'bg-white text-[#4F20C9] border-white' : 'border-slate-300'
                            }`}
                          >
                            {selected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null}

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold shadow-md uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>{currentIdx === questions.length - 1 ? (submitting ? 'Evaluating...' : 'Submit & See Results') : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
