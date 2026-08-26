import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { feedbackApi } from '../../services/feedbackApi';

export const FeedbackPage: React.FC = () => {
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'query'>('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await feedbackApi.submitFeedback({ category, message });
      if (res.data.success) {
        setSubmitted(true);
        setMessage('');
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 text-slate-900">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="space-y-1 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Platform Feedback</h1>
          <p className="text-xs text-slate-500">We value your input to continuously improve PathSeeker.</p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-emerald-50 text-emerald-700 text-center space-y-3">
            <h3 className="text-xl font-bold">Feedback Received!</h3>
            <p className="text-xs">Thank you for sharing your thoughts with our product team.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow"
            >
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'suggestion', label: 'Suggestion' },
                  { id: 'bug', label: 'Report Bug' },
                  { id: 'query', label: 'General Query' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      category === item.id ? 'bg-[#4F20C9] text-white shadow' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you love or how we can improve..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
