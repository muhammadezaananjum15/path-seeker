import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Trash2, ShieldOff, ShieldCheck, ChevronDown } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import apiClient from '../../services/apiClient';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionMsg, setActionMsg] = useState('');

  const fetchUsers = (q = search, role = roleFilter) => {
    setLoading(true);
    adminApi
      .getUsers({ search: q, role: role === 'all' ? '' : role })
      .then((res) => {
        if (res.data.success) setUsers(res.data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    await adminApi.updateUserRole(id, role);
    fetchUsers();
    setActionMsg(`User role updated to ${role}.`);
    setTimeout(() => setActionMsg(''), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      setActionMsg(`User "${name}" deleted.`);
      setTimeout(() => setActionMsg(''), 2500);
      fetchUsers();
    } catch {
      setActionMsg('Delete failed. Try again.');
    }
  };

  const handleToggleBan = async (id: string, name: string) => {
    try {
      const res = await apiClient.patch(`/admin/users/${id}/toggle-ban`);
      setActionMsg(res.data.message);
      setTimeout(() => setActionMsg(''), 2500);
      fetchUsers();
    } catch {
      setActionMsg('Action failed. Try again.');
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-rose-100 text-rose-700',
    student: 'bg-indigo-100 text-indigo-700',
    graduate: 'bg-green-100 text-green-700',
    professional: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">{users.length} registered users on PathSeeker platform.</p>
        </div>
      </div>

      {/* Action Toast */}
      {actionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-semibold text-sm border border-indigo-200"
        >
          {actionMsg}
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(search, roleFilter)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); fetchUsers(search, e.target.value); }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="graduate">Graduate</option>
          <option value="professional">Professional</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => fetchUsers(search, roleFilter)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading users...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-black uppercase text-[10px] text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Change Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${roleColors[u.role] || 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 text-[11px] font-bold ${u.isVerified ? 'text-green-600' : 'text-slate-400'}`}>
                        {u.isVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                        {u.isVerified ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="student">Student</option>
                        <option value="graduate">Graduate</option>
                        <option value="professional">Professional</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBan(u._id, u.name)}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
                          title={u.isVerified ? 'Suspend user' : 'Restore user'}
                        >
                          {u.isVerified ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
