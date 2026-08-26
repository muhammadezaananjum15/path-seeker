import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerApi } from '../../services/careerApi';
import { bookmarkApi } from '../../services/bookmarkApi';
import {
  Search, SlidersHorizontal, ArrowRight, Bookmark, DollarSign, TrendingUp,
  Brain, CheckCircle2, ChevronRight, X, Sparkles, Filter, ShieldCheck, Scale, Check, Plus
} from 'lucide-react';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';

const FALLBACK_CAREERS = [
  {
    _id: 'c1',
    title: 'Full Stack Software Engineer',
    domain: 'Technology',
    expectedSalaryRange: { min: 85000, max: 165000 },
    demandLevel: 'High Demand',
    growthRate: '+24% Annual Growth',
    description: 'Design, develop, and maintain end-to-end web applications using modern frontend frameworks (React/Next.js) and backend cloud microservices (Node.js/Python).',
    requiredSkills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB/PostgreSQL', 'Docker', 'REST APIs'],
    educationLevel: 'Bachelor Degree or Equivalent Bootcamp Certification',
    certification: 'AWS Certified Developer / Meta Front-End Specialization',
  },
  {
    _id: 'c2',
    title: 'AI & Machine Learning Engineer',
    domain: 'Data & AI',
    expectedSalaryRange: { min: 110000, max: 210000 },
    demandLevel: 'High Demand',
    growthRate: '+35% Annual Growth',
    description: 'Build predictive AI models, fine-tune Generative AI LLMs, optimize vector databases, and deploy autonomous agent architectures.',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Vector DBs (Pinecone/Chroma)', 'LangChain', 'Docker', 'Linear Algebra'],
    educationLevel: 'Master Degree or Computer Science / Math Specialization',
    certification: 'TensorFlow Developer Certificate / AWS Machine Learning Specialty',
  },
  {
    _id: 'c3',
    title: 'Cybersecurity & Ethical Hacking Specialist',
    domain: 'Security',
    expectedSalaryRange: { min: 90000, max: 175000 },
    demandLevel: 'High Demand',
    growthRate: '+31% Annual Growth',
    description: 'Protect organizational networks, perform vulnerability penetration testing, configure SIEM dashboards, and defend against zero-day threats.',
    requiredSkills: ['Linux SysAdmin', 'Wireshark', 'Python Scripting', 'OWASP Top 10', 'SIEM (Splunk)', 'Penetration Testing (Metasploit)', 'Cryptography'],
    educationLevel: 'Bachelor Degree in Cybersecurity / Information Security',
    certification: 'CompTIA Security+ / CEH (Certified Ethical Hacker) / OSCP',
  },
  {
    _id: 'c4',
    title: 'UI/UX & Product Design Specialist',
    domain: 'Design',
    expectedSalaryRange: { min: 75000, max: 145000 },
    demandLevel: 'Steady',
    growthRate: '+16% Annual Growth',
    description: 'Craft intuitive user interfaces, conduct user research, establish design systems, and build high-fidelity interactive Figma prototypes.',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Information Architecture', 'Design Systems', 'Design Tokens', 'Framer', 'Usability Testing'],
    educationLevel: 'Bachelor Degree in Product Design, HCI, or Equivalent Portfolio',
    certification: 'Google UX Design Professional Certificate',
  },
  {
    _id: 'c5',
    title: 'Cloud Infrastructure & DevOps Engineer',
    domain: 'Infrastructure',
    expectedSalaryRange: { min: 105000, max: 190000 },
    demandLevel: 'High Demand',
    growthRate: '+28% Annual Growth',
    description: 'Automate CI/CD deployment pipelines, manage Kubernetes clusters, enforce Infrastructure as Code (Terraform), and optimize cloud architecture.',
    requiredSkills: ['AWS/GCP/Azure', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Bash/Python', 'CI/CD Pipelines (GitHub Actions)', 'Linux'],
    educationLevel: 'Bachelor Degree in Computer Science or IT Engineering',
    certification: 'AWS Certified Solutions Architect / CKA (Certified Kubernetes Administrator)',
  },
  {
    _id: 'c6',
    title: 'Technical Product Manager',
    domain: 'Product',
    expectedSalaryRange: { min: 95000, max: 180000 },
    demandLevel: 'Steady',
    growthRate: '+19% Annual Growth',
    description: 'Lead cross-functional engineering and design teams, define product requirements (PRDs), track sprint roadmaps, and analyze product telemetry.',
    requiredSkills: ['Product Strategy', 'Agile/Scrum', 'PRD Writing', 'SQL Data Querying', 'User Analytics (Mixpanel)', 'Wireframing', 'Sprint Planning'],
    educationLevel: 'Bachelor Degree in Business, CS, or Management',
    certification: 'Certified Scrum Product Owner (CSPO) / Pragmatic Institute Certified',
  },
];

export const CareersPage: React.FC = () => {
  // Pre-load with instant FALLBACK_CAREERS so data displays in 0ms on website load!
  const [careers, setCareers] = useState<any[]>(FALLBACK_CAREERS);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compare & Bookmark State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pathseeker_bookmarked_ids');
      return saved ? JSON.parse(saved) : ['c1', 'c3'];
    } catch (e) {
      return ['c1', 'c3'];
    }
  });
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const industries = ['All Industries', 'Technology', 'Data & AI', 'Security', 'Design', 'Infrastructure', 'Product'];

  // Async update fetch in background without blocking initial render
  useEffect(() => {
    const params: any = {};
    if (search) params.search = search;
    if (selectedIndustry !== 'All Industries') params.domain = selectedIndustry;

    careerApi.getCareers(params)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.careers) && res.data.careers.length > 0) {
          setCareers(res.data.careers);
        }
      })
      .catch(() => {});
  }, [search, selectedIndustry]);

  // Load bookmarks from API/storage
  useEffect(() => {
    bookmarkApi.getBookmarks('career')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.bookmarks)) {
          const ids = res.data.bookmarks.map((b: any) => b.itemId);
          setBookmarkedIds(ids);
          localStorage.setItem('pathseeker_bookmarked_ids', JSON.stringify(ids));
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleBookmark = async (career: any) => {
    const isSaved = bookmarkedIds.includes(career._id);
    let updated: string[] = [];
    if (isSaved) {
      updated = bookmarkedIds.filter((id) => id !== career._id);
    } else {
      updated = [...bookmarkedIds, career._id];
      try {
        await bookmarkApi.addBookmark({ itemType: 'career', itemId: career._id, title: career.title, category: career.domain });
      } catch (e) {}
    }
    setBookmarkedIds(updated);
    localStorage.setItem('pathseeker_bookmarked_ids', JSON.stringify(updated));
  };

  const handleToggleCompare = (career: any) => {
    const exists = compareList.some((c) => c._id === career._id);
    if (exists) {
      setCompareList(compareList.filter((c) => c._id !== career._id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 careers at once.');
        return;
      }
      setCompareList([...compareList, career]);
    }
  };

  const filteredCareers = careers.filter((c) => {
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.domain.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || c.domain.toLowerCase() === selectedIndustry.toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-[#07031A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Page Header Banner ─────────────────────────────────────────────── */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-[#07031A] via-purple-950 to-[#4F20C9] text-white space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                1,000+ Verified Tech Streams
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Career Exploration Bank
              </h1>
            </div>

            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:bg-amber-300 transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Selected ({compareList.length})</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-purple-100 max-w-3xl leading-relaxed">
            Filter high-growth tech paths by expected salary, global hiring demand, and skill stack requirements.
          </p>
        </div>

        {/* ── Search & Industry Filter Bar ──────────────────────────────────── */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers, skills, or titles..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
            />
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedIndustry === ind
                    ? 'bg-[#4F20C9] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* ── Career Cards Grid (Loaded Instantly) ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCareers.map((c, idx) => {
            const isSaved = bookmarkedIds.includes(c._id);
            const isCompared = compareList.some((comp) => comp._id === c._id);
            return (
              <ScrollAnimation key={c._id || idx} delay={idx * 0.05} enable3DTilt={true}>
                <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all space-y-5 flex flex-col justify-between h-full group hover:border-[#4F20C9]">
                  
                  {/* Top Bar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-[#4F20C9] text-[10px] font-black uppercase tracking-wider">
                        {c.domain}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {/* Compare Checkbox Button */}
                        <button
                          onClick={() => handleToggleCompare(c)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all ${
                            isCompared ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title="Add to side-by-side comparison"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => handleToggleBookmark(c)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all ${
                            isSaved ? 'bg-[#4F20C9] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title="Bookmark in Career Passport"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-[#07031A] group-hover:text-[#4F20C9] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {c.description}
                    </p>
                  </div>

                  {/* Metrics & Skill Pills */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] uppercase font-extrabold text-slate-400">Salary Range</p>
                        <p className="font-black text-[#07031A]">
                          ${c.expectedSalaryRange?.min?.toLocaleString()} - ${c.expectedSalaryRange?.max?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-extrabold text-slate-400">Demand Level</p>
                        <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[10px]">
                          {c.demandLevel}
                        </span>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {c.requiredSkills?.slice(0, 4).map((sk: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {sk}
                        </span>
                      ))}
                      {c.requiredSkills?.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-bold">
                          +{c.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Action Link */}
                    <Link
                      to={`/careers/${c._id}`}
                      className="w-full py-3 rounded-2xl bg-[#07031A] hover:bg-[#4F20C9] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow"
                    >
                      <span>View Full Career Roadmap</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              </ScrollAnimation>
            );
          })}
        </div>

      </div>

      {/* ── Side-by-Side Career Comparison Modal ─────────────────────────── */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-[#4F20C9]" />
                <h3 className="text-xl font-black text-[#07031A]">Side-by-Side Career Comparison</h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareList.map((item) => (
                <div key={item._id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-left">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded bg-purple-100 text-[#4F20C9] text-[10px] font-bold uppercase">
                      {item.domain}
                    </span>
                    <button
                      onClick={() => setCompareList(compareList.filter((c) => c._id !== item._id))}
                      className="text-xs text-rose-500 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>

                  <h4 className="text-lg font-black text-[#07031A]">{item.title}</h4>

                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <p className="font-extrabold text-slate-400 uppercase text-[10px]">Expected Salary</p>
                      <p className="font-black text-[#07031A] text-sm">
                        ${item.expectedSalaryRange?.min?.toLocaleString()} - ${item.expectedSalaryRange?.max?.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="font-extrabold text-slate-400 uppercase text-[10px]">Market Demand</p>
                      <p className="font-black text-emerald-600">{item.demandLevel}</p>
                    </div>

                    <div>
                      <p className="font-extrabold text-slate-400 uppercase text-[10px]">Growth Outlook</p>
                      <p className="font-bold text-slate-700">{item.growthRate || 'High Growth'}</p>
                    </div>

                    <div>
                      <p className="font-extrabold text-slate-400 uppercase text-[10px]">Required Core Stack</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.requiredSkills?.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 text-[10px] font-bold border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsCompareOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#07031A] text-white text-xs font-bold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
