export type UserRole = 'Student' | 'Graduate' | 'Professional' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passportId: string;
  avatar: string;
  bio: string;
  location: string;
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }[];
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: 'Technical' | 'Soft' | 'Domain';
  }[];
  interests: string[];
  workExperience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  careerPreferences: {
    targetIndustries: string[];
    workStyle: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
    expectedSalary: number;
    preferredRoles: string[];
  };
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  passportScore: number;
  unlockedStamps: string[];
  status?: 'Active' | 'Suspended';
  createdAt: string;
}

export type CareerDomain =
  | 'Technology'
  | 'Design'
  | 'Business'
  | 'Healthcare'
  | 'Engineering'
  | 'Finance'
  | 'Science'
  | 'Arts & Humanities'
  | 'Public Services';

export type DemandLevel = 'Very High' | 'High' | 'Moderate' | 'Steady';

export interface CareerPathStage {
  stage: 'Beginner' | 'Junior' | 'Mid-Level' | 'Senior' | 'Specialist / Lead';
  title: string;
  duration: string;
  expectedSalary: number;
  description: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  domain: CareerDomain;
  shortDescription: string;
  overview: string;
  averageSalary: number;
  salaryRange: {
    entry: number;
    mid: number;
    senior: number;
    lead: number;
  };
  demandLevel: DemandLevel;
  growthRate: string;
  matchScore: number;
  requiredSkills: string[];
  tools: string[];
  educationLevel: string;
  experienceLevel: string;
  dailyTasks: string[];
  riasecAffinity: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  careerPath: CareerPathStage[];
  certifications: string[];
  relatedCareerIds: string[];
  featured?: boolean;
  colorAccent?: string;
}

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  riasecWeights: {
    realistic?: number;
    investigative?: number;
    artistic?: number;
    social?: number;
    enterprising?: number;
    conventional?: number;
  };
}

export interface QuizQuestion {
  id: string;
  text: string;
  subtitle?: string;
  dimension: 'Interests' | 'Skills' | 'Workstyle' | 'Values' | 'Preferences';
  type: 'choice' | 'likert' | 'slider' | 'visual';
  options?: QuizOption[];
  minLabel?: string;
  maxLabel?: string;
  riasecDimension?: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
}

export interface QuizResult {
  id: string;
  overallScore: number;
  date: string;
  riasecScores: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  topDomains: CareerDomain[];
  recommendedCareerIds: string[];
  strengthSummary: string[];
  improvementAreas: string[];
}

export interface TranscriptItem {
  timestamp: number;
  formattedTime: string;
  speaker: string;
  text: string;
}

export interface MultimediaItem {
  id: string;
  title: string;
  type: 'Video' | 'Masterclass' | 'Podcast' | 'Explainer';
  domain: CareerDomain;
  instructor: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  durationMinutes: number;
  durationSeconds: number;
  views: number;
  rating: number;
  description: string;
  keyTakeaways: string[];
  videoUrl: string;
  thumbnailUrl: string;
  relatedCareerIds: string[];
  transcript: TranscriptItem[];
  featured?: boolean;
}

export interface StoryTimelineStage {
  stage: 'Education' | 'The Challenge' | 'The Turning Point' | 'Skills Acquired' | 'The Breakthrough' | 'Long-term Impact';
  title: string;
  period: string;
  description: string;
  keyLesson: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  candidateName: string;
  roleFrom: string;
  roleTo: string;
  currentCompany: string;
  avatar: string;
  domain: CareerDomain;
  readTimeMinutes: number;
  summary: string;
  quote: string;
  timeline: StoryTimelineStage[];
  skillsLearned: string[];
  outcome: string;
  relatedCareerId: string;
  featured?: boolean;
  status: 'published' | 'pending' | 'rejected';
}

export interface Resource {
  id: string;
  title: string;
  type: 'Guide' | 'E-Book' | 'CheatSheet' | 'Template' | 'Roadmap' | 'Tool';
  domain: CareerDomain;
  fileSize: string;
  fileFormat: string;
  downloadCount: number;
  description: string;
  author: string;
  tags: string[];
  downloadUrl: string;
  featured?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'milestone' | 'recommendation' | 'system' | 'quiz' | 'resource';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'Feature Request' | 'Bug Report' | 'Content Suggestion' | 'General';
  rating: number;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'In Review' | 'Resolved';
  adminReply?: string;
}

export interface CareerNote {
  careerId: string;
  careerTitle: string;
  noteText: string;
  updatedAt: string;
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
