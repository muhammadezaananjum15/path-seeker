import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ExternalLink, ShieldCheck, User, Compass, HelpCircle, FileText, Video, MessageSquare } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const sections = [
    {
      title: 'Public Portal',
      icon: Compass,
      links: [
        { name: 'Home Landing Page', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us & FAQs', path: '/contact' },
        { name: 'Platform Sitemap', path: '/sitemap' },
      ],
    },
    {
      title: 'Authentication & Access',
      icon: User,
      links: [
        { name: 'User Login', path: '/login' },
        { name: 'Role Registration (Student / Graduate / Pro)', path: '/register' },
        { name: 'Forgot Password OTP Request', path: '/forgot-password' },
        { name: 'Reset Password', path: '/reset-password' },
        { name: 'Email OTP Verification', path: '/verify-otp' },
      ],
    },
    {
      title: 'User Passport & Career Discovery',
      icon: Compass,
      links: [
        { name: 'Personalized User Dashboard', path: '/dashboard' },
        { name: 'Career Bank (1000+ Careers)', path: '/careers' },
        { name: 'Interactive Career Quiz', path: '/quiz' },
        { name: 'Quiz Evaluation & Match Breakdown', path: '/quiz/results' },
        { name: 'Resource Library & Downloads', path: '/resources' },
        { name: 'Multimedia Video Guides', path: '/multimedia' },
        { name: 'Success Stories Hub', path: '/stories' },
        { name: 'Submit Your Success Story', path: '/stories/submit' },
        { name: 'Saved Bookmarks & PDF Export', path: '/bookmarks' },
        { name: 'User Profile & Resume Upload', path: '/profile' },
        { name: 'Platform Feedback Form', path: '/feedback' },
        { name: 'Notification Center', path: '/notifications' },
      ],
    },
    {
      title: 'Admin Control Suite',
      icon: ShieldCheck,
      links: [
        { name: 'Admin Analytics Overview', path: '/admin' },
        { name: 'Career Bank Management', path: '/admin/careers' },
        { name: 'Quiz Question Builder', path: '/admin/quiz' },
        { name: 'Multimedia Video Curator', path: '/admin/multimedia' },
        { name: 'Success Story Review Panel', path: '/admin/success-stories' },
        { name: 'Resource PDF Manager', path: '/admin/resources' },
        { name: 'User Feedback & Queries Inbox', path: '/admin/feedback' },
        { name: 'User Account & Role Control', path: '/admin/users' },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen py-12 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase">
            <Map className="w-4 h-4" />
            <span>Platform Architecture</span>
          </div>
          <h1 className="text-4xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>PathSeeker Platform Sitemap</h1>
          <p className="text-sm text-slate-500">Explore the complete route architecture and feature index of the PathSeeker application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4F20C9] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-[#07031A]">{section.title}</h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {section.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      to={link.path}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-xs font-semibold text-slate-700 hover:text-[#4F20C9] flex items-center justify-between transition-colors"
                    >
                      <span>{link.name}</span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        {link.path} <ExternalLink className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
