import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Search, Edit3, Trash2, CheckCircle, XCircle, Eye,
  Tag, Clock, Calendar, Globe, Sparkles, Filter, ChevronLeft, ChevronRight, X, Image as ImageIcon
} from 'lucide-react';
import { contentApi, ContentItem } from '../../services/contentApi';

export const AdminContentPage: React.FC = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionMsg, setActionMsg] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'Career Guide',
    tags: '',
    images: '',
    readTimeMinutes: 5,
    status: 'draft' as 'draft' | 'published',
  });

  const fetchContent = async (currentPage = page, q = search, status = statusFilter, sort = sortBy) => {
    setLoading(true);
    try {
      const res = await contentApi.getAdminContent({
        page: currentPage,
        limit: 8,
        search: q,
        status: status === 'all' ? '' : status,
        sort,
      });
      if (res.data?.success) {
        setContentList(res.data.content || []);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch {
      // Fallback empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(page, search, statusFilter, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm({
      title: '',
      body: '',
      category: 'Career Guide',
      tags: 'career, tech, skills, advice',
      images: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      readTimeMinutes: 5,
      status: 'draft',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      body: item.body,
      category: item.category || 'Article',
      tags: (item.tags || []).join(', '),
      images: (item.images || []).join(', '),
      readTimeMinutes: item.readTimeMinutes || 5,
      status: item.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      alert('Please provide both title and content body.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      images: form.images.split(',').map((i) => i.trim()).filter(Boolean),
      readTimeMinutes: Number(form.readTimeMinutes) || 5,
      status: form.status,
    };

    try {
      if (editingItem) {
        await contentApi.updateContent(editingItem._id, payload);
        setActionMsg(`"${form.title}" updated successfully.`);
      } else {
        await contentApi.createContent(payload);
        setActionMsg(`New article "${form.title}" created successfully.`);
      }
      setShowModal(false);
      fetchContent(page);
    } catch (err: any) {
      setActionMsg(err.response?.data?.message || 'Error saving content. Please ensure you are logged in as admin.');
    } finally {
      setTimeout(() => setActionMsg(''), 4000);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.title}"?`)) return;
    try {
      await contentApi.deleteContent(item._id);
      setActionMsg(`Article "${item.title}" deleted.`);
      fetchContent(page);
    } catch (err: any) {
      setActionMsg(err.response?.data?.message || 'Failed to delete content.');
    } finally {
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const handleToggleStatus = async (item: ContentItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await contentApi.updateContent(item._id, { status: newStatus });
      setActionMsg(`Status changed to ${newStatus}.`);
      fetchContent(page);
    } catch (err: any) {
      setActionMsg(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setTimeout(() => setActionMsg(''), 2500);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#4F20C9] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Content &amp; Article Management</h1>
              <p className="text-xs text-slate-500">Full CRUD for articles, blog posts, and career guides ({totalCount} total items).</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Content
        </button>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-2 shadow-sm"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{actionMsg}</span>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchContent(1, search, statusFilter, sortBy)}
            placeholder="Search by title, body, or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="title">Title (A-Z)</option>
          <option value="-viewsCount">Most Viewed</option>
        </select>

        <button
          onClick={() => fetchContent(1, search, statusFilter, sortBy)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Filter
        </button>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-medium text-xs bg-white rounded-3xl border border-slate-200">
          Loading content repository...
        </div>
      ) : contentList.length === 0 ? (
        <div className="p-16 text-center text-slate-400 font-medium text-xs bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">No content articles found.</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or click "Create New Content" to publish an article.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 font-black uppercase text-[10px] text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="p-4">Title &amp; Category</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Views &amp; Time</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {contentList.map((item) => (
                  <tr key={item._id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {item.category || 'Article'}
                        </span>
                        {item.author?.name && (
                          <span className="text-[10px] text-slate-400">by {item.author.name}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {(item.tags || []).slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-purple-50 text-[#4F20C9] text-[9px] font-bold">
                            #{tag}
                          </span>
                        ))}
                        {(item.tags || []).length > 3 && (
                          <span className="text-[9px] text-slate-400 font-bold">+{item.tags.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer transition-all ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {item.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <p className="font-bold text-slate-800">{item.viewsCount || 0} views</p>
                      <span className="text-[10px] text-slate-400">{item.readTimeMinutes || 5} min read</span>
                    </td>

                    <td className="p-4 text-slate-500 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-[#4F20C9] transition-colors cursor-pointer"
                          title="Preview Content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Edit Content"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 rounded-xl bg-slate-100 text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete Content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">
                Page {page} of {totalPages} ({totalCount} items)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4F20C9] flex items-center justify-center font-bold">
                  {editingItem ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-lg text-slate-900">
                  {editingItem ? 'Edit Article / Content' : 'Create New Article / Content'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Mastering the MERN Stack in 2025: A Practical Roadmap"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Career Guide">Career Guide</option>
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Data Science">AI &amp; Data Science</option>
                    <option value="UI/UX & Product">UI/UX &amp; Product</option>
                    <option value="Interview Prep">Interview Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Read Time (Mins)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={form.readTimeMinutes}
                    onChange={(e) => setForm({ ...form, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Live)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="react, nodejs, mongodb, web development"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URLs (Comma-separated)</label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content Body (Markdown or Plain Text) *</label>
                <textarea
                  rows={8}
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Write full article content, code snippets, learning steps, or interview questions..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Publish Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Content Preview Modal ── */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-[10px] font-black uppercase">
                {previewItem.category || 'Article'}
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewItem.images && previewItem.images.length > 0 && (
              <img
                src={previewItem.images[0]}
                alt={previewItem.title}
                className="w-full h-48 sm:h-64 object-cover rounded-2xl border border-slate-100"
              />
            )}

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{previewItem.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
                <span>{previewItem.readTimeMinutes} min read</span>
                <span>•</span>
                <span>{new Date(previewItem.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className={previewItem.status === 'published' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {previewItem.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
              {previewItem.body}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {(previewItem.tags || []).map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-bold">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
