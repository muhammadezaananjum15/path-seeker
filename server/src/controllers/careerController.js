import { Career } from '../models/Career.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_CAREERS = [
  {
    _id: 'c1',
    title: 'Full Stack Software Engineer',
    domain: 'Technology',
    description: 'Design, build, and deploy modern web apps using React, Node.js, Express, and cloud databases.',
    expectedSalaryRange: { min: 85000, max: 150000 },
    demandLevel: 'high',
    educationPath: 'Bachelor in Computer Science or Software Bootcamp',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    growthOutlook: '25% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Learn Fundamentals', detail: 'HTML, CSS, JS, Git' },
      { step: 2, title: 'Master Frontend Framework', detail: 'React.js & TailwindCSS' },
      { step: 3, title: 'Backend & APIs', detail: 'Node.js, Express, REST & GraphQL' },
      { step: 4, title: 'Databases & Cloud', detail: 'MongoDB, PostgreSQL, AWS Deployment' },
    ],
  },
  {
    _id: 'c2',
    title: 'Data Scientist & AI Specialist',
    domain: 'Technology',
    description: 'Extract insights from massive datasets using Python, Machine Learning models, and Gemini AI.',
    expectedSalaryRange: { min: 95000, max: 175000 },
    demandLevel: 'high',
    educationPath: 'BS in Data Science, Statistics, or CS',
    requiredSkills: ['Python', 'SQL', 'PyTorch', 'Scikit-Learn', 'Statistics'],
    growthOutlook: '35% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Python & Data Analysis', detail: 'NumPy, Pandas, Matplotlib' },
      { step: 2, title: 'SQL & Data Warehousing', detail: 'PostgreSQL, Snowflake, BigQuery' },
      { step: 3, title: 'Machine Learning', detail: 'Supervised/Unsupervised models with Scikit-Learn' },
      { step: 4, title: 'Deep Learning & LLMs', detail: 'PyTorch, Gemini API, HuggingFace' },
    ],
  },
  {
    _id: 'c3',
    title: 'UI/UX Product Designer',
    domain: 'Design',
    description: 'Craft intuitive, beautiful user interfaces and user experiences for mobile and web applications.',
    expectedSalaryRange: { min: 75000, max: 135000 },
    demandLevel: 'high',
    educationPath: 'Degree in HCI, Graphic Design, or Self-Taught Portfolio',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    growthOutlook: '18% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Design Principles', detail: 'Typography, Layout, Color Theory' },
      { step: 2, title: 'Figma Mastery', detail: 'Components, Auto-Layout, Interactive Prototypes' },
      { step: 3, title: 'User Research', detail: 'Usability testing, Persona creation, Journey mapping' },
      { step: 4, title: 'Design System Building', detail: 'Creating scalable UI components and tokens' },
    ],
  },
  {
    _id: 'c4',
    title: 'Cloud DevOps & Infrastructure Engineer',
    domain: 'Engineering',
    description: 'Automate deployment pipelines and manage cloud architecture on AWS, Docker, and Kubernetes.',
    expectedSalaryRange: { min: 90000, max: 165000 },
    demandLevel: 'high',
    educationPath: 'Degree in IT, CS, or Cloud Certifications (AWS/Azure)',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines'],
    growthOutlook: '28% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Linux & Scripting', detail: 'Bash, Python, System Administration' },
      { step: 2, title: 'Containerization', detail: 'Docker containers & Docker Compose' },
      { step: 3, title: 'Cloud Platform', detail: 'AWS EC2, S3, IAM, VPC' },
      { step: 4, title: 'Orchestration & IaC', detail: 'Kubernetes, Terraform, GitHub Actions' },
    ],
  },
  {
    _id: 'c5',
    title: 'Product Manager',
    domain: 'Business',
    description: 'Lead cross-functional teams to build, launch, and scale successful tech products.',
    expectedSalaryRange: { min: 90000, max: 170000 },
    demandLevel: 'high',
    educationPath: 'Degree in Business, CS, or Product Management Certification',
    requiredSkills: ['Agile/Scrum', 'Product Strategy', 'Analytics', 'Roadmapping', 'User Stories'],
    growthOutlook: '20% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Product Fundamentals', detail: 'User research, competitive analysis' },
      { step: 2, title: 'Agile Methodologies', detail: 'Scrum, Kanban, Jira, Sprint planning' },
      { step: 3, title: 'Data Analytics', detail: 'Mixpanel, Google Analytics, A/B testing' },
      { step: 4, title: 'Go-to-Market Strategy', detail: 'Product launch, pricing, metrics (ARR/Churn)' },
    ],
  },
  {
    _id: 'c6',
    title: 'Cybersecurity Analyst',
    domain: 'Public Services',
    description: 'Protect organizations against cyber threats, data breaches, and vulnerability exploits.',
    expectedSalaryRange: { min: 80000, max: 145000 },
    demandLevel: 'high',
    educationPath: 'Degree in Cybersecurity, CS, or CompTIA Security+ / CEH',
    requiredSkills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Incident Response', 'Cryptography'],
    growthOutlook: '32% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Networking Fundamentals', detail: 'TCP/IP, OSI Model, Wireshark' },
      { step: 2, title: 'Security Basics', detail: 'CompTIA Security+ concepts & Linux administration' },
      { step: 3, title: 'Threat Detection', detail: 'SIEM tools (Splunk), Firewall configurations' },
      { step: 4, title: 'Ethical Hacking & Auditing', detail: 'Metasploit, Vulnerability Assessment, Pen Testing' },
    ],
  },
  {
    _id: 'c7',
    title: 'Financial Risk Analyst',
    domain: 'Finance',
    description: 'Analyze financial markets, assess investment risks, and guide corporate financial strategies.',
    expectedSalaryRange: { min: 75000, max: 140000 },
    demandLevel: 'medium',
    educationPath: 'Degree in Finance, Economics, or CFA Certification',
    requiredSkills: ['Financial Modeling', 'Excel / VBA', 'Python for Finance', 'Risk Assessment', 'STATSS'],
    growthOutlook: '15% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Financial Accounting', detail: 'Balance sheets, P&L, Cash flow analysis' },
      { step: 2, title: 'Financial Modeling', detail: 'Discounted Cash Flow (DCF), LBO models in Excel' },
      { step: 3, title: 'Quantitative Methods', detail: 'Monte Carlo simulations, Econometrics with Python' },
      { step: 4, title: 'CFA Certification', detail: 'Level 1 & Level 2 CFA exam preparation' },
    ],
  },
  {
    _id: 'c8',
    title: 'Digital Marketing Strategist',
    domain: 'Arts & Humanities',
    description: 'Drive customer acquisition and brand growth through SEO, social media campaigns, and analytics.',
    expectedSalaryRange: { min: 60000, max: 115000 },
    demandLevel: 'medium',
    educationPath: 'Degree in Marketing, Communications, or Digital Marketing Certification',
    requiredSkills: ['SEO/SEM', 'Google Ads', 'Content Strategy', 'Social Media Analytics', 'Copywriting'],
    growthOutlook: '16% growth over next 10 years',
    roadmap: [
      { step: 1, title: 'Marketing Fundamentals', detail: 'Target demographics, brand positioning, funnel' },
      { step: 2, title: 'SEO & Content', detail: 'Keyword research, on-page optimization, blogging' },
      { step: 3, title: 'Paid Advertising', detail: 'Google Ads, Meta Ads Manager, TikTok Ads' },
      { step: 4, title: 'Analytics & Optimization', detail: 'GA4, Conversion Rate Optimization (CRO)' },
    ],
  },
];

