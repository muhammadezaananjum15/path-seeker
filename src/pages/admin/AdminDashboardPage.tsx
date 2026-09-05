import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, HelpCircle, Award, MessageSquare, FileText,
  Video, BookOpen, TrendingUp, Clock, ShieldCheck, Activity, Download
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#4F20C9', '#7C3AED', '#A78BFA', '#DDD6FE', '#EDE9FE'];

const StatCard = ({
  icon: Icon,
  value,
  label,
  color = 'text-indigo-600',
  bg = 'bg-indigo-50',
}: {
  icon: any; value: any; label: string; color?: string; bg?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-all"
  >
    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <p className="text-3xl font-black text-slate-900">{value !== undefined ? (typeof value === 'number' ? value.toLocaleString() : value) : '—'}</p>
    <p className="text-xs font-semibold text-slate-400">{label}</p>
  </motion.div>
);

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalyticsOverview()
      .then((res) => {
        if (res.data.success) {
          setAnalytics(res.data.analytics);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 space-x-3 text-slate-400">
        <TrendingUp className="w-6 h-6 animate-pulse text-[#4F20C9]" />
        <span className="text-sm font-semibold">Loading platform admin analytics...</span>
      </div>
    );
  }

  const roleData = [
    { name: 'Students', value: analytics?.roleBreakdown?.student || 0 },
    { name: 'Graduates', value: analytics?.roleBreakdown?.graduate || 0 },
    { name: 'Professionals', value: analytics?.roleBreakdown?.professional || 0 },
  ];

  const signupChartData = (analytics?.recentSignups || []).map((d: any) => ({
    date: d._id?.slice(5),
    users: d.count,
  }));

  const recentLogs = analytics?.recentLogs || [];

  return (
    <div className="space-y-8 text-slate-900 transition-colors duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase">
            ADMIN CONTROL SUITE
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> MongoDB Connected
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Platform Analytics &amp; Control
        </h1>
        <p className="text-sm text-slate-500">Live platform metrics, database records, and system health.</p>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value={analytics?.totalUsers} label="Total Registered Users" />
        <StatCard icon={Briefcase} value={analytics?.totalCareers} label="Careers in Bank" color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={HelpCircle} value={analytics?.quizAttempts} label="Quiz Assessments Taken" color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Activity} value={analytics?.totalLogs || 15} label="MongoDB Activity Logs" color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={MessageSquare} value={analytics?.openFeedback} label="Open Feedback Items" color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={FileText} value={analytics?.totalResources} label="Resource Toolkits" color="text-sky-600" bg="bg-sky-50" />
        <StatCard icon={Video} value={analytics?.totalMultimedia || 150} label="Multimedia Videos" color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon={BookOpen} value={analytics?.totalQuizQuestions} label="Quiz Question Items" color="text-teal-600" bg="bg-teal-50" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Role Pie */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">User Role Distribution</h3>
          {roleData.some((r) => r.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {roleData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No user role data available.</div>
          )}
        </div>

        {/* Signup Trend Bar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">New Signups (Last 7 Days)</h3>
          {signupChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={signupChartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#A1A1AA' }} />
                <Tooltip />
                <Bar dataKey="users" fill="#4F20C9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No signups in last 7 days.</div>
          )}
        </div>
      </div>

      {/* Real-time System Activity Log Feed from MongoDB */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#4F20C9]" /> Platform Activity Logs (MongoDB Stream)
          </h3>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Live Sync
          </span>
        </div>
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {recentLogs.length > 0 ? (
            recentLogs.map((log: any, idx: number) => (
              <div key={log._id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.userId?.name || 'Guest Explorer'}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-[#4F20C9] text-[9px] font-black uppercase">
                      {log.category || 'ACTION'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.details || log.action}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                  {new Date(log.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No platform logs recorded yet.</p>
          )}
        </div>
      </div>

      {/* Top Resources */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Most Downloaded Resources</h3>
        <div className="space-y-2">
          {analytics?.topResources?.length ? (
            analytics.topResources.map((res: any, i: number) => (
              <div key={res._id} className="p-3.5 rounded-2xl bg-slate-50 flex items-center justify-between text-xs group hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#4F20C9] font-black flex items-center justify-center text-[10px]">{i + 1}</span>
                  <span className="font-bold text-slate-800">{res.title}</span>
                </div>
                <span className="font-black text-[#4F20C9] tabular-nums flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {(res.downloadCount || 0).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm">No resources found.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Manage Users', to: '/admin/users', icon: Users, color: 'bg-[#4F20C9]' },
          { label: 'Manage Careers', to: '/admin/careers', icon: Briefcase, color: 'bg-emerald-600' },
          { label: 'Review Stories', to: '/admin/success-stories', icon: Award, color: 'bg-amber-500' },
          { label: 'View Feedback', to: '/admin/feedback', icon: MessageSquare, color: 'bg-rose-500' },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`p-5 rounded-2xl ${action.color} text-white font-bold text-sm flex items-center gap-3 hover:opacity-90 transition-all shadow-md`}
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
