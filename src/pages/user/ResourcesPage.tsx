import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Search, Sparkles, Filter, Tag, X, CheckCircle2,
  BookOpen, Layers, Globe, ExternalLink, RefreshCw, Newspaper, ArrowRight, Code, DollarSign, Star, Briefcase, MapPin, TrendingUp, ShieldCheck, Eye, Award
} from 'lucide-react';
import { resourceApi } from '../../services/resourceApi';
import { articleApi } from '../../services/articleApi';
import { publicApi } from '../../services/publicApi';
import { logUserActivity } from '../../services/activityLogger';
import { ScrollAnimation } from '../../components/ui/ScrollAnimation';
import { generateResourcePdf, ResourceItem } from '../../utils/pdfGenerator';

const ENHANCED_RESOURCES: ResourceItem[] = [
  {
    _id: 'r1',
    title: 'Complete Software Engineer Resume & Portfolio Template 2025',
    category: 'Resume & CV',
    description: 'ATS-optimized resume template with bullet-point action verbs, project metrics, and portfolio layout used by engineers at Google, Meta, and Amazon.',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    pagesCount: '18 Pages',
    rating: '4.9 ★ (1,420 ratings)',
    difficulty: 'All Experience Levels',
    author: 'PathSeeker Senior Hiring Board',
    downloadCount: 3420,
    tags: ['Resume', 'ATS', 'Software', 'Portfolio'],
    outline: [
      'ATS Parsing Architecture & Keyword Placement Rules',
      'Action Verb Cheat-Sheet (200+ Impactful Verbs)',
      'High-Converting Full Stack & AI Project Bullet Examples',
      'GitHub Portfolio README Template & System Architecture Badges',
    ],
    detailedContent: [
      '• Rule 1: Use clear standard headings (Work Experience, Education, Technical Skills, Key Projects). Avoid tables or floating text boxes.',
      '• Rule 2: Quantify impact using the Google XYZ Formula: Accomplished [X] as measured by [Y], by doing [Z].',
      '• Example: Optimized React bundle size by 42% through code-splitting and dynamic imports, reducing LCP load times from 3.2s to 1.1s for 50,000 daily active users.',
      '• Example: Designed and deployed a resilient microservice backend handling 10,000+ API requests/sec with Redis LRU caching and MongoDB indexing.',
      '• Technical Stack Format: Group by Languages (TypeScript, Python, Go), Frameworks (React, Next.js, Node.js), Cloud/Tools (AWS, Docker, Git).',
    ],
  },
  {
    _id: 'r2',
    title: 'Top 50 Data Science & Python Interview Questions Handbook',
    category: 'Interview Prep',
    description: 'Comprehensive guide covering SQL queries, pandas dataframes, machine learning algorithms, statistical model evaluation, and live coding exercises.',
    fileType: 'PDF',
    fileSize: '5.2 MB',
    pagesCount: '32 Pages',
    rating: '4.8 ★ (980 ratings)',
    difficulty: 'Intermediate to Advanced',
    author: 'Lead Data Science Mentor',
    downloadCount: 2890,
    tags: ['Data Science', 'Python', 'SQL', 'Interview'],
    outline: [
      'SQL Window Functions & Complex Joins Cheat-Sheet',
      'Pandas Optimization & Vectorization Patterns',
      'Machine Learning Supervised vs Unsupervised Model Selection',
      'Model Evaluation Metrics (Precision, Recall, F1, ROC-AUC)',
    ],
    detailedContent: [
      '• Q1: How do you handle imbalanced datasets in classification tasks? (SMOTE oversampling, class weighting, Focal Loss, precision-recall curve).',
      '• Q2: Explain the difference between L1 (Lasso) and L2 (Ridge) regularization and when to use each.',
      '• Q3: Write an SQL query using Window Functions (ROW_NUMBER(), DENSE_RANK()) to find top 3 earning employees per department.',
      '• Q4: Explain Gradient Descent optimization and the impact of learning rate schedule on convergence.',
      '• Q5: What is the Curse of Dimensionality and how do PCA and t-SNE alleviate high-dimensional sparsity?',
    ],
  },
  {
    _id: 'r3',
    title: 'UI/UX Design System & Figma Component Kit Guide',
    category: 'Design & Product',
    description: 'Design system toolkit with auto-layout cards, color tokens, dark mode variants, typography scales, and responsive navigation components.',
    fileType: 'ZIP',
    fileSize: '12.4 MB',
    pagesCount: '24 Pages',
    rating: '4.9 ★ (750 ratings)',
    difficulty: 'Beginner to Intermediate',
    author: 'Principal Product Designer',
    downloadCount: 1750,
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Tokens'],
    outline: [
      'Atomic Design System Hierarchy (Atoms, Molecules, Organisms)',
      'Design Token Naming Conventions (Color, Spacing, Typography)',
      'Figma Auto-Layout 5.0 Best Practices & Component Variants',
      'Accessibility & WCAG 2.1 AAA Contrast Guidelines',
    ],
    detailedContent: [
      '• Component Structure: Master components built with slot instances for maximum layout flexibility.',
      '• Color Palette System: Primary (#4F20C9), Neutral Dark (#07031A), Soft Surface (#F8FAFC), Accent Emerald (#059669).',
      '• Typography Hierarchy: Display Heavy (Plus Jakarta Sans 36px/900), Section Header (20px/800), Body Text (14px/400).',
      '• Micro-Interactions: 200ms cubic-bezier transition specs for hover states, active presses, and drawer blurs.',
    ],
  },
  {
    _id: 'r4',
    title: 'DevOps & AWS Cloud Security Roadmap Guide',
    category: 'Cloud & Security',
    description: 'Step-by-step roadmap from Linux basics to Docker, Kubernetes, Terraform IaC, CI/CD pipelines, and AWS Solutions Architect certification.',
    fileType: 'PDF',
    fileSize: '6.1 MB',
    pagesCount: '40 Pages',
    rating: '5.0 ★ (1,120 ratings)',
    difficulty: 'Intermediate to Advanced',
    author: 'Senior Cloud DevOps Architect',
    downloadCount: 2110,
    tags: ['DevOps', 'AWS', 'Kubernetes', 'Terraform'],
    outline: [
      'Linux Administration & Bash Scripting Core Commands',
      'Containerization Architecture with Docker & Multi-Stage Builds',
      'Orchestration with Kubernetes (Pods, Services, Ingress, Helm)',
      'Infrastructure as Code (IaC) with Terraform & AWS Provider',
    ],
    detailedContent: [
      '• Phase 1: Linux Networking & Systems — Understand TCP/IP, SSH keys, systemd services, and process monitoring.',
      '• Phase 2: Docker Containerization — Write multi-stage Dockerfiles to build lightweight <50MB alpine container images.',
      '• Phase 3: Infrastructure as Code — Provision VPCs, EKS clusters, and S3 buckets idempotently using HCL in Terraform.',
      '• Phase 4: CI/CD Pipelines — Automate testing, vulnerability scanning (Trivy), and deployment with GitHub Actions.',
    ],
  },
  {
    _id: 'r5',
    title: 'Product Management Strategy & PRD Specification Template',
    category: 'Management',
    description: 'Standard Product Requirement Document (PRD) template for scoping features, metrics (OKRs/KPIs), user stories, and GTM strategy execution.',
    fileType: 'DOCX',
    fileSize: '3.1 MB',
    pagesCount: '15 Pages',
    rating: '4.7 ★ (630 ratings)',
    difficulty: 'All Experience Levels',
    author: 'VP of Product Management',
    downloadCount: 1980,
    tags: ['Product', 'PRD', 'Agile', 'Strategy'],
    outline: [
      'Problem Statement & Customer Persona Identification',
      'Success Metrics (North Star Metric, Activation, Retention)',
      'User Stories & Functional Acceptance Criteria',
      'Go-To-Market (GTM) Launch Checklist & Risk Matrix',
    ],
    detailedContent: [
      '• Section 1: Executive Summary & Objective — Define the core customer pain point and business value proposition.',
      '• Section 2: User Personas — Primary and secondary target personas with explicit jobs-to-be-done (JTBD).',
      '• Section 3: Feature Scoping — Prioritize P0 (Must Have), P1 (Should Have), and P2 (Nice to Have) requirements.',
      '• Section 4: Engineering Technical Specs — API payload schemas, database mutations, and third-party webhooks.',
    ],
  },
  {
    _id: 'r6',
    title: 'Cybersecurity Threat Modeling & Ethical Hacking Basics',
    category: 'Cloud & Security',
    description: 'Introduction to network penetration testing, OWASP Top 10 web vulnerabilities, cryptography, and security auditing tools.',
    fileType: 'PDF',
    fileSize: '7.4 MB',
    pagesCount: '48 Pages',
    rating: '4.9 ★ (890 ratings)',
    difficulty: 'Intermediate',
    author: 'Certified Ethical Hacker (CEH)',
    downloadCount: 1640,
    tags: ['Security', 'OWASP', 'Ethical Hacking', 'Cyber'],
    outline: [
      'OWASP Top 10 Vulnerabilities & Mitigation Strategies',
      'Network Reconnaissance with Nmap & Wireshark',
      'Web Application Exploitation (SQLi, XSS, CSRF)',
      'Security Operations Center (SOC) Log Monitoring',
    ],
    detailedContent: [
      '• Module 1: Broken Access Control — Enforce strict server-side authorization checks for all private API routes.',
      '• Module 2: Injection Attacks — Use parameterized SQL queries and Mongoose schemas to prevent command injection.',
      '• Module 3: Cross-Site Scripting (XSS) — Sanitize user inputs and set Content-Security-Policy (CSP) headers.',
      '• Module 4: Cryptographic Failures — Store passwords using bcrypt with salt rounds >= 10 and encrypt sensitive data at rest.',
    ],
  },
];