export const getCareers = async (req, res, next) => {
  try {
    const { domain, demand, search, sortBy, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (domain && domain !== 'All Categories' && domain !== 'All Industries') {
      filter.domain = { $regex: new RegExp(domain, 'i') };
    }

    if (demand && demand !== 'all') {
      filter.demandLevel = demand.toLowerCase();
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'highestPaying') {
      sortOptions = { 'expectedSalaryRange.max': -1 };
    } else if (sortBy === 'highestDemand') {
      sortOptions = { demandLevel: -1, createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    let careers = [];
    let total = 0;

    try {
      careers = await Career.find(filter).sort(sortOptions).skip(skip).limit(Number(limit));
      total = await Career.countDocuments(filter);
    } catch (e) {
      console.warn('[Careers DB Notice] Using fallback static dataset:', e.message);
    }

    // Fallback if DB is empty or failed
    if (!careers || careers.length === 0) {
      let filtered = [...DEFAULT_CAREERS];
      if (domain && domain !== 'All Categories' && domain !== 'All Industries') {
        filtered = filtered.filter((c) => c.domain.toLowerCase().includes(domain.toLowerCase()));
      }
      if (demand && demand !== 'all') {
        filtered = filtered.filter((c) => c.demandLevel === demand.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title.toLowerCase().includes(s) ||
            c.description.toLowerCase().includes(s) ||
            c.requiredSkills.some((sk) => sk.toLowerCase().includes(s))
        );
      }
      careers = filtered;
      total = filtered.length;
    }

    res.json({
      success: true,
      careers,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (error) {
    next(error);
  }
};

export const getCareerById = async (req, res, next) => {
  try {
    let career = null;
    try {
      career = await Career.findById(req.params.id);
    } catch (e) {}

    if (!career) {
      career = DEFAULT_CAREERS.find((c) => c._id === req.params.id) || DEFAULT_CAREERS[0];
    }

    res.json({ success: true, career });
  } catch (error) {
    next(error);
  }
};

export const getTrendingCareers = async (req, res, next) => {
  try {
    let trending = [];
    try {
      trending = await Career.find({ demandLevel: 'high' }).sort({ 'expectedSalaryRange.max': -1 }).limit(6);
    } catch (e) {}

    if (!trending || trending.length === 0) {
      trending = DEFAULT_CAREERS.filter((c) => c.demandLevel === 'high');
    }

    res.json({ success: true, careers: trending });
  } catch (error) {
    next(error);
  }
};

export const getAiCareerAdvisor = async (req, res, next) => {
  try {
    const { query, userRole = 'Student' } = req.body;
    let dbCareers = [];
    try {
      dbCareers = await Career.find().select('title domain expectedSalaryRange demandLevel requiredSkills').limit(10);
    } catch (e) {}

    if (!dbCareers || dbCareers.length === 0) {
      dbCareers = DEFAULT_CAREERS;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        source: 'fallback',
        dbCareers,
        advice: 'Based on current tech & business trends, Software Engineering, Data Science, and UI/UX Design offer the strongest salary growth and market demand.',
      });
    }

    const dbContext = dbCareers
      .map((c) => `- ${c.title} (${c.domain}): $${c.expectedSalaryRange.min.toLocaleString()}-$${c.expectedSalaryRange.max.toLocaleString()}/yr, Skills: ${c.requiredSkills.join(', ')}`)
      .join('\n');

    const prompt = `You are PathSeeker Gemini AI Career Intelligence Advisor.
The user is a: ${userRole}.
User Question / Goal: "${query || 'What are the highest paying careers and skill roadmaps?'}"

PathSeeker Career Database Context:
${dbContext}

Provide a crisp, inspiring summary advice under 100 words outlining top career matches, required skills, and salary potential.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ['gemini-3.6-flash'];
    let adviceText = '';
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        adviceText = result.response.text().trim();
        if (adviceText) break;
      } catch (e) {}
    }
    if (!adviceText) {
      adviceText = 'Software Engineering, Data Science, and DevOps offer the highest salary growth and job security over the next decade.';
    }

    res.json({
      success: true,
      source: 'live',
      summary: adviceText,
      advice: adviceText,
      dbCareers: dbCareers.slice(0, 3),
    });
  } catch (error) {
    console.error('[Gemini AI Advisor Error]', error.message);
    res.json({
      success: true,
      source: 'fallback',
      advice: 'Software Engineering, Data Science, and DevOps offer the highest salary growth and job security over the next decade.',
      dbCareers: DEFAULT_CAREERS.slice(0, 3),
    });
  }
};

export const createCareer = async (req, res, next) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, career });
  } catch (error) {
    next(error);
  }
};

export const updateCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, career });
  } catch (error) {
    next(error);
  }
};

export const deleteCareer = async (req, res, next) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Career deleted successfully' });
  } catch (error) {
    next(error);
  }
};

