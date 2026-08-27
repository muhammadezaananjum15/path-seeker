import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, CheckCircle2, Clock, AlertCircle, Database, Sparkles } from 'lucide-react';
import { feedbackApi } from '../../services/feedbackApi';

export const AdminFeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'reviewed' | 'resolved'>('all');

  const fetchFeedback = () => {
    setLoading(true);
    feedbackApi
      .adminGetFeedback()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.feedbacks)) {
          setFeedbacks(res.data.feedbacks);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'open' | 'reviewed' | 'resolved') => {
    try {
      await feedbackApi.adminUpdateFeedbackStatus(id, status);
      fetchFeedback();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback item from MongoDB?')) return;
    try {
      await feedbackApi.adminDeleteFeedback(id);
      fetchFeedback();
    } catch (e) {}
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (statusFilter === 'all') return true;
    return f.status === statusFilter;
  });

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase flex items-center gap-1 w-max mb-1">
            <Database className="w-3 h-3" /> MongoDB Feedback Collection
          </span>
          <h2 className="text-2xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            User Feedback Inbox ({filteredFeedbacks.length})
          </h2>
          <p className="text-xs text-slate-500 font-medium">Read user bug reports, suggestions, and queries saved directly in MongoDB.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-bold">
          {(['all', 'open', 'reviewed', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full capitalize transition-all ${
                statusFilter === st ? 'bg-[#4F20C9] text-white shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Sparkles className="w-6 h-6 text-[#4F20C9] animate-spin mx-auto mb-2" />
          <span>Fetching user feedback from MongoDB...</span>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-sm">
          No feedback entries found in MongoDB under filter <span className="font-bold uppercase text-[#4F20C9]">{statusFilter}</span>.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((f) => (
            <div
              key={f._id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-purple-200 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#07031A]">{f.name || 'Anonymous'}</span>
                  <span className="text-xs text-slate-400 font-medium">({f.email || 'No Email'})</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-black uppercase">
                    {f.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  "{f.message}"
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={f.status}
                  onChange={(e) => handleUpdateStatus(f._id, e.target.value as any)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    f.status === 'resolved'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : f.status === 'reviewed'
                      ? 'bg-purple-50 border-purple-200 text-purple-800'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <option value="open">Status: Open</option>
                  <option value="reviewed">Status: Reviewed</option>
                  <option value="resolved">Status: Resolved</option>
                </select>

                <button
                  onClick={() => handleDelete(f._id)}
                  className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Delete from MongoDB"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
