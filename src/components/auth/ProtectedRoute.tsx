import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { ShieldAlert, BookOpen, UserCheck, TrendingUp, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center px-4 py-16 text-slate-900">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 text-[#4F20C9] flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
              Authentication Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Unlock Your Career Passport Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Please sign up or log in as a Student, Graduate, or Working Professional to access your personalized dashboard, saved bookmarks, and AI career recommendations.
            </p>
          </div>

          {/* 3 Role Selection Cards for Sign up */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              to="/register?role=student"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#4F20C9] text-center space-y-2 transition-all group"
            >
              <BookOpen className="w-6 h-6 text-[#4F20C9] mx-auto group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-[#07031A]">Student</p>
              <p className="text-[10px] text-slate-400">School & College</p>
            </Link>

            <Link
              to="/register?role=graduate"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#4F20C9] text-center space-y-2 transition-all group"
            >
              <UserCheck className="w-6 h-6 text-[#4F20C9] mx-auto group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-[#07031A]">Graduate</p>
              <p className="text-[10px] text-slate-400">Recent Graduates</p>
            </Link>

            <Link
              to="/register?role=professional"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#4F20C9] text-center space-y-2 transition-all group"
            >
              <TrendingUp className="w-6 h-6 text-[#4F20C9] mx-auto group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-[#07031A]">Professional</p>
              <p className="text-[10px] text-slate-400">Working Experts</p>
            </Link>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-100">
            <Link
              to="/login"
              state={{ from: location }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
            >
              <span>Log In to Passport</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="bg-white min-h-[75vh] flex items-center justify-center p-4 text-slate-900">
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#07031A]">Role Access Restricted</h2>
          <p className="text-sm text-slate-500">
            Your current account role ({user.role}) does not have permission to view this section.
          </p>
          <Link to="/" className="inline-block px-6 py-3 rounded-full bg-[#4F20C9] text-white font-bold text-xs uppercase tracking-wider shadow">
            Return to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
