import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'usr-student-01',
    name: 'Ezaan Vance',
    email: 'ezaan.vance@pathseeker.io',
    role: 'Student',
    passportId: 'PS-2048',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Computer Science undergraduate exploring AI systems, product design, and quantitative analysis.',
    location: 'San Francisco, CA',
    education: [
      {
        institution: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science & Human-Computer Interaction',
        year: '2023 - 2027'
      }
    ],
    skills: [
      { name: 'Python', level: 'Intermediate', category: 'Technical' },
      { name: 'TypeScript', level: 'Intermediate', category: 'Technical' },
      { name: 'Figma', level: 'Advanced', category: 'Technical' },
      { name: 'Critical Thinking', level: 'Advanced', category: 'Soft' },
      { name: 'Data Visualization', level: 'Intermediate', category: 'Domain' }
    ],
    interests: ['Artificial Intelligence', 'Product Architecture', 'Creative Coding', 'Fintech', 'Autonomous Systems'],
    workExperience: [
      {
        title: 'Software Engineering Intern',
        company: 'Apex Labs',
        duration: 'Jun 2025 - Aug 2025',
        description: 'Developed internal telemetry tools and interactive dashboard components using React and Python.'
      }
    ],
    careerPreferences: {
      targetIndustries: ['Technology', 'Design', 'Finance'],
      workStyle: 'Hybrid',
      expectedSalary: 115000,
      preferredRoles: ['AI / ML Engineer', 'Product Designer', 'Data Scientist']
    },
    resumeFileName: 'Ezaan_Vance_Resume_2026.pdf',
    resumeFileSize: '1.4 MB',
    passportScore: 68,
    unlockedStamps: ['STAMP-FIRST-STEPS', 'STAMP-QUIZ-PIONEER', 'STAMP-TECH-EXPLORER'],
    createdAt: '2026-01-15'
  },
  {
    id: 'usr-grad-02',
    name: 'Ayla Chen',
    email: 'ayla.chen@pathseeker.io',
    role: 'Graduate',
    passportId: 'PS-1092',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'Recent Business Analytics & Economics graduate seeking high-growth Product Management and Strategy opportunities.',
    location: 'New York, NY',
    education: [
      {
        institution: 'Columbia University',
        degree: 'Master of Science',
        field: 'Business Analytics & Decision Sciences',
        year: '2024 - 2026'
      }
    ],
    skills: [
      { name: 'SQL & Database Design', level: 'Advanced', category: 'Technical' },
      { name: 'Product Strategy', level: 'Intermediate', category: 'Domain' },
      { name: 'Financial Modeling', level: 'Advanced', category: 'Domain' },
      { name: 'Stakeholder Management', level: 'Advanced', category: 'Soft' }
    ],
    interests: ['Product Growth', 'Fintech Innovations', 'SaaS Business Models', 'Data-Driven Strategy'],
    workExperience: [
      {
        title: 'Strategy Analyst Intern',
        company: 'Vanguard Global',
        duration: 'Jan 2025 - May 2025',
        description: 'Analyzed competitive SaaS metrics and created executive recommendation models.'
      }
    ],
    careerPreferences: {
      targetIndustries: ['Business', 'Technology', 'Finance'],
      workStyle: 'Flexible',
      expectedSalary: 125000,
      preferredRoles: ['Product Manager', 'Management Consultant', 'Business Analyst']
    },
    resumeFileName: 'Ayla_Chen_Executive_CV.pdf',
    resumeFileSize: '2.1 MB',
    passportScore: 84,
    unlockedStamps: ['STAMP-FIRST-STEPS', 'STAMP-QUIZ-PIONEER', 'STAMP-STRATEGIST', 'STAMP-CAREER-VERIFIED'],
    createdAt: '2025-11-20'
  },
  {
    id: 'usr-pro-03',
    name: 'Marcus Sterling',
    email: 'marcus.sterling@pathseeker.io',
    role: 'Professional',
    passportId: 'PS-5541',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior Systems Architect with 7+ years of distributed backend systems experience transitioning toward Cloud AI Infrastructure leadership.',
    location: 'Austin, TX',
    education: [
      {
        institution: 'University of Texas at Austin',
        degree: 'B.S. Computer Engineering',
        field: 'Computer Systems Architecture',
        year: '2015 - 2019'
      }
    ],
    skills: [
      { name: 'Distributed Systems', level: 'Expert', category: 'Technical' },
      { name: 'Kubernetes & Cloud Arch', level: 'Expert', category: 'Technical' },
      { name: 'Engineering Leadership', level: 'Advanced', category: 'Soft' },
      { name: 'Go / Rust', level: 'Expert', category: 'Technical' }
    ],
    interests: ['Autonomous Cloud Infrastructure', 'AI Scaling', 'High-Performance Computing'],
    workExperience: [
      {
        title: 'Senior Infrastructure Engineer',
        company: 'ScaleGrid Systems',
        duration: '2021 - Present',
        description: 'Architected multi-region Kubernetes clusters handling 40M daily API transactions.'
      }
    ],
    careerPreferences: {
      targetIndustries: ['Technology', 'Engineering'],
      workStyle: 'Remote',
      expectedSalary: 185000,
      preferredRoles: ['Cloud Architect', 'DevOps Director', 'Staff Infrastructure Engineer']
    },
    resumeFileName: 'Marcus_Sterling_Staff_Architect_Resume.pdf',
    resumeFileSize: '1.8 MB',
    passportScore: 92,
    unlockedStamps: ['STAMP-FIRST-STEPS', 'STAMP-QUIZ-PIONEER', 'STAMP-TECH-EXPLORER', 'STAMP-STRATEGIST', 'STAMP-MASTER-ACHIEVER', 'STAMP-CAREER-VERIFIED'],
    createdAt: '2025-08-10'
  },
  {
    id: 'usr-admin-00',
    name: 'Eleanor Vance (Admin)',
    email: 'admin@pathseeker.io',
    role: 'Admin',
    passportId: 'PS-ADMIN-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Platform Administrator & Chief Career Architect at PathSeeker.',
    location: 'London, UK',
    education: [
      {
        institution: 'Oxford University',
        degree: 'Ph.D. Organizational Psychology & Cognitive Science',
        field: 'Human Potential & Talent Mapping',
        year: '2012 - 2016'
      }
    ],
    skills: [
      { name: 'Platform Governance', level: 'Expert', category: 'Technical' },
      { name: 'Curriculum Design', level: 'Expert', category: 'Domain' },
      { name: 'Data Intelligence', level: 'Expert', category: 'Technical' }
    ],
    interests: ['Future of Work', 'Talent Economics', 'Psychometrics'],
    workExperience: [
      {
        title: 'Chief Talent Strategist',
        company: 'PathSeeker Institute',
        duration: '2022 - Present',
        description: 'Curating worldwide career frameworks and overseeing the career recommendation graph.'
      }
    ],
    careerPreferences: {
      targetIndustries: ['Education', 'Technology'],
      workStyle: 'Flexible',
      expectedSalary: 210000,
      preferredRoles: ['Chief Product Officer', 'Director of Career Intelligence']
    },
    passportScore: 100,
    unlockedStamps: ['STAMP-FIRST-STEPS', 'STAMP-QUIZ-PIONEER', 'STAMP-TECH-EXPLORER', 'STAMP-STRATEGIST', 'STAMP-MASTER-ACHIEVER', 'STAMP-CAREER-VERIFIED', 'STAMP-PLATFORM-ARCHITECT'],
    createdAt: '2024-01-01'
  }
];

