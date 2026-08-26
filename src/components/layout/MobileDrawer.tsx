import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  Compass,
  X,
  Home,
  Info,
  Layers,
  HelpCircle,
  Video,
  Users,
  BookOpen,
  LayoutDashboard,
  Bookmark,
  Bell,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const MobileDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobileDrawerOpen, setMobileDrawerOpen, setSearchModalOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const links = [
    { label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'About & Methodology', path: '/about', icon: <Info className="w-4 h-4" /> },
    { label: 'Career Bank', path: '/careers', icon: <Layers className="w-4 h-4" /> },
    { label: 'Interest Quiz', path: '/quiz', icon: <Compass className="w-4 h-4" /> },
    { label: 'Multimedia Hub', path: '/multimedia', icon: <Video className="w-4 h-4" /> },
    { label: 'Success Stories', path: '/stories', icon: <Users className="w-4 h-4" /> },
    { label: 'Resources & Guides', path: '/resources', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'My Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Passport Profile', path: '/profile', icon: <UserIcon className="w-4 h-4" /> },
    { label: 'Saved Bookmarks', path: '/bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Submit Story', path: '/submit-story', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Feedback', path: '/feedback', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Contact Us', path: '/contact', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  if (user?.role === 'admin') {
    links.push({
      label: 'Admin Control Center',
      path: '/admin',
      icon: <ShieldCheck className="w-4 h-4 text-[#6755C2]" />
    });
  }

  const handleNav = (path: string) => {
    setMobileDrawerOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-[#030305]/80 backdrop-blur-sm"
          />

          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-xs bg-[#08012B] border-l border-[#6755C2]/30 h-full flex flex-col justify-between shadow-[0_0_50px_rgba(3,3,5,0.9)] z-10 overflow-y-auto p-6"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#6755C2]/20">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#6755C2]" />
                  <span className="font-editorial text-lg font-bold text-[#F4F2FA]">
                    PathSeeker
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-[#8B85A8] hover:text-[#F4F2FA]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Snapshot in Drawer */}
              {isAuthenticated && user ? (
                <div className="p-3 bg-[#07031A] rounded-xl border border-[#6755C2]/30 flex items-center gap-3">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#402D9C] flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#F4F2FA] block truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#6755C2] block capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#07031A] rounded-xl border border-[#6755C2]/30">
                  <span className="text-xs text-[#8B85A8]">Not signed in</span>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1 pt-4">
                {links.map((link) => {
                  const isActive =
                    link.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);

                  return (
                    <button
                      key={link.path}
                      onClick={() => handleNav(link.path)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-left transition-colors cursor-pointer',
                        isActive
                          ? 'bg-[#402D9C] text-[#F4F2FA] font-medium'
                          : 'text-[#8B85A8] hover:text-[#F4F2FA] hover:bg-[#07031A]'
                      )}
                    >
                      <span className={isActive ? 'text-[#F4F2FA]' : 'text-[#6755C2]'}>
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout Footer */}
            <div className="pt-6 border-t border-[#6755C2]/20 mt-6">
              <button
                onClick={() => {
                  logout();
                  setMobileDrawerOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
