import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storyApi } from '../../services/storyApi';
import { ArrowLeft, Send } from 'lucide-react';

export const SubmitStoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [authorName, setAuthorName] = useState('');
  const [domain, setDomain] = useState('Technology');
  const [headline, setHeadline] = useState('');
  const [storyText, setStoryText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await storyApi.submitStory({
        authorName,
        domain,
        headline,
        storyText,
        imageUrl: imageUrl || undefined,
        timeline: [{ year: '2025', title: headline, description: 'Submitted Career Story' }],
      });

      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to="/stories" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#4F20C9]">
          <ArrowLeft className="w-4 h-4" />
          Back to Success Stories
        </Link>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Submit Your Career Journey</h1>
            <p className="text-xs text-slate-500">Inspire fellow students and professionals by sharing your experience.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-700 text-center space-y-3">
              <h3 className="text-lg font-bold">Story Submitted for Review!</h3>
              <p className="text-xs">Your story has been sent to our admin team. Once approved, it will be published on the platform.</p>
              <button
                onClick={() => navigate('/stories')}
                className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow"
              >
                Return to Stories Hub
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ayaan Khan"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Career Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold"
                >
                  <option value="Technology">Technology</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. How I pivoted from Mechanical Engineering to Senior Data Analyst"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Transformation Story</label>
                <textarea
                  rows={5}
                  required
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Share your challenges, learning resources used, and milestones..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-sm shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Submitting...' : 'Submit Story for Admin Review'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
