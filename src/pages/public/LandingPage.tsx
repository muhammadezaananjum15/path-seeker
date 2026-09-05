import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Sparkles, BookOpen, ArrowRight, TrendingUp, Globe, Award,
  CheckCircle2, Zap, Briefcase, Play, RefreshCw, ChevronRight,
  Star, Users, Target, Brain, Quote, GraduationCap, Code, Activity, ShieldCheck, DollarSign, Video, PlayCircle, Bookmark, Plus, Minus, X, ChevronDown, Check, HelpCircle, Layers, MapPin, Newspaper
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { publicApi } from '../../services/publicApi';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';
import { HeroParallaxLayers } from '../../components/ui/HeroParallaxLayers';
import { gsap } from 'gsap';

const FEATURED_HOME_VIDEOS = [
  { id: 'rfscVS0vtbw', title: 'Full Stack Web Development Complete Roadmap 2025', cat: 'Technology', channel: 'FreeCodeCamp', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
  { id: 'aircAruvnKk', title: 'Neural Networks & Deep Learning Essentials', cat: 'AI & Data', channel: '3Blue1Brown', duration: '32:00', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { id: 'inWWhr5tnEA', title: 'Cybersecurity Fundamentals & Ethical Hacking', cat: 'Cybersecurity', channel: 'NetworkChuck', duration: '38:15', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { id: 'c9Wg6Cb_YlU', title: 'UI/UX Design Masterclass: Figma & Design Systems', cat: 'Design', channel: 'Mizko Design', duration: '28:40', thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80' },
];

const FAQS = [
  {
    question: 'How does PathSeeker AI calculate my career compatibility match score?',
    answer: 'PathSeeker evaluates your selected academic stage, skill ratings, preferred domains, and RIASEC psychological vector preferences against live global technology hiring benchmarks and industry market data to generate a multi-dimensional match percentage.',
  },
  {
    question: 'Is the platform completely free for Students and Graduates?',
    answer: 'Yes! PathSeeker offers 100% free lifetime access to career exploration banks, AI-powered interest quizzes, 150+ video masterclasses, downloadable ATS resume templates, and downloadable PDF checklists.',
  },
  {
    question: 'How do I access the Administrator Control Panel?',
    answer: 'Authorized administrators can sign in directly through the login page using production admin credentials (admin420@gmail.com / 420420420) to access live analytics, user management, and content moderation.',
  },
  {
    question: 'Can I bookmark careers, videos, and resources to review later?',
    answer: 'Absolutely. Every career profile, video guide, and document includes a one-click bookmark option. You can access your saved bookmarks and add custom sticky notes under "My Dashboard" or "Saved Bookmarks".',
  },
  {
    question: 'Are downloadable PDFs and ATS resume templates up to date for 2025?',
    answer: 'Yes, all downloadable resources are updated quarterly to match current ATS parsing guidelines, corporate hiring criteria, and modern technology stack requirements.',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [geminiTip, setGeminiTip] = useState(
    'Focus on building core problem-solving fundamentals. Technical tools change quickly, but structured reasoning is timeless across all career paths.'
  );
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Home Page Public APIs State (Sourced via github.com/public-apis/public-apis)
  const [homeJobs, setHomeJobs] = useState<any[]>([]);
  const [homeRepos, setHomeRepos] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [baseSalary, setBaseSalary] = useState(125000);
  const [currencyRates, setCurrencyRates] = useState<any>({ USD: 1, EUR: 0.92, GBP: 0.78, INR: 83.5, CAD: 1.36, AUD: 1.52 });

  useEffect(() => {
    // GSAP Entrance Animations
    gsap.fromTo(
      '.gsap-hero-title',
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.gsap-hero-sub',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' }
    );

    // Instant zero-lag fetches
    apiClient.get('/gemini/career-tip')
      .then((r) => { if (r.data?.success && r.data?.tip) setGeminiTip(r.data.tip); })
      .catch(() => {});

    publicApi.getRemoteJobs('software-development')
      .then((res) => { if (res.data?.success && Array.isArray(res.data.jobs)) setHomeJobs(res.data.jobs.slice(0, 3)); })
      .catch(() => {});

    publicApi.getGithubProjects('react')
      .then((res) => { if (res.data?.success && Array.isArray(res.data.repos)) setHomeRepos(res.data.repos.slice(0, 3)); })
      .catch(() => {});

    publicApi.getCurrencyRates()
      .then((res) => { if (res.data?.success && res.data.rates) setCurrencyRates(res.data.rates); })
      .catch(() => {});
  }, []);

  const convertedSalary = Math.round(baseSalary * (currencyRates[selectedCurrency] || 1));

  return (
    <div className="bg-white text-[#07031A] min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO PARALLAX LAYERS (3D Scrolling Animation)
      ═══════════════════════════════════════════════════════ */}
      <HeroParallaxLayers
        headerTitle="Architect Your Future."
        headerHighlight="Own Your Trajectory."
        headerSubtitle="The unified platform powering students, graduates, and working professionals with AI career matching, 150+ video masterclasses, ATS resume tools, and live hiring feeds."
        onTakeQuiz={() => navigate('/quiz')}
        onExploreCareers={() => navigate('/careers')}
      />

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: GLOBAL STATS & IMPACT METRICS (PREMIUM BENTO)
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="p-8 sm:p-12 rounded-[40px] bg-gradient-to-b from-slate-900 via-slate-950 to-[#07031A] text-white shadow-2xl border border-slate-800/80 relative overflow-hidden">
          {/* Subtle Ambient Glow inside stats box */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4F20C9]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-800">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
                Proven Platform Impact
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Engineered for Measurable Career Growth
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-normal leading-relaxed">
              Real-time analytics and global hiring data benchmarked against verified tech industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
              {
                metric: '98.4%',
                label: 'ATS Resume Match Rate',
                sublabel: 'Optimized for modern corporate parsers',
                badge: 'Top Tier',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                icon: Award,
              },
              {
                metric: '150+',
                label: 'Curated Masterclasses',
                sublabel: 'From architecture to interview prep',
                badge: 'Updated Weekly',
                badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                icon: Video,
              },
              {
                metric: '50,000+',
                label: 'Active Explorers',
                sublabel: 'Across 40+ countries & domains',
                badge: '+34% this month',
                badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                icon: Users,
              },
              {
                metric: '$125K+',
                label: 'Avg Starting Tech Salary',
                sublabel: 'Live verified compensation index',
                badge: 'High Demand',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                icon: DollarSign,
              },
            ].map(({ metric, label, sublabel, badge, badgeColor, icon: Icon }, idx) => (
              <ScrollAnimation key={label} delay={idx * 0.08} enable3DTilt={true}>
                <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between space-y-4 h-full group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                      {badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{metric}</p>
                    <p className="text-xs font-bold text-slate-200">{label}</p>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal">{sublabel}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: 4-STEP CAREER BLUEPRINT ARCHITECTURE (NEW SECTION)
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
            THE PATHSEEKER BLUEPRINT
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            From Curiosity to Career Launch
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Our structured 4-stage ecosystem guides you step-by-step to your ideal technology role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'AI Match Assessment', desc: 'Take our 10-question interest quiz to calculate your domain fit score.', icon: Brain },
            { step: '02', title: 'Tailored Roadmap', desc: 'Unlock step-by-step learning stages from core tools to advanced architecture.', icon: Compass },
            { step: '03', title: 'Upskill & Practice', desc: 'Watch 150+ video masterclasses and download ATS resume templates.', icon: BookOpen },
            { step: '04', title: 'Land High-Paying Role', desc: 'Apply to top remote job postings and access interview handbooks.', icon: Award },
          ].map(({ step, title, desc, icon: Icon }, idx) => (
            <ScrollAnimation key={step} delay={idx * 0.1} enable3DTilt={true}>
              <div className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-xl space-y-4 relative overflow-hidden group hover:border-[#4F20C9] transition-all">
                <span className="text-5xl font-black text-purple-100 absolute top-4 right-4 font-mono group-hover:text-purple-200 transition-colors">
                  {step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center font-bold shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#07031A] leading-snug">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{desc}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: REAL-TIME AI CAREER TIP BANNER
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <ScrollAnimation direction="up">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4F20C9] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#4F20C9] text-white text-[10px] font-extrabold uppercase">
                    Daily AI Insight
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">Powered by Google Gemini</span>
                </div>
                <p className="text-sm font-bold text-slate-800 leading-relaxed max-w-3xl">
                  "{geminiTip}"
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/quiz')}
              className="px-5 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-sm cursor-pointer"
            >
              Get Full AI Plan →
            </button>
          </div>
        </ScrollAnimation>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: THREE TARGET PERSONA CARDS
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
            TAILORED EXPERIENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Choose Your Stage
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            PathSeeker customizes roadmap suggestions based on your exact academic or professional stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Students',
              desc: 'Lay the foundation. Discover high-growth streams, build early portfolio projects, and prepare ATS resumes.',
              icon: GraduationCap,
              tag: 'High School & College',
              color: 'bg-purple-50 text-[#4F20C9]',
            },
            {
              title: 'Graduates',
              desc: 'Accelerate your transition. Access junior software roles, behavioral interview guides, and industry news.',
              icon: Award,
              tag: 'Recent Graduates',
              color: 'bg-indigo-50 text-indigo-600',
            },
            {
              title: 'Professionals',
              desc: 'Pivot and ascend. Explore senior engineering tracks, cloud architecture roadmaps, and salary benchmarks.',
              icon: Briefcase,
              tag: 'Working Experts',
              color: 'bg-emerald-50 text-emerald-700',
            },
          ].map(({ title, desc, icon: Icon, tag, color }, idx) => (
            <ScrollAnimation key={title} delay={idx * 0.1} enable3DTilt={true}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col justify-between space-y-6 h-full group hover:border-[#4F20C9] transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold ${color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                      {tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#07031A]">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>

                <Link
                  to="/careers"
                  className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-[#4F20C9] hover:text-white text-[#4F20C9] font-bold text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                >
                  <span>Explore Paths</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7: FEATURED WORKING VIDEO GUIDES
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
              MULTIMEDIA HUB
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#07031A] mt-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Featured Video Masterclasses
            </h2>
          </div>
          <Link to="/multimedia" className="text-xs font-bold text-[#4F20C9] uppercase tracking-wider hover:underline flex items-center gap-1">
            <span>Explore All 150+ Videos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_HOME_VIDEOS.map((v, idx) => (
            <ScrollAnimation key={v.id} delay={idx * 0.08} enable3DTilt={true}>
              <div
                onClick={() => setSelectedVideo(v)}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-3 cursor-pointer group flex flex-col justify-between h-full"
              >
                <div className="space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 relative group/thumb border border-slate-100">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover/thumb:bg-slate-950/20 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold">
                      {v.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-purple-50 text-[#4F20C9] text-[10px] font-extrabold uppercase">
                      {v.cat}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{v.channel}</span>
                  </div>

                  <h4 className="font-extrabold text-sm text-[#07031A] line-clamp-2 leading-snug group-hover:text-[#4F20C9] transition-colors">
                    {v.title}
                  </h4>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-slate-100 group-hover:bg-[#4F20C9] group-hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video</span>
                </button>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8: INTERACTIVE ACCORDION FAQS
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-black uppercase tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#07031A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Got Questions? We Have Answers.
          </h2>
          <p className="text-xs text-slate-500">Click any question below to expand details.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <ScrollAnimation key={idx} delay={idx * 0.05}>
                <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-[#07031A] hover:text-[#4F20C9] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#4F20C9] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'bg-[#4F20C9] text-white rotate-180' : 'bg-slate-100 text-slate-600'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100"
                      >
                        <p className="pt-4">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9: FINAL CTA BANNER
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <ScrollAnimation direction="3d-flip">
          <div className="p-10 sm:p-16 rounded-[40px] bg-gradient-to-r from-[#07031A] via-purple-950 to-[#4F20C9] text-white space-y-6 shadow-2xl">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto leading-relaxed">
              Create your account to unlock personalized roadmaps, resume analysis, and bookmark notes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-full bg-white text-[#07031A] hover:bg-purple-50 font-bold text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-full border border-white/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
              >
                Account Sign In
              </button>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* ── Interactive Video Player Modal ──────────────────────────────── */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 space-y-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold">
                    {selectedVideo.cat || 'Video Guide'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Channel: {selectedVideo.channel}</span>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-inner border border-slate-200">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <h3 className="text-lg font-black text-[#07031A]">{selectedVideo.title}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Close Player
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
