import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Loader2, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
import { careerApi } from '../../services/careerApi';
import { useUIStore } from '../../stores/useUIStore';

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 8 },
};

export const AdminCareersPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    domain: 'Technology',
    description: '',
    requiredSkills: '',
    educationPath: '',
    minSalary: 80000,
    maxSalary: 150000,
    demandLevel: 'high',
    growthRate: 'High Growth',
  });

  const fetchCareers = () => {
    setLoading(true);
    careerApi.getCareers({ limit: 50 }).then((res) => {
      if (res.data.success) {
        setCareers(res.data.careers);
      }
    }).catch(() => {
      addToast({ type: 'error', title: 'Load Failed', message: 'Could not fetch career paths.' });
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      domain: 'Technology',
      description: '',
      requiredSkills: '',
      educationPath: '',
      minSalary: 80000,
      maxSalary: 150000,
      demandLevel: 'high',
      growthRate: 'High Growth',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Career title is required.' });
      return;
    }
    const skillsArr = form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: form.title,
      domain: form.domain,
      description: form.description,
      requiredSkills: skillsArr,
      educationPath: form.educationPath,
      expectedSalaryRange: { min: Number(form.minSalary), max: Number(form.maxSalary) },
      demandLevel: form.demandLevel,
      growthRate: form.growthRate,
    };

    setSaving(true);
    try {
      if (editingId) {
        await careerApi.updateCareer(editingId, payload);
        addToast({ type: 'success', title: 'Career Updated', message: `"${form.title}" has been updated.` });
      } else {
        await careerApi.createCareer(payload);
        addToast({ type: 'success', title: 'Career Created', message: `"${form.title}" was added to the career bank.` });
      }
      setShowModal(false);
      setEditingId(null);
      fetchCareers();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.response?.data?.message || 'Failed to save career. Check your connection.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      await careerApi.deleteCareer(id);
      addToast({ type: 'success', title: 'Career Deleted', message: `"${title}" was removed from the bank.` });
      setCareers((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      addToast({ type: 'error', title: 'Delete Failed', message: err.response?.data?.message || 'Could not delete career.' });
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (c: any) => {
    setEditingId(c._id);
    setForm({
      title: c.title,
      domain: c.domain,
      description: c.description,
      requiredSkills: c.requiredSkills?.join(', ') || '',
      educationPath: c.educationPath,
      minSalary: c.expectedSalaryRange?.min || 80000,
      maxSalary: c.expectedSalaryRange?.max || 150000,
      demandLevel: c.demandLevel || 'high',
      growthRate: c.growthRate || 'High Growth',
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Manage Career Bank ({careers.length})
            </h2>
            <p className="text-xs text-slate-500">Create, edit, and remove career paths from the database.</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="px-4 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Career
        </motion.button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center gap-3 text-slate-400 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-7 h-7 text-[#4F20C9] animate-spin" />
          <p className="text-xs font-semibold">Loading career bank...</p>
        </div>
      ) : careers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">No careers found.</p>
          <p className="text-xs text-slate-400">Click "Add New Career" to create your first career path.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-black uppercase text-[10px] text-slate-500 border-b border-slate-100">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Demand</th>
                <th className="p-4">Salary Range</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {careers.map((c) => (
                  <motion.tr
                    key={c._id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="p-4 font-bold text-[#07031A]">{c.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{c.domain}</span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-bold text-emerald-600 uppercase text-[10px]">
                        <TrendingUp className="w-3 h-3" />
                        {c.demandLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        {c.expectedSalaryRange?.min?.toLocaleString()} – {c.expectedSalaryRange?.max?.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Edit Career"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id, c.title)}
                          disabled={deletingId === c._id}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Career"
                        >
                          {deletingId === c._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal — animated */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="career-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.form
              key="career-modal"
              variants={MODAL_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSave}
              className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-[#07031A]">
                  {editingId ? 'Edit Career Path' : 'Create New Career Path'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Senior Full-Stack Engineer"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Demand Level</label>
                  <select
                    value={form.demandLevel}
                    onChange={(e) => setForm({ ...form, demandLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="very_high">Very High</option>
                    <option value="emerging">Emerging</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Education Roadmap</label>
                <input
                  type="text"
                  value={form.educationPath}
                  onChange={(e) => setForm({ ...form, educationPath: e.target.value })}
                  placeholder="CS degree or bootcamp + 2 years experience"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Salary (USD)</label>
                  <input
                    type="number"
                    value={form.minSalary}
                    onChange={(e) => setForm({ ...form, minSalary: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Salary (USD)</label>
                  <input
                    type="number"
                    value={form.maxSalary}
                    onChange={(e) => setForm({ ...form, maxSalary: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#4F20C9] hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'Saving...' : editingId ? 'Save Career' : 'Create Career'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
