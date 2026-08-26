import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import apiClient from '../../services/apiClient';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
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

  return (
    <>
      {/* ── Lumio Floating Pill Navigation Header ──────── */}
      <header className="fixed top-[16px] left-0 right-0 z-50 flex items-center justify-center px-4 w-full pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[1100px] flex items-center justify-between bg-white/95 text-slate-900 backdrop-blur-xl rounded-full px-4 py-2.5 shadow-xl border border-slate-200 h-[62px]">
          
          {/* Left Brand Badge */}
          <div className="flex items-center gap-4 pl-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-[#4F20C9] to-indigo-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                Path<span className="text-purple-600">Seeker</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 ml-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[12.5px] font-semibold tracking-wide transition-all px-2.5 py-1 rounded-full ${
                      isActive
                        ? 'text-purple-700 bg-purple-50 font-bold'
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
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4F20C9] text-white flex items-center justify-center font-black text-[10px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-2xl py-2 z-50 p-1.5 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Signed in as</p>
                      <p className="text-xs font-bold truncate text-slate-900">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-100 text-purple-700">
                        {user?.role || 'User'}
                      </span>
                    </div>
                    <Link to="/profile" onClick={() => setUserDropdownOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100">
                      My Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setUserDropdownOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100">
                      Dashboard
                    </Link>
                    <Link to="/bookmarks" onClick={() => setUserDropdownOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100">
                      Saved Bookmarks
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="block px-3 py-2 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50">
                        Admin Suite Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-slate-700 hover:text-purple-600 hover:bg-slate-100 font-bold text-[12px] transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4F20C9] text-white hover:bg-purple-700 font-bold text-[12px] shadow-md hover:shadow-purple-500/25 transition-all shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-[85px] z-50 bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-2 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  location.pathname === link.path
                    ? 'bg-purple-100 text-purple-700'
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
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs"
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
