import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff,
  Sparkles, ShieldCheck, CheckCircle2, AlertCircle, GraduationCap, Briefcase, Award
} from 'lucide-react';
import { authApi } from '../../services/authApi';

const ROLES = [
  { id: 'student', label: 'Student', desc: 'High School / University', icon: GraduationCap },
  { id: 'graduate', label: 'Graduate', desc: 'Seeking First Tech Role', icon: Award },
  { id: 'professional', label: 'Professional', desc: 'Executing Career Pivot', icon: Briefcase },
] as const;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'student' | 'graduate' | 'professional'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'student' || roleParam === 'graduate' || roleParam === 'professional') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.data?.success) {
        const otpCode = res.data.otp || '';
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpCode)}`, {
          state: { otp: otpCode, name },
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration could not be completed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-[#07031A] to-purple-950 px-4 sm:px-6 py-12 relative overflow-hidden text-slate-100">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4F20C9]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[36px] shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Modern Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F20C9] to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Path<span className="text-[#8B5CF6]">Seeker</span>
              </span>
            </Link>

            {/* Title */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Create your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Get free lifetime access to career assessments, roadmaps, and video masterclasses.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center gap-2.5 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Choose Your Current Stage</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-300' : 'text-slate-500'}`} />
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{r.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-medium placeholder:text-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-medium placeholder:text-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-medium focus:bg-white/10 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <>
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-purple-300 hover:text-white hover:underline">
              Sign in →
            </Link>
          </div>
        </div>

        {/* Right Side: Visual Feature Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-slate-950 p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-[10px] font-black uppercase tracking-wider border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 100% Free Forever
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Launch Your Next Career Move With Confidence.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Whether you are preparing for your first tech job or planning a senior promotion, PathSeeker equips you with clear, guided roadmaps.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Interactive Career Quizzes', desc: '10-minute assessment to discover your strongest career matches' },
                { title: 'Free ATS Resume Downloads', desc: 'Battle-tested templates for software, AI, and design roles' },
                { title: 'Personalized Dashboard', desc: 'Track your learning time, bookmarks, and milestone goals' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Joined by 50,000+ engineers &amp; learners</span>
            <span className="text-purple-300 font-bold">★★★★★ 4.9/5</span>
          </div>
        </div>

      </div>
    </div>
  );
};
