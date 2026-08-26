import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Globe, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-[#FAF9F5] pt-16 pb-10 px-6 rounded-t-[40px] mt-16 relative z-20 shadow-2xl">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#4F20C9] text-white flex items-center justify-center font-black text-base shadow-lg">
                P
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Path<span className="text-purple-400">Seeker</span>
              </span>
            </Link>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              PathSeeker is a full-stack career passport platform built with React, TypeScript, Node.js, Express.js, and MongoDB. Fulfilling Techwiz 6 Full-Stack SRS Specifications.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link to="/login" className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all">
                Login Portal
              </Link>
              <Link to="/register" className="px-3.5 py-1.5 rounded-full bg-[#4F20C9] hover:bg-purple-600 text-xs font-bold text-white transition-all shadow-md">
                Register Free
              </Link>
            </div>
          </div>

          {/* Product & Discovery */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-400">Career Passport</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><Link to="/careers" className="hover:text-white transition-colors">Career Bank Hub</Link></li>
              <li><Link to="/quiz" className="hover:text-white transition-colors">AI Interest Quiz</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Document Library</Link></li>
              <li><Link to="/multimedia" className="hover:text-white transition-colors">YouTube Video Guides</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
            </ul>
          </div>

          {/* AI Tools & Trends */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-400">AI Intelligence</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><Link to="/stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link to="/onboarding" className="hover:text-white transition-colors">Career Path Wizard</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors">Visual Sitemap</Link></li>
            </ul>
          </div>

          {/* Support & Account */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-400">Portal & Admin</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Graduate Login</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors text-purple-300 font-semibold">Admin Panel</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Feedback & Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PathSeeker Career Passport platform. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Link to="/sitemap" className="text-purple-300 font-bold hover:underline">Site Map</Link>
            <Link to="/about" className="hover:text-white transition-colors">About SRS</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