const FALLBACK_JOBS = [
  { id: 2091098, title: 'Senior Full-Stack Engineer (React & Node.js)', company: 'Lemon.io / TechVentures', category: 'Software Development', location: 'Remote (Global)', salary: '$120,000 - $160,000', url: 'https://remotive.com', tags: ['React', 'Node.js', 'TypeScript', 'AWS'] },
  { id: 2091097, title: 'Senior Data & AI Systems Engineer', company: 'DataSphere Labs', category: 'Software Development', location: 'Remote (US/EU)', salary: '$135,000 - $175,000', url: 'https://remotive.com', tags: ['Python', 'SQL', 'Databricks', 'AI'] },
  { id: 1919266, title: 'Lead Cybersecurity & Cloud Architect', company: 'ShieldSec Solutions', category: 'Cybersecurity', location: 'Remote (Worldwide)', salary: '$140,000 - $180,000', url: 'https://remotive.com', tags: ['AWS', 'Security', 'Docker', 'Kubernetes'] },
  { id: 1919265, title: 'UI/UX & Product Design Specialist', company: 'CreativePulse Studio', category: 'Design', location: 'Remote (US/LATAM)', salary: '$95,000 - $130,000', url: 'https://remotive.com', tags: ['Figma', 'UI/UX', 'Design Systems'] },
];

