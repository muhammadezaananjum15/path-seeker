import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, Trash2, Mic, MicOff, Volume2, VolumeX, Copy, Check, ExternalLink } from 'lucide-react';
import { chatbotApi } from '../../services/chatbotApi';
import { articleApi } from '../../services/articleApi';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

export const ChatbotWidget: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Hello! I am **Ask Pathseeker**, your AI Career & Skill Strategy Agent.\n\nAsk me anything about choosing degree paths, switching into Tech/Data Science, ATS resumes, or salary insights!`,
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

  const quickPrompts = [
    '🚀 Tech Salary Map 2025',
    '📝 Resume Checklist',
    '💡 Data Science Pivot',
    '💼 Interview Questions',
  ];

  // Initialize Speech Recognition if supported
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
    if (isAuthenticated && isOpen) {
      chatbotApi
        .getChatHistory()
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.messages) && res.data.messages.length > 0) {
            setMessages(res.data.messages);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, isOpen]);

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

    try {
      if (isAuthenticated) {
        const res = await chatbotApi.sendMessage(query);
        if (res.data.success && res.data.response) {
          const modelMsg: Message = { role: 'model', text: res.data.response, timestamp: new Date().toISOString() };
          setMessages((prev) => [...prev, modelMsg]);
        }
      } else {
        const res = await articleApi.generateAiArticle({
          topic: query,
          userRole: 'Student',
        });
        if (res.data.success && res.data.article) {
          const art = res.data.article;
          const formattedText = `### ${art.title}\n\n${art.snippet || ''}\n\n${art.content || ''}\n\n*Ask Pathseeker Tip: Register a free account to save recommendations!*`;
          setMessages((prev) => [...prev, { role: 'model', text: formattedText, timestamp: new Date().toISOString() }]);
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'I recommend taking our **Interest Quiz** for custom matches or exploring our **Career Bank**!',
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
        text: `Chat history cleared. How else can Ask Pathseeker assist your career goals?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-24px)]">
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#07031A] via-[#2A0E80] to-[#4F20C9] text-white font-bold shadow-2xl uppercase tracking-wider text-[11px] sm:text-xs border border-purple-400/40 relative overflow-hidden"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            </div>
            <span className="font-extrabold tracking-wide text-white">Ask Pathseeker</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 40 }}
            className="w-[calc(100vw-24px)] sm:w-[430px] h-[550px] sm:h-[600px] max-h-[82vh] rounded-3xl bg-white border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden text-slate-900"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-[#07031A] via-[#2D0FA0] to-[#4F20C9] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 relative">
                  <Bot className="w-5 h-5 text-amber-300" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border border-slate-900" />
                </div>
                <div>
                  <h3 className="font-black text-sm leading-none flex items-center gap-1.5 text-white">
                    Ask Pathseeker <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h3>
                  <p className="text-[10px] text-purple-200 mt-1 font-medium">Live AI Career & Skill Agent</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/ai-console')}
                  className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Open Full Console"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Prompt Chips */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-2 no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap hover:border-[#4F20C9] hover:text-[#4F20C9] transition-all shadow-sm shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message History Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-[#4F20C9] text-white shadow-sm'
                        : 'bg-purple-100 text-[#4F20C9] border border-purple-200'
                    }`}
                  >
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 max-w-[82%]">
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#4F20C9] text-white rounded-tr-none shadow-md font-medium'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80 font-normal'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Action Bar for Agent Messages */}
                    {msg.role === 'model' && (
                      <div className="flex items-center gap-2 pl-1 pt-0.5 text-[10px] text-slate-400">
                        <button
                          onClick={() => copyMessage(msg.text, i)}
                          className="hover:text-slate-700 flex items-center gap-1 font-semibold"
                        >
                          {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIdx === i ? 'Copied' : 'Copy'}</span>
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-slate-700 flex items-center gap-1 font-semibold"
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-500" /> : <Volume2 className="w-3 h-3" />}
                          <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pl-2">
                  <Sparkles className="w-4 h-4 text-[#4F20C9] animate-spin" />
                  <span className="font-bold text-slate-600">Ask Pathseeker agent is analyzing career data...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'Ask Pathseeker about careers, skills...'}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white font-bold disabled:opacity-40 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

