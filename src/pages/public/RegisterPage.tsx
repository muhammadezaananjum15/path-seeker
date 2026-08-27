import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff, Award, Users, BookOpen, Zap, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { gsap } from 'gsap';

const ROLES = [
  { id: 'student', label: 'Student', desc: 'High School / College' },
  { id: 'graduate', label: 'Graduate', desc: 'Job Hunting' },
  { id: 'professional', label: 'Professional', desc: 'Career Pivot' },
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

    gsap.fromTo(
      '.gsap-reg-left',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.gsap-reg-right',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' }
    );
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.data.success) {
        const otpCode = res.data.otp || '';
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpCode)}`, {
          state: { otp: otpCode, name },
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-[#07031A] overflow-x-hidden">

      {/* ── Left Panel: Form ─────────────────────── */}
      <div className="gsap-reg-left flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 lg:px-14 bg-white">
        <div className="w-full max-w-md space-y-5 sm:space-y-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center font-black text-sm sm:text-base shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Path<span className="text-[#4F20C9]">Seeker</span>
            </span>
          </Link>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Create your account
            </h1>
            <p className="text-xs text-slate-500 font-medium">Join PathSeeker to unlock AI career passport tools</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Picker */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Select Your Stage</label>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2 sm:p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      role === r.id
                        ? 'bg-purple-50 border-[#4F20C9] text-[#4F20C9] font-black shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 font-bold hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs">{r.label}</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ayaan Khan"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#07031A] font-semibold focus:bg-white focus:ring-2 focus:ring-[#4F20C9] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#07031A] font-semibold focus:bg-white focus:ring-2 focus:ring-[#4F20C9] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#07031A] font-semibold focus:bg-white focus:ring-2 focus:ring-[#4F20C9] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 disabled:opacity-60 transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Create Account & Verify OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#4F20C9] hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel: Brand Visual ─────────────── */}
      <div className="gsap-reg-right hidden lg:flex flex-col justify-between w-[48%] bg-gradient-to-br from-[#07031A] via-purple-950 to-[#4F20C9] p-14 relative overflow-hidden text-white">
        
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Registration</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Unlock Your Full<br />Career Potential
            </h2>
            <p className="text-purple-200 text-sm leading-relaxed max-w-md font-medium">
              Join thousands of learners building their modern career passport with AI insights and video masterclasses.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              'Personalized RIASEC Vector Career Scoring',
              'Access 150+ Video Guides & Podcasts',
              'ATS Compatible Resume Builder Tools',
              'One-Click Saved Bookmarks & Sticky Notes',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs text-purple-100 font-bold">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Card */}
        <div className="relative z-10 p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md space-y-2">
          <p className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Lifetime Free Exploration</p>
          <p className="text-xs text-purple-100 leading-relaxed font-medium">
            PathSeeker is built for student accessibility. Zero subscription fees required to explore career paths and download toolkits.
          </p>
        </div>

      </div>

    </div>
  );
};
