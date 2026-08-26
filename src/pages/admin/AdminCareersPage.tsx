import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { careerApi } from '../../services/careerApi';

export const AdminCareersPage: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArr = form.requiredSkills.split(',').map((s) => s.trim());
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

    if (editingId) {
      await careerApi.updateCareer(editingId, payload);
    } else {
      await careerApi.createCareer(payload);
    }

    setShowModal(false);
    setEditingId(null);
    fetchCareers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this career path?')) {
      await careerApi.deleteCareer(id);
      fetchCareers();
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

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Manage Career Bank ({careers.length})</h2>
        <button
          onClick={() => {
            setEditingId(null);
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
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Add New Career
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading careers...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Demand</th>
                <th className="p-4">Salary Range</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {careers.map((c) => (
                <tr key={c._id}>
                  <td className="p-4 font-bold text-[#07031A]">{c.title}</td>
                  <td className="p-4">{c.domain}</td>
                  <td className="p-4 uppercase font-bold text-emerald-600">{c.demandLevel}</td>
                  <td className="p-4">${c.expectedSalaryRange?.min?.toLocaleString()} - ${c.expectedSalaryRange?.max?.toLocaleString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 bg-slate-100 rounded-lg">
                      <Edit className="w-4 h-4 text-[#4F20C9]" />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 bg-slate-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-[#07031A]">{editingId ? 'Edit Career' : 'Create Career'}</h3>
              <button type="button" onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Domain</label>
              <input type="text" required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Description</label>
              <textarea rows={2} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Required Skills (Comma separated)</label>
              <input type="text" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Education Roadmap</label>
              <input type="text" value={form.educationPath} onChange={(e) => setForm({ ...form, educationPath: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
            </div>
            <button type="submit" className="w-full py-3 bg-[#4F20C9] text-white rounded-full font-bold text-xs uppercase tracking-wider">Save Career</button>
          </form>
        </div>
      )}
    </div>
  );
};
