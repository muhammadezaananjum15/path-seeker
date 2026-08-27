import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Sparkles, User, Mail } from 'lucide-react';
import { feedbackApi } from '../../services/feedbackApi';
import { useAuthStore } from '../../stores/useAuthStore';
import { motion } from 'framer-motion';

export const FeedbackPage: React.FC = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'suggestion' | 'bug' | 'query'>('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await feedbackApi.submitFeedback({
        name: name || undefined,
        email: email || undefined,
        category,
        message,
      });
      if (res.data.success) {
        setSubmitted(true);
        setMessage('');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 text-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 text-center">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-[#07031A] via-[#2A0E80] to-[#4F20C9] text-white flex items-center justify-center shadow-xl border border-purple-400/30">
            <MessageSquare className="w-7 h-7 text-amber-300" />
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase tracking-wider inline-block">
            MongoDB Feedback Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            User Feedback & Suggestions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
            Your feedback directly shapes PathSeeker and Ask Pathseeker AI. Submissions are saved directly to our database for review.
          </p>
        </motion.div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 rounded-[32px] bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-center space-y-4 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-black">Feedback Stored in Database!</h3>
            <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed font-medium">
              Thank you for helping us improve PathSeeker! Our product team and admins have received your input in real-time.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                Submit Another Message
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-[32px] bg-white border border-slate-200 shadow-xl space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#4F20C9]" /> Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#4F20C9]" /> Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Feedback Category *</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'suggestion', label: '💡 Suggestion' },
                  { id: 'bug', label: '🐛 Bug Report' },
                  { id: 'query', label: '❓ General Query' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                      category === item.id
                        ? 'bg-[#4F20C9] text-white shadow-md font-extrabold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Message *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your detailed feedback, suggestion, or bug description..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Storing in Database...' : 'Submit Feedback to MongoDB'}</span>
              <Send className="w-4 h-4" />
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

