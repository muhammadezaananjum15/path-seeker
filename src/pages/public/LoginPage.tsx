import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Compass, BookOpen, TrendingUp, CheckCircle2, Star, Sparkles, Brain, Award } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/useAuthStore';
import { gsap } from 'gsap';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    gsap.fromTo(
      '.gsap-auth-left',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.gsap-auth-right',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.data.success) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-[#07031A] overflow-x-hidden">

      {/* ── Left Panel: Form ─────────────────────── */}
      <div className="gsap-auth-left flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:px-16 bg-white">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-2xl font-black tracking-tight text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Path<span className="text-[#4F20C9]">Seeker</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 font-medium">Enter your credentials to access your Career Passport</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-2.5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-[#07031A] font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#4F20C9] focus:border-transparent focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#4F20C9] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-[#07031A] font-semibold focus:bg-white focus:ring-2 focus:ring-[#4F20C9] focus:border-transparent focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              className="w-full py-4 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 disabled:opacity-60 transition-all cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to Passport</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-[#4F20C9] hover:underline">
              Create free account →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Brand Visual ─────────────── */}
      <div className="gsap-auth-right hidden lg:flex flex-col justify-between w-[48%] bg-gradient-to-br from-[#07031A] via-purple-950 to-[#4F20C9] p-14 relative overflow-hidden text-white">
        
        {/* Top Branding */}
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300 uppercase tracking-widest backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Production Career Gateway</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl xl:text-5xl font-black leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Your Career Journey<br />Accelerated by AI.
            </h2>
            <p className="text-purple-200 text-sm leading-relaxed max-w-md font-medium">
              Access personalized RIASEC vector scoring, 150+ video masterclasses, and real-time salary intelligence.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4 pt-2">
            {[
              { icon: Brain, title: 'AI Recommendation Engine', desc: 'Vector-matched career trajectories' },
              { icon: BookOpen, title: '1,000+ Verified Roadmaps', desc: 'Step-by-step skill mastery tracks' },
              { icon: ShieldCheck, title: '98.4% ATS Compatible', desc: 'Resume templates for global tech hiring' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-purple-300 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">{f.title}</h4>
                  <p className="text-[11px] text-purple-200 font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
          {[
            { val: '10K+', lbl: 'Active Explorers' },
            { val: '1,200+', lbl: 'Career Streams' },
            { val: '99.2%', lbl: 'System Uptime' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center">
              <p className="text-xl font-black text-white">{s.val}</p>
              <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mt-0.5">{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
