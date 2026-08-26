import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, Trash2, ArrowRight, Minimize2, MessageSquare } from 'lucide-react';
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
      text: `Hello! 👋 I am your **PathSeeker AI Career Advisor**. Ask me anything about career choices, high-paying jobs, skills, or degree paths!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What are the highest paying tech jobs in 2025?',
    'Which career path fits a Student best?',
    'How do I pivot into Data Science or AI?',
    'What skills do I need for Software Engineering?',
  ];

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
        // Guest mode AI query
        const res = await articleApi.generateAiArticle({
          topic: query,
          userRole: 'Student',
        });
        if (res.data.success && res.data.article) {
          const art = res.data.article;
          const formattedText = `### ${art.title}\n\n${art.snippet || ''}\n\n${art.content || ''}\n\n*Tip: Sign up for a free PathSeeker Passport to save your custom recommendations!*`;
          setMessages((prev) => [...prev, { role: 'model', text: formattedText, timestamp: new Date().toISOString() }]);
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'I recommend taking our **Interest Quiz** to get personalized recommendations, or browsing our **Career Bank**!',
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
        text: `Chat history cleared. How else can PathSeeker AI assist your career journey?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-24px)]">
      {/* Floating Trigger Button with Framer Motion Bounce */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold shadow-2xl uppercase tracking-wider text-[11px] sm:text-xs border border-purple-400/30"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            </div>
            <span className="hidden xs:inline sm:inline">Ask PathSeeker AI</span>
            <span className="xs:hidden">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            className="w-[calc(100vw-24px)] sm:w-[420px] h-[540px] sm:h-[580px] max-h-[80vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#290C86] via-[#4F20C9] to-purple-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                    PathSeeker AI Assistant <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h3>
                  <p className="text-[10px] text-purple-200 mt-1">Live Career & Skill Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-2 no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap hover:border-[#4F20C9] hover:text-[#4F20C9] transition-colors shadow-sm flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-[#4F20C9] text-white'
                        : 'bg-purple-100 text-[#4F20C9]'
                    }`}
                  >
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#4F20C9] text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                  <Sparkles className="w-4 h-4 text-[#4F20C9] animate-spin" />
                  <span>PathSeeker AI is analyzing career pathways...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask PathSeeker AI about careers, salaries..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white font-bold disabled:opacity-40 transition-all shadow"
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
