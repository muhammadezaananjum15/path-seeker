import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Trash2,
  Download,
  Zap,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Compass,
} from 'lucide-react';
import { chatbotApi } from '../../services/chatbotApi';
import { articleApi } from '../../services/articleApi';
import { useAuthStore } from '../../stores/useAuthStore';
import { logUserActivity } from '../../services/activityLogger';
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
      text: `Welcome to **Ask Pathseeker Strategy Cockpit**!\n\nI am your dedicated AI Agent. I evaluate real-time hiring metrics, skill prerequisites, salary benchmarks, and PathSeeker's Career Bank to help you make confident career choices.\n\nWhat career transition, degree choice, or skill roadmap would you like to build today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

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

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: Message = { role: 'user', text: query, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    logUserActivity('AI_CHAT', 'AI_CHAT', `Asked Ask Pathseeker: ${query.slice(0, 60)}`);

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
        text: 'Chat history cleared. How else can Ask Pathseeker assist your career strategy?',
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
    link.download = `Ask_Pathseeker_Career_Consultation_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
                  ASK PATHSEEKER AGENT COCKPIT
                </span>
                <div className="inline-flex p-1 rounded-full bg-slate-200/80 border border-slate-300/80 text-xs font-bold">
                  <button
                    onClick={() => setAiProvider('gemini')}
                    className={`px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                      aiProvider === 'gemini'
                        ? 'bg-[#4F20C9] text-white shadow-sm font-extrabold'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Gemini Agent
                  </button>
                  <button
                    onClick={() => setAiProvider('claude')}
                    className={`px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                      aiProvider === 'claude'
                        ? 'bg-purple-800 text-white shadow-sm font-extrabold'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Deep Strategy
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#07031A] pt-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Ask <span className="text-[#4F20C9]">Pathseeker</span> AI
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                An intelligent career strategy cockpit to analyze pivots, education pathways, ATS resumes, and compensation benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportConsole}
                className="px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-purple-300 text-slate-800 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-[#4F20C9]" />
                <span>Export Transcript</span>
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decision Prompt Templates Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {decisionTemplates.map((template, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -3 }}
              onClick={() => handleSend(template.prompt)}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md text-left space-y-2 hover:border-purple-300 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#4F20C9] flex items-center justify-center group-hover:bg-[#4F20C9] group-hover:text-white transition-colors">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-[#07031A]">{template.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{template.prompt}</p>
            </motion.button>
          ))}
        </div>

        {/* Console Chat Body Container */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200 shadow-xl space-y-6 min-h-[520px] flex flex-col justify-between">
          <div className="space-y-6 max-h-[580px] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[#4F20C9] text-white shadow-md'
                      : 'bg-gradient-to-br from-purple-100 to-purple-200 text-[#4F20C9] border border-purple-300'
                  }`}
                >
                  {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className="space-y-1.5 max-w-[85%]">
                  <div
                    className={`p-6 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#4F20C9] text-white rounded-tr-none shadow-md font-medium'
                        : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200/90 font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.role === 'model' && (
                    <div className="flex items-center gap-3 pl-2 text-xs text-slate-400">
                      <button
                        onClick={() => copyMessage(msg.text, idx)}
                        className="hover:text-slate-800 flex items-center gap-1 font-semibold transition-colors"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIdx === idx ? 'Copied Answer' : 'Copy Answer'}</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-slate-800 flex items-center gap-1 font-semibold transition-colors"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeaking ? 'Stop Audio' : 'Listen Readout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-slate-500 text-xs py-3 pl-2">
                <Sparkles className="w-5 h-5 text-[#4F20C9] animate-spin" />
                <span className="font-bold">Ask Pathseeker Agent is synthesizing market intelligence...</span>
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
            className="flex items-center gap-3 pt-4 border-t border-slate-100"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3.5 rounded-2xl transition-all ${
                isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={isListening ? 'Listening...' : 'Voice Dictation'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask Pathseeker about careers, skills, or degree paths...'}
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] font-medium"
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

