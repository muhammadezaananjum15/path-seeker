import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storyApi } from '../../services/storyApi';
import { ArrowLeft, Send, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const SubmitStoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [authorName, setAuthorName] = useState('');
  const [domain, setDomain] = useState('Technology');
  const [headline, setHeadline] = useState('');
  const [storyText, setStoryText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [timeline, setTimeline] = useState([
    { year: '2023', title: 'Took PathSeeker Quiz', description: 'Identified core strengths' },
    { year: '2024', title: 'Pivoted into Role', description: 'Landed new position' },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddTimeline = () => {
    setTimeline([...timeline, { year: new Date().getFullYear().toString(), title: '', description: '' }]);
  };

  const handleRemoveTimeline = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const handleTimelineChange = (index: number, field: string, value: string) => {
    const updated = [...timeline];
    (updated[index] as any)[field] = value;
    setTimeline(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await storyApi.submitStory({
        authorName,
        domain,
        headline,
        storyText,
        imageUrl: imageUrl || undefined,
        timeline: timeline.filter((t) => t.title.trim() !== ''),
      });

      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit story. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to="/stories" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#4F20C9] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Success Stories</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-8 sm:p-10 rounded-[32px] bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Direct MongoDB Submission
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Share Your Career Transformation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Inspire thousands of students and career changers across PathSeeker by publishing your journey.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {submitted ? (
            <div className="p-8 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black">Story Submitted to MongoDB!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed font-medium">
                Your story has been safely stored in the database under <span className="font-bold">Pending Review</span> status. An admin will approve it shortly to make it public.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/stories')}
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Return to Stories Hub
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ayaan Khan"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Career Domain *</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Headline *</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. How I Pivoted from Biology to Lead Data Analyst in 8 Months"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Transformation Story Details *</label>
                <textarea
                  rows={6}
                  required
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Describe your initial challenges, how PathSeeker or Ask Pathseeker AI guided your learning roadmap, and your outcome..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Profile Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
              </div>

              {/* Interactive Timeline Nodes */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#07031A] uppercase tracking-wider">Career Milestone Timeline</span>
                  <button
                    type="button"
                    onClick={handleAddTimeline}
                    className="px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-[#4F20C9] text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-3">
                  {timeline.map((node, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="text"
                        placeholder="Year (e.g. 2024)"
                        value={node.year}
                        onChange={(e) => handleTimelineChange(i, 'year', e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-50 border text-xs font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Milestone Title"
                        value={node.title}
                        onChange={(e) => handleTimelineChange(i, 'title', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 border text-xs font-semibold text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Short description"
                        value={node.description}
                        onChange={(e) => handleTimelineChange(i, 'description', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 border text-xs text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeline(i)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Submitting to Database...' : 'Submit Story to MongoDB'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

