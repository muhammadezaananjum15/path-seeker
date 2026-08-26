import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Mail, RefreshCw, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/useAuthStore';

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 15 * 60; // 15 minutes

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const email = searchParams.get('email') || '';
  const initialOtp = searchParams.get('otp') || location.state?.otp || '';

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Auto-fill from URL param
  useEffect(() => {
    if (initialOtp && initialOtp.length === OTP_LENGTH) {
      setDigits(initialOtp.split(''));
    }
  }, [initialOtp]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getOtpString = () => digits.join('');

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);
    setError('');
    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (paste.length === OTP_LENGTH) {
      setDigits(paste.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleVerify = useCallback(async (otpOverride?: string) => {
    const otp = otpOverride || getOtpString();
    if (otp.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otp });
      if (res.data.success) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        setSuccess('Account verified! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [digits, email]);

  // Auto-verify when all 6 digits filled
  useEffect(() => {
    const otp = getOtpString();
    if (otp.length === OTP_LENGTH && !loading) {
      handleVerify(otp);
    }
  }, [digits]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    setError('');
    try {
      const res = await authApi.resendOtp({ email });
      if (res.data.success) {
        setSuccess('New OTP sent! Check your email.');
        setSecondsLeft(OTP_EXPIRY_SECONDS);
        setResendCooldown(60);
        setDigits(Array(OTP_LENGTH).fill(''));
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600" />

          <div className="p-8 space-y-7">

            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/30"
              >
                <ShieldCheck className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Verify Your Email
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {email ? (
                    <>We sent a 6-digit code to <span className="font-bold text-indigo-600">{email}</span></>
                  ) : (
                    'Enter the 6-digit code sent to your email'
                  )}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2">
              <Clock className={`w-4 h-4 ${secondsLeft < 60 ? 'text-rose-500' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold tabular-nums ${secondsLeft < 60 ? 'text-rose-500' : 'text-slate-500'}`}>
                {secondsLeft > 0 ? `${formatTime(secondsLeft)} remaining` : 'OTP expired — please resend'}
              </span>
            </div>



            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 text-center"
                >
                  ⚠️ {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600 text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 6-box OTP Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3 text-center">
                Enter 6-digit code
              </label>
              <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={(e) => e.target.select()}
                    whileFocus={{ scale: 1.08 }}
                    className={`otp-input ${digit ? 'filled' : ''} ${loading ? 'opacity-60' : ''}`}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <motion.button
              onClick={() => handleVerify()}
              disabled={loading || getOtpString().length < OTP_LENGTH}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <><span>Verify & Enter Dashboard</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>

            {/* Resend */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendLoading}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>

            <div className="text-center text-xs text-slate-500">
              Wrong email?{' '}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Go back to register
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
