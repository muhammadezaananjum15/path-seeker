import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { resourceApi } from '../../services/resourceApi';

export const AdminResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career Guides');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('/uploads/sample-career-planning-guide.pdf');

  const fetchResources = () => {
    setLoading(true);
    resourceApi.getResources().then((res) => {
      if (res.data.success) setResources(res.data.resources);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resourceApi.createResource({ title, category, description, fileUrl, fileType: 'PDF' });
      setTitle('');
      setDescription('');
      fetchResources();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete resource?')) {
      await resourceApi.deleteResource(id);
      fetchResources();
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Resource Library PDFs ({resources.length})</h2>

      <form onSubmit={handleAdd} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-[#07031A]">Add New PDF Resource</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource Title" className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
          <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g. Resume & CV)" className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
        </div>
        <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#4F20C9] text-white font-bold text-xs uppercase tracking-wider">Save Resource</button>
      </form>

      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r._id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-[#4F20C9] text-[10px] font-bold uppercase">{r.category}</span>
              <p className="font-bold text-xs text-[#07031A] mt-1">{r.title}</p>
              <p className="text-[10px] text-slate-400">{r.downloadCount} Downloads</p>
            </div>
            <button onClick={() => handleDelete(r._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
