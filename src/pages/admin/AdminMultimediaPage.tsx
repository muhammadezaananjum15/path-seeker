import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { multimediaApi } from '../../services/multimediaApi';

export const AdminMultimediaPage: React.FC = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [category, setCategory] = useState('Career Guide');
  const [transcript, setTranscript] = useState('');

  const fetchMedia = () => {
    setLoading(true);
    multimediaApi.getMedia().then((res) => {
      if (res.data.success) setMedia(res.data.media);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await multimediaApi.createMedia({
        title,
        youtubeVideoId,
        url: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
        category,
        transcript,
      });
      setTitle('');
      setYoutubeVideoId('');
      setTranscript('');
      fetchMedia();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete video entry?')) {
      await multimediaApi.deleteMedia(id);
      fetchMedia();
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Curated Multimedia Guides ({media.length})</h2>

      <form onSubmit={handleAdd} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-[#07031A]">Add Curated Video Entry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video Title" className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
          <input type="text" required value={youtubeVideoId} onChange={(e) => setYoutubeVideoId(e.target.value)} placeholder="YouTube Video ID (e.g. u72H_4c2dGg)" className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
        </div>
        <textarea rows={2} value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Transcript / Summary text..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#4F20C9] text-white font-bold text-xs uppercase tracking-wider">Save Video</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {media.map((item) => (
          <div key={item._id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-xs text-[#07031A]">{item.title}</p>
              <p className="text-[10px] text-slate-400">ID: {item.youtubeVideoId}</p>
            </div>
            <button onClick={() => handleDelete(item._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
