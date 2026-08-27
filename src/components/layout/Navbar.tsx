import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import apiClient from '../../services/apiClient';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .get('/notifications')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.notifications)) {
            const unread = res.data.notifications.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/careers' },
    { name: 'Assessment', path: '/quiz' },
    { name: 'Resources', path: '/resources' },
    { name: 'Multimedia', path: '/multimedia' },
    { name: 'Stories', path: '/stories' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {}
    logout();
    navigate('/login');
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* ── Floating Pill Navigation Header ────────── */}
      <header className="fixed top-[12px] sm:top-[16px] left-0 right-0 z-50 flex items-center justify-center px-2 sm:px-4 w-full pointer-events-none">
        <div className={`pointer-events-auto w-full max-w-[1280px] 2xl:max-w-[1440px] flex items-center justify-between backdrop-blur-xl rounded-full px-3 sm:px-5 py-2 shadow-xl border min-h-[58px] sm:h-[62px] transition-colors duration-300 ${
          isDark
            ? 'bg-black/95 text-slate-100 border-slate-800'
            : 'bg-white/95 text-slate-900 border-slate-200'
        }`}>

          {/* Left Brand Badge */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              {/* PathSeeker SVG Logo Icon */}
              <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full shrink-0 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="navbg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#07031A" />
                      <stop offset="55%" stopColor="#2D0FA0" />
                      <stop offset="100%" stopColor="#4F20C9" />
                    </linearGradient>
                    <linearGradient id="navneedle" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF176" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <filter id="navglow">
                      <feGaussianBlur stdDeviation="14" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  <rect width="512" height="512" rx="110" fill="url(#navbg)"/>
                  <ellipse cx="256" cy="240" rx="200" ry="190" fill="#4F20C9" opacity="0.22"/>
                  <path d="M 100 440 Q 200 380 256 340 Q 320 300 380 260" stroke="white" strokeOpacity="0.18" strokeWidth="28" strokeLinecap="round" fill="none"/>
                  <g filter="url(#navglow)" transform="translate(256,240)">
                    <polygon points="0,-130 55,0 0,40 -55,0" fill="url(#navneedle)" transform="rotate(-40)"/>
                    <polygon points="0,40 55,0 0,-130 -55,0" fill="#1A0B5C" transform="rotate(-40)" opacity="0.75"/>
                    <circle cx="0" cy="0" r="22" fill="white" opacity="0.95"/>
                    <circle cx="0" cy="0" r="12" fill="#4F20C9"/>
                  </g>
                </svg>
              </div>
              <span className={`font-extrabold text-sm sm:text-base tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Path<span className="text-purple-500">Seeker</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-3 ml-2 xl:ml-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[12px] xl:text-[13px] font-semibold tracking-wide transition-all px-2.5 py-1 rounded-full whitespace-nowrap ${
                      isActive
                        ? 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/40 font-bold'
                        : isDark
                        ? 'text-slate-300 hover:text-purple-300 hover:bg-slate-700/70'
                        : 'text-slate-600 hover:text-purple-600 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* ── Dark / Light Toggle ─────────────────── */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`relative w-[52px] h-[28px] rounded-full border transition-all duration-300 flex items-center shrink-0 ${
                isDark
                  ? 'bg-[#4F20C9] border-purple-600 shadow-[0_0_12px_rgba(79,32,201,0.4)]'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {/* Track icons */}
              <Sun className={`absolute left-1.5 w-3 h-3 transition-all duration-300 ${isDark ? 'opacity-40 text-white' : 'opacity-100 text-amber-500'}`} />
              <Moon className={`absolute right-1.5 w-3 h-3 transition-all duration-300 ${isDark ? 'opacity-100 text-white' : 'opacity-40 text-slate-400'}`} />
              {/* Thumb */}
              <span
                className={`absolute w-[22px] h-[22px] rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                  isDark
                    ? 'translate-x-[25px] bg-white'
                    : 'translate-x-[2px] bg-white border border-slate-200'
                }`}
              >
                {isDark
                  ? <Moon className="w-3 h-3 text-[#4F20C9]" />
                  : <Sun className="w-3 h-3 text-amber-500" />
                }
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:pl-2 sm:pr-3 py-1.5 rounded-full transition-all border text-xs font-bold ${
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#4F20C9] text-white flex items-center justify-center font-black text-[10px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className={`absolute right-0 mt-3 w-60 rounded-2xl border shadow-2xl py-2 z-50 p-1.5 space-y-1 transition-colors ${
                    isDark
                      ? 'bg-zinc-950 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className={`px-3 py-2 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Signed in as</p>
                      <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                        {user?.role || 'User'}
                      </span>
                    </div>
                    {[
                      { to: '/profile', label: 'My Profile' },
                      { to: '/dashboard', label: 'Dashboard' },
                      { to: '/bookmarks', label: 'Saved Bookmarks' },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-3 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 transition-colors ${
                          isDark ? 'hover:bg-purple-900/30' : 'hover:bg-purple-50'
                        }`}
                      >
                        Admin Suite Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors ${
                        isDark ? 'hover:bg-rose-900/30' : 'hover:bg-rose-50'
                      }`}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-all whitespace-nowrap ${
                    isDark
                      ? 'text-slate-300 hover:text-purple-300 hover:bg-slate-700'
                      : 'text-slate-700 hover:text-purple-600 hover:bg-slate-100'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-[#4F20C9] text-white hover:bg-purple-700 font-bold text-[11px] sm:text-[12px] shadow-md hover:shadow-purple-500/25 transition-all shrink-0 whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="inline">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-1.5 sm:p-2 rounded-full shrink-0 ml-0.5 transition-colors ${
                isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`fixed inset-x-4 top-[85px] z-50 rounded-3xl p-5 shadow-2xl border space-y-2 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 transition-colors ${
          isDark
            ? 'bg-zinc-950 text-slate-100 border-slate-800'
            : 'bg-white text-slate-900 border-slate-200'
        }`}>
          <div className={`grid grid-cols-2 gap-2 mb-3 pb-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  location.pathname === link.path
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                  isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-800'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#4F20C9] text-white font-bold text-xs shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};
