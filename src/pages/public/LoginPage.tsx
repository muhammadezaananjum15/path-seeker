import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles,
  Compass, Award, Users, CheckCircle2, Star, Zap
} from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.data?.success) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin420@gmail.com');
    setPassword('420420420');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-[#07031A] to-purple-950 px-4 sm:px-6 py-12 relative overflow-hidden text-slate-100">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4F20C9]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[36px] shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Modern Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
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

            {/* Header */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Sign in to continue exploring personalized career roadmaps and masterclasses.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center gap-2.5 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-medium placeholder:text-slate-500 focus:bg-white/10 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-[#8B5CF6] hover:underline">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-purple-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>One-Click Admin Demo Login</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-purple-300 hover:text-white hover:underline">
              Create an account →
            </Link>
          </div>
        </div>

        {/* Right Side: Elegant Value Proposition Visual */}
        <div className="lg:col-span-6 bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-slate-950 p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-[10px] font-black uppercase tracking-wider border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Career Navigation Intelligence
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Your Career Trajectory, Powered by AI &amp; Real Data.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Unlock multi-stage career roadmaps, RIASEC assessment vectors, video masterclasses, and verified live job feeds tailored to your goals.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Personalized Career Matching', desc: 'Algorithm-backed match scores across 1,000+ roles' },
                { title: '150+ Curated Masterclasses', desc: 'From full-stack engineering to cybersecurity defense' },
                { title: 'ATS Resume Optimization', desc: 'Templates built for modern global tech hiring criteria' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
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
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>JWT Encrypted &amp; Protected</span>
            </div>
            <span className="text-purple-300 font-bold">PathSeeker 2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};
