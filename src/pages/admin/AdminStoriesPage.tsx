import React, { useState, useEffect } from 'react';
import { Check, X, Award } from 'lucide-react';
import { storyApi } from '../../services/storyApi';

export const AdminStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = () => {
    setLoading(true);
    storyApi.adminGetStories().then((res) => {
      if (res.data.success && Array.isArray(res.data.stories)) {
        setStories(res.data.stories);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await storyApi.adminUpdateStoryStatus(id, status);
      fetchStories();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 text-slate-900">
      <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Review User Success Stories ({stories.length})</h2>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading stories...</div>
      ) : stories.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-sm">
          No stories submitted for review yet.
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <div
              key={story._id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#07031A]">{story.authorName}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    story.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : story.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {story.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#07031A]">{story.headline}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{story.storyText}</p>
              </div>

              {story.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(story._id, 'approved')}
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(story._id, 'rejected')}
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
