import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  HelpCircle,
  Video,
  Award,
  FileText,
  MessageSquare,
  Users,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Authorization Required</h2>
        <p className="text-sm text-slate-500">
          You must be logged in with an Admin account to access the PathSeeker Admin Suite.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-[#4F20C9] text-white font-semibold text-sm shadow-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const adminMenu = [
    { name: 'Analytics & Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Career Bank CRUD', path: '/admin/careers', icon: Briefcase },
    { name: 'Quiz Questions', path: '/admin/quiz', icon: HelpCircle },
    { name: 'Multimedia Center', path: '/admin/multimedia', icon: Video },
    { name: 'Success Stories Review', path: '/admin/success-stories', icon: Award },
    { name: 'Resource Library', path: '/admin/resources', icon: FileText },
    { name: 'Feedback & Queries', path: '/admin/feedback', icon: MessageSquare },
    { name: 'User Role Management', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-2xl font-bold text-slate-900">PathSeeker Admin Suite</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage careers, quiz questions, resources, and user accounts.</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          User Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-1 bg-white p-4 rounded-3xl border border-slate-200 h-fit">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#4F20C9] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Admin Content */}
        <main className="lg:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
