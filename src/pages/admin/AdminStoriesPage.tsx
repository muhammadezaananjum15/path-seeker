import React, { useState, useEffect } from 'react';
import { Check, X, Trash2, Loader2, Plus, Edit2, Database, CheckCircle2, XCircle } from 'lucide-react';
import { storyApi } from '../../services/storyApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/useUIStore';

export const AdminStoriesPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);

  // Form Fields
  const [authorName, setAuthorName] = useState('');
  const [domain, setDomain] = useState('Technology');
  const [headline, setHeadline] = useState('');
  const [storyText, setStoryText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [submitting, setSubmitting] = useState(false);

  const fetchStories = () => {
    setLoading(true);
    storyApi
      .adminGetStories({ status: statusFilter === 'all' ? undefined : statusFilter })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.stories)) {
          setStories(res.data.stories);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStories();
  }, [statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingStory(null);
    setAuthorName('');
    setDomain('Technology');
    setHeadline('');
    setStoryText('');
    setImageUrl('');
    setStatus('approved');
    setModalOpen(true);
  };

  const handleOpenEditModal = (story: any) => {
    setEditingStory(story);
    setAuthorName(story.authorName || '');
    setDomain(story.domain || 'Technology');
    setHeadline(story.headline || '');
    setStoryText(story.storyText || '');
    setImageUrl(story.imageUrl || '');
    setStatus(story.status || 'approved');
    setModalOpen(true);
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStory) {
        await storyApi.adminUpdateStory(editingStory._id, {
          authorName, domain, headline, storyText,
          imageUrl: imageUrl || undefined,
          status,
        });
        addToast({ type: 'success', title: 'Story Updated', message: `"${headline}" has been saved.` });
      } else {
        await storyApi.adminCreateStory({
          authorName, domain, headline, storyText,
          imageUrl: imageUrl || undefined,
          status,
          timeline: [{ year: new Date().getFullYear().toString(), title: headline, description: 'Added by Admin' }],
        });
        addToast({ type: 'success', title: 'Story Created', message: `"${headline}" is now live.` });
      }
      setModalOpen(false);
      fetchStories();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Save Failed', message: err.response?.data?.message || 'Failed to save story.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    setActionLoadingId(id);
    try {
      await storyApi.adminUpdateStoryStatus(id, newStatus);
      addToast({ type: 'success', title: 'Status Updated', message: `Story marked as ${newStatus}.` });
      setStories((prev) => prev.map((s) => s._id === id ? { ...s, status: newStatus } : s));
    } catch {
      addToast({ type: 'error', title: 'Update Failed', message: 'Could not update story status.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, headline: string) => {
    setDeletingId(id);
    try {
      await storyApi.adminDeleteStory(id);
      addToast({ type: 'success', title: 'Story Deleted', message: `"${headline}" was permanently removed.` });
      setStories((prev) => prev.filter((s) => s._id !== id));
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete this story.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase flex items-center gap-1">
              <Database className="w-3 h-3 text-[#4F20C9]" /> MongoDB Database Live
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#07031A] pt-1.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Success Stories Admin Panel ({stories.length})
          </h2>
          <p className="text-xs text-slate-500 font-medium">Create, edit, approve, reject, or delete user success stories stored in MongoDB.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-bold">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                  statusFilter === st ? 'bg-[#4F20C9] text-white shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Create Button */}
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Sparkles className="w-6 h-6 text-[#4F20C9] animate-spin mx-auto mb-2" />
          <span>Fetching all MongoDB records...</span>
        </div>
      ) : stories.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-sm">
          No stories found in MongoDB under filter <span className="font-bold uppercase text-[#4F20C9]">{statusFilter}</span>.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {stories.map((story) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22 }}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-purple-200 transition-all"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#07031A]">{story.authorName}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-black uppercase">
                      {story.domain}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        story.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : story.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {story.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#07031A]">"{story.headline}"</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{story.storyText}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => handleOpenEditModal(story)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#4F20C9]" /> Edit
                  </button>

                  {story.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(story._id, 'approved')}
                      disabled={actionLoadingId === story._id}
                      className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-60 transition-colors"
                    >
                      {actionLoadingId === story._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Approve
                    </button>
                  )}
                  {story.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(story._id, 'rejected')}
                      disabled={actionLoadingId === story._id}
                      className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-60 transition-colors"
                    >
                      {actionLoadingId === story._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(story._id, story.headline)}
                    disabled={deletingId === story._id}
                    className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-60"
                    title="Delete Story"
                  >
                    {deletingId === story._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* CRUD Modal for Create / Edit Story in MongoDB */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-200 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {editingStory ? 'Edit MongoDB Story' : 'Create New MongoDB Story'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Sarah Lin"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#4F20C9]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Domain</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold text-slate-900"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="From Bootcamp Student to Senior React Engineer"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#4F20C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Story Content</label>
                  <textarea
                    rows={4}
                    required
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="Full transformation details..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#4F20C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Image Avatar URL (Optional)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-full bg-[#4F20C9] text-white text-xs font-bold shadow-md hover:bg-purple-700"
                  >
                    {submitting ? 'Saving to MongoDB...' : editingStory ? 'Update Story' : 'Create Story'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