export const mockPassportStamps = [
  {
    id: 'STAMP-FIRST-STEPS',
    title: 'Passport Issued',
    category: 'Identity',
    icon: 'Compass',
    description: 'Activated your digital career passport identity and profile parameters.',
    dateUnlocked: '2026-01-15'
  },
  {
    id: 'STAMP-QUIZ-PIONEER',
    title: 'Cognitive Baseline',
    category: 'Assessment',
    icon: 'Target',
    description: 'Completed the 15-question comprehensive interest & aptitude assessment.',
    dateUnlocked: '2026-01-18'
  },
  {
    id: 'STAMP-TECH-EXPLORER',
    title: 'Domain Explorer',
    category: 'Discovery',
    icon: 'Layers',
    description: 'Explored 10+ distinct career trajectories across global industry banks.',
    dateUnlocked: '2026-02-02'
  },
  {
    id: 'STAMP-STRATEGIST',
    title: 'Career Strategist',
    category: 'Roadmap',
    icon: 'MapPin',
    description: 'Compared 3 career paths and drafted a custom 5-year progression trajectory.',
    dateUnlocked: '2026-02-14'
  },
  {
    id: 'STAMP-MASTER-ACHIEVER',
    title: 'Masterclass Scholar',
    category: 'Knowledge',
    icon: 'Award',
    description: 'Completed 5 expert video masterclasses and downloaded curated playbooks.',
    dateUnlocked: '2026-02-20'
  },
  {
    id: 'STAMP-CAREER-VERIFIED',
    title: 'Passport Verified',
    category: 'Milestone',
    icon: 'CheckCircle2',
    description: 'Achieved over 80% career clarity score with verified resume metrics.',
    dateUnlocked: '2026-02-24'
  },
  {
    id: 'STAMP-PLATFORM-ARCHITECT',
    title: 'System Architect',
    category: 'Admin',
    icon: 'ShieldCheck',
    description: 'Granted full administrative credentials over the career discovery engine.',
    dateUnlocked: '2024-01-01'
  }
];
