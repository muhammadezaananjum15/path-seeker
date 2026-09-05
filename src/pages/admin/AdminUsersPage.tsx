import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Trash2, ShieldOff, ShieldCheck, Clock, ExternalLink,
  Brain, CheckCircle, XCircle, Filter, Eye, ChevronRight, X, BarChart3,
  Calendar, Award, Activity, MousePointerClick, TrendingUp, Loader2
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import apiClient from '../../services/apiClient';
import { useUIStore } from '../../stores/useUIStore';

interface UserWithStats {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  quizTaken: boolean;
  quizzes: {
    _id: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    status: string;
    completedAt?: string;
    createdAt: string;
  }[];
  totalPageTimeMs: number;
  totalPagesVisited: number;
  pageAggregated: {
    page: string;
    durationMs: number;
    visits: number;
  }[];
  externalClicksCount: number;
  linkClicks: {
    _id: string;
    url: string;
    sourcePage?: string;
    clickedAt: string;
  }[];
}

export const AdminUsersPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [quizFilter, setQuizFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modals for deep analytics inspection
  const [selectedUserForPages, setSelectedUserForPages] = useState<UserWithStats | null>(null);
  const [selectedUserForLinks, setSelectedUserForLinks] = useState<UserWithStats | null>(null);
  const [selectedUserForQuizzes, setSelectedUserForQuizzes] = useState<UserWithStats | null>(null);

  const fetchUsers = (q = search, role = roleFilter, quiz = quizFilter, sort = sortBy) => {
    setLoading(true);
    adminApi
      .getUsers({
        search: q,
        role: role === 'all' ? '' : role,
        quizStatus: quiz === 'all' ? '' : quiz,
        sort,
      } as any)
      .then((res) => {
        if (res.data?.success) {
          setUsers(res.data.users || []);
          setTotalCount(typeof res.data.total === 'number' ? res.data.total : (res.data.users?.length || 0));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(search, roleFilter, quizFilter, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, quizFilter, sortBy]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await adminApi.updateUserRole(id, role);
      fetchUsers();
      addToast({ type: 'success', title: 'Role Updated', message: `User role set to ${role}.` });
    } catch {
      addToast({ type: 'error', title: 'Role Update Failed', message: 'Could not update user role.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/admin/users/${id}`);
      addToast({ type: 'success', title: 'User Deleted', message: `"${name}" was permanently removed.` });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete user. Try again.' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleBan = async (id: string, name: string) => {
    try {
      const res = await apiClient.patch(`/admin/users/${id}/toggle-ban`);
      addToast({ type: 'success', title: 'User Status Changed', message: res.data.message || `${name} ban status toggled.` });
      fetchUsers();
    } catch {
      addToast({ type: 'error', title: 'Action Failed', message: 'Could not toggle ban status.' });
    }
  };

  const formatDuration = (ms: number) => {
    if (!ms || ms <= 0) return '0s';
    const totalSecs = Math.round(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-rose-100 text-rose-700',
    student: 'bg-indigo-100 text-indigo-700',
    graduate: 'bg-emerald-100 text-emerald-700',
    professional: 'bg-amber-100 text-amber-700',
    user: 'bg-purple-100 text-[#4F20C9]',
  };

  // Quick summary counts
  const totalQuizTakers = users.filter((u) => u.quizTaken).length;
  const totalSiteTimeMs = users.reduce((acc, u) => acc + (u.totalPageTimeMs || 0), 0);
  const totalClicksAcrossUsers = users.reduce((acc, u) => acc + (u.externalClicksCount || 0), 0);

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#4F20C9] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">User Analytics &amp; Management</h1>
              <p className="text-xs text-slate-500">Real-time tracking of quiz completion, page duration, and external link clicks.</p>
            </div>
          </div>
        </div>
      </div>


      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Registered Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{loading && !totalCount ? '...' : (totalCount || users.length)}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Quiz Participation</span>
            <Brain className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">
            {totalQuizTakers} <span className="text-xs font-bold text-slate-400">({(totalCount || users.length) ? Math.round((totalQuizTakers / (totalCount || users.length)) * 100) : 0}%)</span>
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Total Active Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{formatDuration(totalSiteTimeMs)}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Outbound Clicks</span>
            <MousePointerClick className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{totalClicksAcrossUsers}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(search, roleFilter, quizFilter, sortBy)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
          />
        </div>

        {/* Quiz Status Filter */}
        <select
          value={quizFilter}
          onChange={(e) => setQuizFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Quiz Statuses</option>
          <option value="taken">Quiz Completed</option>
          <option value="not_taken">Quiz Not Taken</option>
        </select>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="graduate">Graduate</option>
          <option value="professional">Professional</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="-createdAt">Newest Users</option>
          <option value="time_desc">Highest Time Spent</option>
          <option value="clicks_desc">Most Link Clicks</option>
          <option value="lastLogin_desc">Recent Login</option>
        </select>

        <button
          onClick={() => fetchUsers(search, roleFilter, quizFilter, sortBy)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>

      {/* Users Analytics Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-medium text-xs bg-white rounded-3xl border border-slate-200">
          Loading users and calculating real-time aggregated stats...
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 text-center text-slate-400 font-medium text-xs bg-white rounded-3xl border border-slate-200 space-y-2">
          <Users className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-bold text-slate-700">No users match your filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 font-black uppercase text-[10px] text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="p-4">User Profile</th>
                  <th className="p-4">Quiz Status</th>
                  <th className="p-4">Time Spent Per Page</th>
                  <th className="p-4">External Clicks</th>
                  <th className="p-4">Last Login / Joined</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => {
                  const latestQuiz = u.quizzes && u.quizzes.length > 0 ? u.quizzes[0] : null;

                  return (
                    <tr key={u._id} className="hover:bg-purple-50/40 transition-colors">
                      {/* Profile */}
                      <td className="p-4 max-w-[200px]">
                        <p className="font-bold text-slate-900 truncate">{u.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${roleColors[u.role] || 'bg-slate-100 text-slate-600'}`}>
                            {u.role}
                          </span>
                          <span className={`text-[10px] font-bold ${u.isVerified ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {u.isVerified ? '• Active' : '• Suspended'}
                          </span>
                        </div>
                      </td>

                      {/* Quiz Status */}
                      <td className="p-4">
                        {u.quizTaken ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> Completed
                            </span>
                            {latestQuiz && (
                              <button
                                onClick={() => setSelectedUserForQuizzes(u)}
                                className="block text-[11px] text-[#4F20C9] font-bold hover:underline cursor-pointer"
                              >
                                Score: {latestQuiz.score}% ({u.quizzes.length} attempt{u.quizzes.length > 1 ? 's' : ''})
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                            <XCircle className="w-3 h-3" /> Not Taken
                          </span>
                        )}
                      </td>

                      {/* Time Spent per Page */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-black text-slate-900">{formatDuration(u.totalPageTimeMs)}</p>
                          <button
                            onClick={() => setSelectedUserForPages(u)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4F20C9] hover:underline cursor-pointer"
                          >
                            <BarChart3 className="w-3 h-3" />
                            <span>{u.pageAggregated?.length || 0} pages breakdown →</span>
                          </button>
                        </div>
                      </td>

                      {/* External Link Clicks */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-black text-slate-900">{u.externalClicksCount || 0} clicks</p>
                          {u.externalClicksCount > 0 ? (
                            <button
                              onClick={() => setSelectedUserForLinks(u)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:underline cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View links →</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">No clicks yet</span>
                          )}
                        </div>
                      </td>

                      {/* Timestamps */}
                      <td className="p-4 text-[11px]">
                        <p className="text-slate-800 font-semibold">
                          Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          Joined: {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Role dropdown */}
                      <td className="p-4 text-center">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F20C9] cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="graduate">Graduate</option>
                          <option value="professional">Professional</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleBan(u._id, u.name)}
                            className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title={u.isVerified ? 'Suspend User' : 'Restore User'}
                          >
                            {u.isVerified ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal 1: Time Spent Per Page Breakdown ── */}
      {selectedUserForPages && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4F20C9] flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Time Spent Per Page</h3>
                  <p className="text-xs text-slate-500">Aggregated duration for {selectedUserForPages.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForPages(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Total Platform Active Time:</span>
              <span className="font-black text-[#4F20C9] text-sm">
                {formatDuration(selectedUserForPages.totalPageTimeMs)}
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(selectedUserForPages.pageAggregated || []).length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No page telemetry recorded yet.</p>
              ) : (
                selectedUserForPages.pageAggregated.map((p, idx) => {
                  const percent = selectedUserForPages.totalPageTimeMs > 0
                    ? Math.round((p.durationMs / selectedUserForPages.totalPageTimeMs) * 100)
                    : 0;

                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-800">{p.page}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{p.visits} visits</span>
                          <span className="font-bold text-[#4F20C9]">{formatDuration(p.durationMs)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#4F20C9] h-full rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: External Links Click Breakdown ── */}
      {selectedUserForLinks && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">External Links Clicked Breakdown</h3>
                  <p className="text-xs text-slate-500">{selectedUserForLinks.name} ({selectedUserForLinks.externalClicksCount} clicks)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForLinks(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(selectedUserForLinks.linkClicks || []).length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No external link clicks recorded.</p>
              ) : (
                selectedUserForLinks.linkClicks.map((click, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1 min-w-0 flex-1">
                      <a
                        href={click.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#4F20C9] hover:underline flex items-center gap-1.5 break-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span>{click.url}</span>
                      </a>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Source Page: <span className="text-slate-700 font-bold">{click.sourcePage || '/'}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                      {new Date(click.clickedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 3: Quiz Attempts Detail ── */}
      {selectedUserForQuizzes && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Quiz History &amp; Performance</h3>
                  <p className="text-xs text-slate-500">{selectedUserForQuizzes.name} ({selectedUserForQuizzes.quizzes.length} attempts)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForQuizzes(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedUserForQuizzes.quizzes.map((quiz, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 text-xs">{quiz.quizTitle || 'Career Aptitude Assessment'}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                        {quiz.status}
                      </span>
                      <span>{quiz.completedAt ? new Date(quiz.completedAt).toLocaleDateString() : new Date(quiz.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#4F20C9]">{quiz.score}%</span>
                    <p className="text-[10px] text-slate-400 font-bold">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
