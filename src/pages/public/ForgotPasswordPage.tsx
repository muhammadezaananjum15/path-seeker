import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Mail, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/authApi';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      if (res.data.success) {
        setMessage('Password reset OTP sent! Redirecting to reset password page...');
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-8 p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg brand-glow">
            <Target className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="text-xs text-slate-500">Enter your registered email to receive a password reset OTP.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md brand-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Sending OTP...' : 'Send Reset OTP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
