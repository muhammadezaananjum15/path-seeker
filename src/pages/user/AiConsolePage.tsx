import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Trash2,
  Download,
  Share2,
  Compass,
  ArrowRight,
  BookOpen,
  Briefcase,
  Zap,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { chatbotApi } from '../../services/chatbotApi';
import { articleApi } from '../../services/articleApi';
import { useAuthStore } from '../../stores/useAuthStore';
import { logUserActivity } from '../../services/activityLogger';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

export const AiConsolePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [aiProvider, setAiProvider] = useState<'gemini' | 'claude'>('gemini');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Welcome to the **PathSeeker AI Career Strategy Console**! 🚀\n\nI analyze global hiring data, required skillsets, compensation benchmarks, and PathSeeker's Career Bank to help you make confident career choices.\n\nWhat career transition, degree choice, or skill roadmap would you like to explore today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const decisionTemplates = [
    {
      title: 'Career Pivot Analysis',
      prompt: 'I want to pivot from my current field into AI & Data Science. What skills and milestones do I need?',
    },
    {
      title: 'Highest Paying Tech Roles',
      prompt: 'What are the top 5 highest paying tech roles for 2025 and what education path is required?',
    },
    {
      title: 'Student Specialization Choice',
      prompt: 'As a Student choosing a degree, what emerging domains offer the highest job demand for the next 5 years?',
    },
    {
      title: 'Resume & Interview Guidance',
      prompt: 'Give me a step-by-step roadmap to pass behavioral interviews and ATS resume scanners for Product Management.',
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      chatbotApi
        .getChatHistory()
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.messages) && res.data.messages.length > 0) {
            setMessages(res.data.messages);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: Message = { role: 'user', text: query, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    logUserActivity('AI_CHAT', 'AI_CHAT', `Asked AI Console: ${query.slice(0, 60)}`);

    try {
      if (aiProvider === 'claude') {
        const res = await apiClient.post('/claude/career-guidance', {
          prompt: query,
          userRole: user?.role || 'Student',
        });
        if (res.data.success && res.data.result) {
          const modelMsg: Message = { role: 'model', text: res.data.result, timestamp: new Date().toISOString() };
          setMessages((prev) => [...prev, modelMsg]);
        }
      } else if (isAuthenticated) {
        const res = await chatbotApi.sendMessage(query);
        if (res.data.success && res.data.response) {
          const modelMsg: Message = { role: 'model', text: res.data.response, timestamp: new Date().toISOString() };
          setMessages((prev) => [...prev, modelMsg]);
        }
      } else {
        const res = await articleApi.generateAiArticle({ topic: query, userRole: 'Student' });
        if (res.data.success && res.data.article) {
          const art = res.data.article;
          const text = `### ${art.title}\n\n${art.snippet || ''}\n\n${art.content || ''}`;
          setMessages((prev) => [...prev, { role: 'model', text, timestamp: new Date().toISOString() }]);
        }
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'I recommend exploring our **Career Bank** or taking the **Interest Quiz** for personalized matches!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (isAuthenticated) {
      try {
        await chatbotApi.clearChatHistory();
      } catch (e) {}
    }
    setMessages([
      {
        role: 'model',
        text: 'Chat history cleared. How else can PathSeeker AI assist your career journey?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleExportConsole = () => {
    const content = messages
      .map((m) => `[${m.role.toUpperCase()}]: ${m.text}`)
      .join('\n\n-----------------------------------\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PathSeeker_AI_Career_Consultation_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                  PATHSEEKER CAREER INTELLIGENCE
                </span>
                <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <button
                    onClick={() => setAiProvider('gemini')}
                    className={`px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                      aiProvider === 'gemini'
                        ? 'bg-[#4F20C9] text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Gemini Live
                  </button>
                  <button
                    onClick={() => setAiProvider('claude')}
                    className={`px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                      aiProvider === 'claude'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Deep Strategy
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#07031A] dark:text-white pt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Talk to <span className="text-[#4F20C9] dark:text-purple-400">PathSeeker AI</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                A dedicated strategy console to evaluate major career decisions, pivots, and skill roadmaps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportConsole}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Conversation</span>
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decision Prompts Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {decisionTemplates.map((template, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -3 }}
              onClick={() => handleSend(template.prompt)}
              className="p-5 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-sm text-left space-y-2 hover:border-purple-300 dark:hover:border-purple-500 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-[#4F20C9] dark:text-purple-300 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-[#07031A] dark:text-white">{template.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{template.prompt}</p>
            </motion.button>
          ))}
        </div>

        {/* Console Chat Body */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 min-h-[500px] flex flex-col justify-between">
          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[#4F20C9] text-white shadow-md'
                      : 'bg-purple-50 dark:bg-purple-900/40 text-[#4F20C9] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}
                >
                  {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`p-6 rounded-3xl max-w-[85%] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#4F20C9] text-white rounded-tr-none shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs py-3 pl-2">
                <Sparkles className="w-5 h-5 text-[#4F20C9] dark:text-purple-400 animate-spin" />
                <span className="font-bold">PathSeeker AI is analyzing global market trends and Career Bank data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your career decision, goal, or question..."
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F20C9] font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-7 py-4 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 disabled:opacity-40 uppercase tracking-wider transition-all"
            >
              <span>Send</span>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