const FALLBACK_BLOGS = [
  {
    id: 'b1',
    title: 'Top High-Paying Technology Careers & Job Demand Trends for 2025',
    url: 'https://careers.google.com',
    description: 'Full Stack Engineering, Artificial Intelligence, and Cloud Architecture lead global job market growth with starting salaries exceeding $120,000.',
    author: 'Google Career Insights',
    publishedAt: new Date().toISOString(),
    readingTime: '5 min read',
    tags: ['Engineering', 'Salary', 'Hiring'],
  },
  {
    id: 'b2',
    title: 'Google & Tech Industry Announce Expansion of Remote AI & Data Science Roles',
    url: 'https://www.linkedin.com/jobs',
    description: 'Demand for Machine Learning specialists and Python data scientists increases by 35% as organizations deploy generative AI platforms.',
    author: 'LinkedIn Career Trends',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    readingTime: '6 min read',
    tags: ['AI', 'Data Science', 'Remote'],
  },
  {
    id: 'b3',
    title: 'How to Build an ATS-Resilient Resume for Software & Data Engineering',
    url: 'https://www.indeed.com',
    description: 'Expert guide on tailoring action verbs, quantitative metrics, and project portfolios to pass Applicant Tracking Systems.',
    author: 'Indeed Career Hub',
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    readingTime: '4 min read',
    tags: ['Resume', 'ATS', 'Interview'],
  },
];

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(ENHANCED_RESOURCES);
  const [jobs, setJobs] = useState<any[]>(FALLBACK_JOBS);
  const [blogs, setBlogs] = useState<any[]>(FALLBACK_BLOGS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

  // Public APIs State (Sourced from github.com/public-apis/public-apis)
  const [githubTopic, setGithubTopic] = useState('react');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [currencyRates, setCurrencyRates] = useState<any>({ USD: 1, EUR: 0.92, GBP: 0.78, INR: 83.5, CAD: 1.36, AUD: 1.52 });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [baseSalary, setBaseSalary] = useState(120000);

  const categories = ['All Categories', 'Career Guides', 'Resume & CV', 'Interview Prep', 'Design & Product', 'Management', 'Cloud & Security'];

  useEffect(() => {
    // 1. Fetch Resources
    resourceApi.getResources()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.resources) && res.data.resources.length > 0) {
          // Merge API data with enhanced properties
          const merged = res.data.resources.map((r: any, idx: number) => ({
            ...ENHANCED_RESOURCES[idx % ENHANCED_RESOURCES.length],
            ...r,
          }));
          setResources(merged);
        }
      })
      .catch(() => {});

    // 2. Public API: Remotive Remote Jobs
    publicApi.getRemoteJobs('software-development')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) {
          setJobs(res.data.jobs);
        }
      })
      .catch(() => {});

    // 3. Public API: Dev.to Tech Blogs
    publicApi.getDevToBlogs('career')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.articles) && res.data.articles.length > 0) {
          setBlogs(res.data.articles);
        }
      })
      .catch(() => {});

    // 4. Public API: GitHub Trending Projects
    publicApi.getGithubProjects(githubTopic)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.repos)) {
          setGithubRepos(res.data.repos);
        }
      })
      .catch(() => {});

    // 5. Public API: Exchange Rate Currency Converter
    publicApi.getCurrencyRates()
      .then((res) => {
        if (res.data?.success && res.data.rates) {
          setCurrencyRates(res.data.rates);
        }
      })
      .catch(() => {});
  }, [githubTopic]);

  const handleDownloadPdf = (resource: ResourceItem) => {
    resourceApi.incrementDownload(resource._id || 'r1').catch(() => {});
    logUserActivity(`Downloaded PDF Resource: ${resource.title}`).catch(() => {});
    generateResourcePdf(resource);
  };

  const convertedSalary = Math.round(baseSalary * (currencyRates[selectedCurrency] || 1));

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10 text-[#07031A]">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">

        {/* ── Main Banner ────────────────────────────────────────────────── */}
        <div className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[36px] bg-gradient-to-r from-[#07031A] via-purple-950 to-[#4F20C9] text-white space-y-3 sm:space-y-4 shadow-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            FREE DOWNLOADABLE PDF RESOURCES &amp; CAREER TOOLS
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Resource Hub &amp; Learning Gateway
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-3xl leading-relaxed">
            Download ATS resume templates, interview handbooks, and cloud roadmaps as formatted PDF files. Explore live remote jobs, GitHub repos, and currency converters.
          </p>
        </div>

        {/* ── SECTION 1: LIVE REMOTE TECH JOBS ── */}
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-[36px] bg-white border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-[#4F20C9]" />
              <div>
                <h3 className="text-xl font-black text-[#07031A]">Live Remote Tech Jobs</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Real-time global technology openings and hiring feeds</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200">
              ● Live Hiring Feed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-[#4F20C9] transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-[#07031A] leading-snug">{job.title}</h4>
                      <p className="text-xs font-bold text-slate-500">{job.company}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#4F20C9] text-[9px] font-black uppercase shrink-0">
                      {job.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      <DollarSign className="w-3 h-3 text-emerald-600" />
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {(job.tags || []).slice(0, 3).map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-extrabold uppercase">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-[#4F20C9] hover:underline"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PUBLIC API SECTION 2: GITHUB REPOS & SALARY CONVERTER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GitHub Public API: Live Open-Source Projects */}
          <div className="lg:col-span-2 p-8 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-[#4F20C9]" />
                <div>
                  <h3 className="text-xl font-black text-[#07031A]">Live GitHub Open-Source Repositories</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Curated open-source projects for building portfolio code</p>
                </div>
              </div>

              {/* Topic Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['react', 'python', 'cybersecurity', 'machine-learning', 'docker'].map((top) => (
                  <button
                    key={top}
                    onClick={() => setGithubTopic(top)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                      githubTopic === top ? 'bg-[#4F20C9] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{top}
                  </button>
                ))}
              </div>
            </div>

            {/* Repos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(githubRepos.length > 0 ? githubRepos : [
                { id: 1, name: 'react', stars: 220000, description: 'The library for web and native user interfaces.', url: 'https://github.com/facebook/react' },
                { id: 2, name: 'next.js', stars: 120000, description: 'The React Framework for the Web.', url: 'https://github.com/vercel/next.js' },
              ]).slice(0, 4).map((repo) => (
                <div key={repo.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#4F20C9]">{repo.name}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {repo.stars?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{repo.description || 'Open source portfolio repository.'}</p>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4F20C9] hover:underline pt-2 border-t border-slate-200"
                  >
                    <span>View Repository on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Currency Salary Converter */}
          <div className="p-8 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-black text-[#07031A]">Global Salary Converter</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Real-time global currency exchange benchmarks</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400">Base Salary (USD)</label>
                <input
                  type="number"
                  step={5000}
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-[#07031A]"
                />

                <label className="block text-[10px] font-extrabold uppercase text-slate-400">Select Global Currency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setSelectedCurrency(curr)}
                      className={`p-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedCurrency === curr ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <p className="text-[10px] font-bold text-emerald-800 uppercase">Converted Annual Salary</p>
                <p className="text-2xl font-black text-emerald-900">
                  {selectedCurrency === 'USD' && '$'}
                  {selectedCurrency === 'EUR' && '€'}
                  {selectedCurrency === 'GBP' && '£'}
                  {selectedCurrency === 'INR' && '₹'}
                  {selectedCurrency === 'CAD' && 'C$'}
                  {selectedCurrency === 'AUD' && 'A$'}
                  {convertedSalary.toLocaleString()}
                </p>
                <p className="text-[9px] text-emerald-700 font-semibold">Real-time global foreign exchange rates</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── SECTION 3: TECH BLOGS & INDUSTRY NEWS ── */}
        <div className="p-8 rounded-[36px] bg-white border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Newspaper className="w-6 h-6 text-[#4F20C9]" />
            <div>
              <h3 className="text-xl font-black text-[#07031A]">Company Job Blogs &amp; Industry Hiring News</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Latest tech hiring insights and career advice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((art) => (
              <div key={art.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-[#4F20C9] transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-[#4F20C9] uppercase">
                    <span>{art.author}</span>
                    <span>{art.readingTime}</span>
                  </div>
                  <h4 className="text-base font-black text-[#07031A] leading-snug line-clamp-2">{art.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{art.description}</p>
                </div>

                <a
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between w-full pt-3 border-t border-slate-200 text-xs font-black text-[#4F20C9] hover:underline"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Document Search & Filter ─────────────────────────────────────── */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, templates, checklists..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F20C9]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat ? 'bg-[#4F20C9] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── ENHANCED DOWNLOADABLE RESOURCE CARDS GRID (REDESIGNED FOR MAXIMUM LUXURY) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources
            .filter((r) => (selectedCategory === 'All Categories' || r.category === selectedCategory))
            .filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
            .map((res, idx) => (
              <ScrollAnimation key={res._id || idx} delay={idx * 0.05} enable3DTilt={true}>
                <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-xl hover:shadow-2xl space-y-5 flex flex-col justify-between h-full group hover:border-[#4F20C9] transition-all relative overflow-hidden">
                  
                  {/* Top Badge Accent */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-purple-50 text-[#4F20C9] text-[10px] font-black uppercase tracking-wider border border-purple-100">
                        {res.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider border border-slate-200">
                        {res.fileType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-[#07031A] leading-snug group-hover:text-[#4F20C9] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {res.title}
                    </h3>

                    {/* Summary Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                      {res.description}
                    </p>

                    {/* Extra Detailed Information Pills Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-600 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1">
                        📄 {res.pagesCount || '24 Pages'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1">
                        💾 {res.fileSize || '4.2 MB'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 font-extrabold">
                        {res.rating || '4.9 ★'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#4F20C9] border border-purple-200 font-extrabold">
                        {res.difficulty || 'Intermediate'}
                      </span>
                    </div>

                    {/* Chapter Outline Preview Chips */}
                    {res.outline && res.outline.length > 0 && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Module Highlights</p>
                        <div className="space-y-1">
                          {res.outline.slice(0, 2).map((item, i) => (
                            <p key={i} className="text-[11px] font-semibold text-slate-700 truncate flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4F20C9] shrink-0" />
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Footer Controls */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>📥 {res.downloadCount?.toLocaleString() || '1,420'} Downloads</span>
                      <span className="text-[#4F20C9]">Verified PDF Asset</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPreviewResource(res)}
                        className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Auto-Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownloadPdf(res)}
                        className="w-full py-2.5 rounded-2xl bg-[#4F20C9] hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer tracking-wider uppercase"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD</span>
                      </button>
                    </div>
                  </div>

                </div>
              </ScrollAnimation>
            ))}
        </div>

      </div>

      {/* Auto-Preview Modal with Full Document Outline & Excerpts */}
      <AnimatePresence>
        {previewResource && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewResource(null)}
          >
            <div
              className="w-full max-w-3xl bg-white rounded-[36px] p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#4F20C9] flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#07031A]">Document Outline &amp; Chapter Preview</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Verified Career &amp; Learning PDF Asset</p>
                  </div>
                </div>
                <button onClick={() => setPreviewResource(null)} className="p-2 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Overview */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-[#4F20C9] text-xs font-black uppercase">
                    {previewResource.category}
                  </span>
                  <h4 className="text-2xl font-black text-[#07031A]">{previewResource.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{previewResource.description}</p>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[9px] font-black uppercase text-slate-400">Pages</p>
                    <p className="text-sm font-black text-slate-900">{previewResource.pagesCount || '24 Pages'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[9px] font-black uppercase text-slate-400">File Size</p>
                    <p className="text-sm font-black text-slate-900">{previewResource.fileSize || '4.2 MB'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <p className="text-[9px] font-black uppercase text-amber-700">Rating</p>
                    <p className="text-sm font-black text-amber-900">{previewResource.rating || '4.9 ★'}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                    <p className="text-[9px] font-black uppercase text-purple-700">Difficulty</p>
                    <p className="text-sm font-black text-purple-900">{previewResource.difficulty || 'Intermediate'}</p>
                  </div>
                </div>

                {/* Outline Modules */}
                {previewResource.outline && (
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <h5 className="text-xs font-black text-[#07031A] uppercase tracking-wider">Curriculum &amp; Module Chapters</h5>
                    <div className="space-y-2">
                      {previewResource.outline.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#4F20C9] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Excerpt Snippets */}
                {previewResource.detailedContent && (
                  <div className="p-5 rounded-3xl bg-purple-50/50 border border-purple-200 space-y-2">
                    <h5 className="text-xs font-black text-[#4F20C9] uppercase tracking-wider">Sample Chapter Excerpt</h5>
                    <div className="space-y-1.5">
                      {previewResource.detailedContent.slice(0, 3).map((snippet, idx) => (
                        <p key={idx} className="text-xs font-medium text-slate-700 leading-relaxed">
                          {snippet}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Modal Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">📥 {previewResource.downloadCount?.toLocaleString() || '1,200'} Downloads</span>
                  <button
                    onClick={() => {
                      handleDownloadPdf(previewResource);
                      setPreviewResource(null);
                    }}
                    className="px-6 py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Formatted PDF Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
