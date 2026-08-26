import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, HelpCircle, Award, MessageSquare, FileText,
  Video, BookOpen, TrendingUp, CheckCircle2, AlertCircle, Clock,
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
    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow"
  >
    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <p className="text-3xl font-black text-slate-900">{value ?? '—'}</p>
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
        <TrendingUp className="w-6 h-6 animate-pulse text-indigo-500" />
        <span className="text-sm font-semibold">Loading admin analytics...</span>
      </div>
    );
  }

  const roleData = [
    { name: 'Students', value: analytics?.roleBreakdown?.student || 0 },
    { name: 'Graduates', value: analytics?.roleBreakdown?.graduate || 0 },
    { name: 'Professionals', value: analytics?.roleBreakdown?.professional || 0 },
  ];

  const signupChartData = (analytics?.recentSignups || []).map((d: any) => ({
    date: d._id?.slice(5), // MM-DD
    users: d.count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Control Panel</h1>
        <p className="text-sm text-slate-500 mt-1">Live PathSeeker platform metrics and system health.</p>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value={analytics?.totalUsers} label="Total Users" />
        <StatCard icon={Briefcase} value={analytics?.totalCareers} label="Careers in Bank" color="text-green-600" bg="bg-green-50" />
        <StatCard icon={HelpCircle} value={analytics?.quizAttempts} label="Quiz Attempts" color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Award} value={analytics?.pendingStories} label="Pending Story Reviews" color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={MessageSquare} value={analytics?.openFeedback} label="Open Feedback" color="text-violet-600" bg="bg-violet-50" />
        <StatCard icon={FileText} value={analytics?.totalResources} label="Resources" color="text-sky-600" bg="bg-sky-50" />
        <StatCard icon={Video} value={analytics?.totalMultimedia} label="Multimedia Videos" color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon={BookOpen} value={analytics?.totalQuizQuestions} label="Quiz Questions" color="text-teal-600" bg="bg-teal-50" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Role Pie */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">User Role Distribution</h3>
          {roleData.some((r) => r.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
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
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No users yet.</div>
          )}
        </div>

        {/* Signup Trend Bar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">New Signups (Last 7 Days)</h3>
          {signupChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={signupChartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#4F20C9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No recent signups.</div>
          )}
        </div>
      </div>

      {/* Top Resources */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Most Downloaded Resources</h3>
        <div className="space-y-2">
          {analytics?.topResources?.length ? (
            analytics.topResources.map((res: any, i: number) => (
              <div key={res._id} className="p-3.5 rounded-2xl bg-slate-50 flex items-center justify-between text-xs group hover:bg-indigo-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[10px]">{i + 1}</span>
                  <span className="font-bold text-slate-800">{res.title}</span>
                </div>
                <span className="font-black text-indigo-600 tabular-nums">{(res.downloadCount || 0).toLocaleString()} ↓</span>
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
          { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-indigo-600' },
          { label: 'Manage Careers', href: '/admin/careers', icon: Briefcase, color: 'bg-green-600' },
          { label: 'Review Stories', href: '/admin/success-stories', icon: Award, color: 'bg-amber-500' },
          { label: 'View Feedback', href: '/admin/feedback', icon: MessageSquare, color: 'bg-rose-500' },
        ].map((action) => (
          <a
            key={action.href}
            href={action.href}
            className={`p-5 rounded-2xl ${action.color} text-white font-bold text-sm flex items-center gap-3 hover:opacity-90 transition-opacity shadow-sm`}
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
};
