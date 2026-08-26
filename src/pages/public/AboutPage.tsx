import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Globe,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen py-8 sm:py-12">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
        
        {/* About PathSeeker Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
              ABOUT PATHSEEKER
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              About <span className="text-[#4F20C9]">Us</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              PathSeeker is your smart Career Passport designed to help students, graduates, and professionals discover, explore, and achieve the careers that truly fit them.
            </p>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <Users className="w-5 h-5 text-[#4F20C9] mx-auto mb-1" />
                <p className="text-xl font-black text-[#07031A]">1,000+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Career Options</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <Globe className="w-5 h-5 text-[#4F20C9] mx-auto mb-1" />
                <p className="text-xl font-black text-[#07031A]">50+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Countries Covered</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <Award className="w-5 h-5 text-[#4F20C9] mx-auto mb-1" />
                <p className="text-xl font-black text-[#07031A]">10K+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Happy Users</p>
              </div>
            </div>
          </div>

          {/* Graphic */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md h-80 rounded-3xl bg-gradient-to-tr from-[#290C86] via-[#4F20C9] to-purple-600 p-1 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-[23px] bg-[#07031A] p-8 flex flex-col justify-between text-white relative">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded bg-white/10 text-xs font-semibold">Our Vision</span>
                  <h3 className="text-xl font-bold">Empowering Global Careers</h3>
                </div>
                <div className="my-auto text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                    <Compass className="w-10 h-10 text-amber-300 animate-spin" />
                  </div>
                  <p className="text-xs text-purple-200">Guiding seekers to their highest potential</p>
                </div>
                <p className="text-[11px] text-purple-300 text-right">PathSeeker Passport</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto py-4">
          <h2 className="text-3xl font-extrabold text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Our <span className="text-[#4F20C9]">Mission</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            To empower individuals with the right guidance, resources, and tools to make informed career decisions and build a successful future.
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4F20C9] flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#07031A]">Personalized Guidance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We provide interest-based quizzes and AI-powered career recommendations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4F20C9] flex items-center justify-center font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#07031A]">Explore Opportunities</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover global career options, job roles, and industry insights.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4F20C9] flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#07031A]">Learn & Grow</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access expert videos, resources, and downloadable career materials.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4F20C9] flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#07031A]">For Everyone</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed for students, graduates, and working professionals.
            </p>
          </div>
        </div>

        {/* Why Choose PathSeeker? Section */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-extrabold text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Why Choose <span className="text-[#4F20C9]">PathSeeker?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-[#4F20C9]" />
              <h4 className="font-bold text-sm text-[#07031A]">Easy to Use</h4>
              <p className="text-xs text-slate-500">Simple, intuitive, and user-friendly platform.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-[#4F20C9]" />
              <h4 className="font-bold text-sm text-[#07031A]">Trusted Content</h4>
              <p className="text-xs text-slate-500">Curated resources from industry experts.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-[#4F20C9]" />
              <h4 className="font-bold text-sm text-[#07031A]">Always Updated</h4>
              <p className="text-xs text-slate-500">Stay updated with the latest career trends.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <Lock className="w-5 h-5 text-[#4F20C9]" />
              <h4 className="font-bold text-sm text-[#07031A]">Secure & Reliable</h4>
              <p className="text-xs text-slate-500">We value your privacy and data security.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#07031A] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black">Your Future. Your Way.</h3>
            <p className="text-xs sm:text-sm text-slate-300">Take the first step towards a successful career journey with PathSeeker.</p>
          </div>
          <Link
            to="/quiz"
            className="px-7 py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 flex-shrink-0"
          >
            <span>Take Interest Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
