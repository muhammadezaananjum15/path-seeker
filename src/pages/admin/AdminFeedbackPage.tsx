import React, { useState, useEffect } from 'react';
import { feedbackApi } from '../../services/feedbackApi';

export const AdminFeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = () => {
    setLoading(true);
    feedbackApi.adminGetFeedback().then((res) => {
      if (res.data.success) setFeedbacks(res.data.feedbacks);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'open' | 'reviewed' | 'resolved') => {
    await feedbackApi.adminUpdateFeedbackStatus(id, status);
    fetchFeedback();
  };

  return (
    <div className="space-y-6 text-slate-900">
      <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>User Feedback Inbox ({feedbacks.length})</h2>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading feedback...</div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div key={f._id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#07031A]">{f.name} ({f.email})</span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-purple-50 text-[#4F20C9] text-[10px] font-bold uppercase">{f.category}</span>
                </div>
                <select
                  value={f.status}
                  onChange={(e) => handleUpdateStatus(f._id, e.target.value as any)}
                  className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="open">open</option>
                  <option value="reviewed">reviewed</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>
              <p className="text-xs text-slate-600">{f.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
