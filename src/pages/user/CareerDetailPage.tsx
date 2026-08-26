import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careerApi } from '../../services/careerApi';
import { bookmarkApi } from '../../services/bookmarkApi';
import {
  ArrowLeft, Bookmark, CheckCircle2, DollarSign, TrendingUp, BookOpen,
  GraduationCap, Video, ShieldCheck, Award, Briefcase, ChevronRight, Zap, Target, HelpCircle
} from 'lucide-react';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';

export const CareerDetailPage: React.FC = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [note, setNote] = useState('');
  const [bookmarkId, setBookmarkId] = useState('');

  useEffect(() => {
    if (careerId) {
      careerApi
        .getCareerById(careerId)
        .then((res) => {
          if (res.data?.success && res.data?.career) {
            setCareer(res.data.career);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));

      bookmarkApi.getBookmarks('career').then((res) => {
        if (res.data?.success && Array.isArray(res.data.bookmarks)) {
          const found = res.data.bookmarks.find((b: any) => b.itemId === careerId);
          if (found) {
            setIsBookmarked(true);
            setBookmarkId(found._id);
            setNote(found.note || '');
          }
        }
      });
    }
  }, [careerId]);

  const handleBookmarkToggle = async () => {
    if (!career) return;
    if (isBookmarked) {
      try {
        await bookmarkApi.removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId('');
      } catch (e) {}
    } else {
      try {
        const res = await bookmarkApi.addBookmark({
          itemType: 'career',
          itemId: career._id || careerId,
          title: career.title,
          category: career.domain,
          note,
        });
        if (res.data?.success) {
          setIsBookmarked(true);
          setBookmarkId(res.data.bookmark._id);
        }
      } catch (e) {}
    }
  };

  const handleSaveNote = async () => {
    if (bookmarkId) {
      try {
        await bookmarkApi.updateNote(bookmarkId, note);
        alert('Sticky Note saved to your Career Passport!');
      } catch (e) {}
    }
  };

  // Default fallback data if career is loaded from memory
  const defaultCareerData = {
    title: career?.title || 'Full Stack Software Engineer',
    domain: career?.domain || 'Technology',
    description: career?.description || 'Build modern scalable web applications across frontend UI, backend microservices, and cloud databases.',
    expectedSalaryRange: career?.expectedSalaryRange || { min: 85000, max: 165000 },
    demandLevel: career?.demandLevel || 'High Demand',
    growthRate: career?.growthRate || '+24% Annual Growth',
    requiredSkills: career?.requiredSkills || ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Docker', 'REST APIs'],
    educationLevel: career?.educationLevel || 'Bachelor Degree or Equivalent Bootcamp Certification',
    certification: career?.certification || 'AWS Certified Developer / Meta Front-End Specialization',
  };

  const displayData = career || defaultCareerData;

  const minSalary = displayData.expectedSalaryRange?.min || 85000;
  const maxSalary = displayData.expectedSalaryRange?.max || 165000;

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-[#07031A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Back Button */}
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-[#4F20C9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Bank</span>
        </Link>

        {/* ── Top Main Banner ────────────────────────────────────────────────── */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
                  {displayData.domain}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {displayData.demandLevel}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {displayData.title}
              </h1>
            </div>

            <button
              onClick={handleBookmarkToggle}
              className={`px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isBookmarked ? 'bg-[#4F20C9] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              <span>{isBookmarked ? 'Saved in Career Passport' : 'Bookmark Career'}</span>
            </button>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl font-medium">
            {displayData.description}
          </p>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div className="w-12 h-12 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center font-black shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400">Average Salary Range</p>
                <p className="text-xl font-black text-[#07031A]">
                  ${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400">Market Growth Rate</p>
                <p className="text-xl font-black text-emerald-700">
                  {displayData.growthRate || '+24% Annual Growth'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400">Education Benchmark</p>
                <p className="text-xs font-extrabold text-[#07031A] line-clamp-2">
                  {displayData.educationLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: HOW TO BECOME THIS PROFESSIONAL (STEP-BY-STEP ROADMAP) ── */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-8">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
              CAREER BLUEPRINT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              How to Become a {displayData.title}
            </h2>
            <p className="text-xs text-slate-500">Step-by-step roadmap from beginner to industry ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 'Stage 1',
                title: 'Core Fundamentals',
                desc: 'Master foundational concepts, programming syntax, computer science logic, and git workflows.',
                items: ['Basic Programming Syntax', 'Data Structures & Logic', 'Git & Version Control'],
              },
              {
                step: 'Stage 2',
                title: 'Technical Tools & Stack',
                desc: 'Build proficiency with modern industry-standard frameworks, libraries, and runtime environments.',
                items: ['Framework Mastery (React/Node)', 'Database Design (SQL/NoSQL)', 'API Architecture'],
              },
              {
                step: 'Stage 3',
                title: 'Portfolio & Projects',
                desc: 'Construct 3 production-ready real world applications showcasing clean code and deployment.',
                items: ['Full Stack Capstone', 'Cloud Deployment (Docker)', 'Open Source Contribution'],
              },
              {
                step: 'Stage 4',
                title: 'Certification & Hiring',
                desc: 'Pass recognized industry certifications, prepare ATS resumes, and ace technical coding interviews.',
                items: ['Industry Certifications', 'ATS Resume Optimization', 'Mock Behavioral Interviews'],
              },
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full bg-[#4F20C9] text-white text-[10px] font-black uppercase">
                    {s.step}
                  </span>
                  <h4 className="text-lg font-black text-[#07031A]">{s.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  {s.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4F20C9] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: EXPECTED EARNINGS BY SENIORITY LEVEL ──────────────── */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-8">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              SALARY PROGRESSION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Earnings Potential by Experience Level
            </h2>
            <p className="text-xs text-slate-500">Live compensation benchmarks across career growth stages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { level: 'Entry Level', exp: '0 – 2 Years Experience', pay: `$${Math.round(minSalary * 0.9).toLocaleString()} – $${Math.round(minSalary * 1.1).toLocaleString()}/yr`, color: 'border-slate-200 bg-slate-50' },
              { level: 'Mid-Level Specialist', exp: '2 – 5 Years Experience', pay: `$${Math.round((minSalary + maxSalary) / 2).toLocaleString()} – $${Math.round(maxSalary * 0.9).toLocaleString()}/yr`, color: 'border-purple-200 bg-purple-50/50' },
              { level: 'Senior Engineer', exp: '5 – 8 Years Experience', pay: `$${Math.round(maxSalary * 0.95).toLocaleString()} – $${Math.round(maxSalary * 1.25).toLocaleString()}/yr`, color: 'border-indigo-200 bg-indigo-50/50' },
              { level: 'Lead / Director', exp: '8+ Years Leadership', pay: `$${Math.round(maxSalary * 1.3).toLocaleString()} – $${Math.round(maxSalary * 1.8).toLocaleString()}/yr`, color: 'border-emerald-200 bg-emerald-50/50' },
            ].map((sal, i) => (
              <div key={i} className={`p-6 rounded-3xl border space-y-3 ${sal.color}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{sal.exp}</span>
                <h4 className="text-base font-black text-[#07031A]">{sal.level}</h4>
                <p className="text-lg font-black text-[#4F20C9]">{sal.pay}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: SKILLS STACK & STICKY NOTE PASSPORT ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Skill Checklist */}
          <div className="lg:col-span-2 p-8 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-6">
            <h3 className="text-2xl font-black text-[#07031A] flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#4F20C9]" />
              <span>Required Tools & Skill Stack</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {displayData.requiredSkills?.map((skill: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4F20C9] shrink-0" />
                  <span className="text-xs font-extrabold text-[#07031A]">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Notes Widget */}
          <div className="p-8 rounded-[36px] bg-amber-50/80 border border-amber-200 shadow-md space-y-4">
            <h3 className="text-lg font-black text-amber-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-700" />
              <span>Passport Sticky Notes</span>
            </h3>
            <p className="text-xs text-amber-800 font-medium">Attach personal study goals or target companies for this career path.</p>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your goals (e.g. Master React & Node by Q3)..."
              className="w-full p-4 rounded-2xl bg-white border border-amber-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleSaveNote}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow"
            >
              Save Note to Passport
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
