import { QuizQuestion } from '../types';

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'When faced with an open-ended project, which activity energizes you most?',
    subtitle: 'Dimension 1 of 5: Primary Intellectual Interests',
    dimension: 'Interests',
    type: 'visual',
    options: [
      {
        id: 'q1-opt1',
        label: 'Designing Systems & Writing Code',
        description: 'Building software architectures, algorithms, or digital infrastructure.',
        icon: 'Code2',
        riasecWeights: { realistic: 3, investigative: 4, conventional: 2 }
      },
      {
        id: 'q1-opt2',
        label: 'Visualizing Interfaces & Crafting Aesthetics',
        description: 'Creating typography, user interfaces, branding, or 3D animations.',
        icon: 'Palette',
        riasecWeights: { artistic: 5, investigative: 1, social: 2 }
      },
      {
        id: 'q1-opt3',
        label: 'Analyzing Trends & Commercial Strategy',
        description: 'Evaluating financial markets, product economics, or growth funnels.',
        icon: 'TrendingUp',
        riasecWeights: { enterprising: 5, conventional: 3, investigative: 2 }
      },
      {
        id: 'q1-opt4',
        label: 'Scientific Research & Hypothesis Testing',
        description: 'Digging into laboratory data, genetics, climate tech, or physics.',
        icon: 'FlaskConical',
        riasecWeights: { investigative: 5, realistic: 3, conventional: 2 }
      }
    ]
  },
  {
    id: 'q2',
    text: 'How strongly do you enjoy dissecting complex quantitative datasets to discover hidden insights?',
    subtitle: 'Dimension 1 of 5: Analytical Aptitude',
    dimension: 'Interests',
    type: 'likert',
    riasecDimension: 'investigative',
    minLabel: 'Strongly Dislike',
    maxLabel: 'Strongly Enjoy'
  },
  {
    id: 'q3',
    text: 'Which problem-solving environment do you find most appealing?',
    subtitle: 'Dimension 2 of 5: Technical vs Creative Orientation',
    dimension: 'Skills',
    type: 'choice',
    options: [
      {
        id: 'q3-opt1',
        label: 'Algorithmic & Mathematical Modeling',
        description: 'Working with pure logic, neural models, calculus, and scalable backend pipelines.',
        riasecWeights: { investigative: 4, realistic: 3 }
      },
      {
        id: 'q3-opt2',
        label: 'Human-Centered Empathy & UX Strategy',
        description: 'Translating human psychology and aesthetic principles into intuitive digital tools.',
        riasecWeights: { artistic: 4, social: 4 }
      },
      {
        id: 'q3-opt3',
        label: 'Executive Leadership & Negotiation',
        description: 'Pitching vision to high-stakes stakeholders, raising capital, and managing squads.',
        riasecWeights: { enterprising: 5, social: 3 }
      },
      {
        id: 'q3-opt4',
        label: 'Physical Hardware & Robotics Engineering',
        description: 'Soldering circuits, assembling sensors, and programming physical actuators.',
        riasecWeights: { realistic: 5, investigative: 3 }
      }
    ]
  },
  {
    id: 'q4',
    text: 'Rate your comfort level with making critical decisions under uncertain or incomplete information.',
    subtitle: 'Dimension 2 of 5: Risk Tolerance & Leadership',
    dimension: 'Skills',
    type: 'slider',
    riasecDimension: 'enterprising',
    minLabel: 'Prefer Absolute Certainty & Rules',
    maxLabel: 'Thrive In High-Stakes Ambiguity'
  },
  {
    id: 'q5',
    text: 'What style of daily collaboration brings out your highest productivity?',
    subtitle: 'Dimension 3 of 5: Work Style & Dynamics',
    dimension: 'Workstyle',
    type: 'choice',
    options: [
      {
        id: 'q5-opt1',
        label: 'Deep Solo Focus & Autonomous Craft',
        description: 'Uninterrupted time blocks solving deep technical or creative challenges.',
        riasecWeights: { investigative: 3, artistic: 3, realistic: 2 }
      },
      {
        id: 'q5-opt2',
        label: 'Dynamic Cross-Functional Pods',
        description: 'Constant brainstorming and fast iterations with designers, engineers, and PMs.',
        riasecWeights: { enterprising: 3, social: 4 }
      },
      {
        id: 'q5-opt3',
        label: 'Mentoring, Teaching, & Coaching Others',
        description: 'Helping teammates grow, leading workshops, and public advocacy.',
        riasecWeights: { social: 5, enterprising: 2 }
      },
      {
        id: 'q5-opt4',
        label: 'Structured Governance & Operational Excellence',
        description: 'Establishing airtight processes, compliance checklists, and systematic workflows.',
        riasecWeights: { conventional: 5, realistic: 2 }
      }
    ]
  },
  {
    id: 'q6',
    text: 'How important is creative visual expression and aesthetic autonomy in your ideal profession?',
    subtitle: 'Dimension 3 of 5: Artistic Freedom',
    dimension: 'Workstyle',
    type: 'likert',
    riasecDimension: 'artistic',
    minLabel: 'Not Important At All',
    maxLabel: 'Essential To My Happiness'
  },
  {
    id: 'q7',
    text: 'Which primary value guides your long-term career ambition?',
    subtitle: 'Dimension 4 of 5: Core Motivations & Ethics',
    dimension: 'Values',
    type: 'visual',
    options: [
      {
        id: 'q7-opt1',
        label: 'Technological Mastery & Innovation',
        description: 'Pushing the frontier of artificial intelligence, computing, or engineering.',
        icon: 'Cpu',
        riasecWeights: { investigative: 4, realistic: 3 }
      },
      {
        id: 'q7-opt2',
        label: 'Societal Impact & Human Well-being',
        description: 'Improving public health, sustainability, education, or climate resilience.',
        icon: 'HeartHandshake',
        riasecWeights: { social: 5, investigative: 2 }
      },
      {
        id: 'q7-opt3',
        label: 'Commercial Influence & Financial Freedom',
        description: 'Building high-valuation enterprises, venture capital, and market dominance.',
        icon: 'Briefcase',
        riasecWeights: { enterprising: 5, conventional: 2 }
      },
      {
        id: 'q7-opt4',
        label: 'Elegance, Craft, & Cultural Legacy',
        description: 'Authoring memorable creative works, iconic brands, and timeless designs.',
        icon: 'Sparkles',
        riasecWeights: { artistic: 5, social: 1 }
      }
    ]
  },
  {
    id: 'q8',
    text: 'Rate your affinity for systematic routines, precision auditing, and structured organizational hierarchy.',
    subtitle: 'Dimension 4 of 5: Structure & Process',
    dimension: 'Values',
    type: 'slider',
    riasecDimension: 'conventional',
    minLabel: 'Prefer Chaotic Freedom',
    maxLabel: 'Prefer Rigorous Structure & Clarity'
  },
  {
    id: 'q9',
    text: 'When learning a new tool or technology, what is your preferred approach?',
    subtitle: 'Dimension 2 of 5: Cognitive Learning Pattern',
    dimension: 'Skills',
    type: 'choice',
    options: [
      {
        id: 'q9-opt1',
        label: 'Reading foundational theory, math proofs, and whitepapers',
        description: 'Understanding internal mechanics and first principles thoroughly.',
        riasecWeights: { investigative: 5 }
      },
      {
        id: 'q9-opt2',
        label: 'Diving in hands-on, hacking prototypes, and breaking things',
        description: 'Learning by building interactive experiments and tinkering directly.',
        riasecWeights: { realistic: 4, artistic: 2 }
      },
      {
        id: 'q9-opt3',
        label: 'Watching expert video walkthroughs and case studies',
        description: 'Learning through synthesized examples, best practices, and expert masterclasses.',
        riasecWeights: { social: 3, conventional: 3 }
      },
      {
        id: 'q9-opt4',
        label: 'Deconstructing business ROI and industry benchmarks',
        description: 'Evaluating tool adoption based on productivity velocity and commercial gain.',
        riasecWeights: { enterprising: 4, conventional: 3 }
      }
    ]
  },
  {
    id: 'q10',
    text: 'How enthusiastic are you about directly writing software code, scripts, or formulas?',
    subtitle: 'Dimension 1 of 5: Computational Enthusiasm',
    dimension: 'Interests',
    type: 'likert',
    riasecDimension: 'realistic',
    minLabel: 'Prefer Zero Coding',
    maxLabel: 'Love Daily Coding & Scripting'
  },
  {
    id: 'q11',
    text: 'Which type of career milestone would make you feel most accomplished in 5 years?',
    subtitle: 'Dimension 5 of 5: Future Trajectory Goals',
    dimension: 'Preferences',
    type: 'visual',
    options: [
      {
        id: 'q11-opt1',
        label: 'Shipped a Transformative AI or Software System',
        description: 'Engineered a system used reliably by millions of global users.',
        icon: 'Terminal',
        riasecWeights: { realistic: 3, investigative: 4 }
      },
      {
        id: 'q11-opt2',
        label: 'Founded or Scaled a Profitable Venture',
        description: 'Led a venture-backed startup or high-growth business unit.',
        icon: 'Rocket',
        riasecWeights: { enterprising: 5, social: 2 }
      },
      {
        id: 'q11-opt3',
        label: 'Published Breakthrough Research or Climate Solution',
        description: 'Authored patents or developed life-saving clinical therapeutics.',
        icon: 'Microscope',
        riasecWeights: { investigative: 5, realistic: 2 }
      },
      {
        id: 'q11-opt4',
        label: 'Created an Award-Winning Design Portfolio',
        description: 'Recognized for pioneering digital experiences and aesthetic excellence.',
        icon: 'Award',
        riasecWeights: { artistic: 5, social: 2 }
      }
    ]
  },
  {
    id: 'q12',
    text: 'What balance of workplace location fits your ideal lifestyle?',
    subtitle: 'Dimension 5 of 5: Physical Presence Preference',
    dimension: 'Preferences',
    type: 'choice',
    options: [
      {
        id: 'q12-opt1',
        label: '100% Fully Remote & Digital Nomad Flexibility',
        description: 'Complete freedom to work from any global timezone or home sanctuary.',
        riasecWeights: { investigative: 2, artistic: 2 }
      },
      {
        id: 'q12-opt2',
        label: 'Hybrid: 2-3 Days in a Collaborative Design Studio / Tech Hub',
        description: 'Blending high-energy in-person whiteboard synergy with quiet home deep work.',
        riasecWeights: { enterprising: 3, social: 3 }
      },
      {
        id: 'q12-opt3',
        label: 'High-Tech On-Site Laboratory, Workshop, or Cleanroom',
        description: 'Direct access to physical robotics testing rigs, gene sequencers, or hardware.',
        riasecWeights: { realistic: 4, investigative: 3 }
      },
      {
        id: 'q12-opt4',
        label: 'Global Travel & On-Site Client Boardroom Engagements',
        description: 'Regular cross-continental advisory trips and executive client summits.',
        riasecWeights: { enterprising: 4, social: 3 }
      }
    ]
  },
  {
    id: 'q13',
    text: 'How energizing do you find public speaking, keynote presentations, and executive pitching?',
    subtitle: 'Dimension 3 of 5: Public Presence & Persuasion',
    dimension: 'Skills',
    type: 'likert',
    riasecDimension: 'social',
    minLabel: 'Extremely Draining',
    maxLabel: 'Thrilling & Natural'
  },
  {
    id: 'q14',
    text: 'Rate your preference for working on long-term 3-to-5 year deep science horizons vs fast 2-week agile sprints.',
    subtitle: 'Dimension 4 of 5: Project Time Horizons',
    dimension: 'Workstyle',
    type: 'slider',
    riasecDimension: 'investigative',
    minLabel: 'Fast 2-Week Agile Iterations',
    maxLabel: 'Deep Multi-Year Fundamental R&D'
  },
  {
    id: 'q15',
    text: 'Select your preferred starting compensation and wealth accumulation trajectory:',
    subtitle: 'Dimension 5 of 5: Financial Ambition & Equity Preferences',
    dimension: 'Preferences',
    type: 'choice',
    options: [
      {
        id: 'q15-opt1',
        label: 'High Base Salary + Predictable Corporate Stability ($140k - $220k+)',
        description: 'Consistent cash flow, 401(k) matching, and world-class health benefits.',
        riasecWeights: { conventional: 4, realistic: 2 }
      },
      {
        id: 'q15-opt2',
        label: 'High Equity Upside + Startup Stock Options with Asymmetric Growth',
        description: 'Willing to take calculated salary trade-offs for early equity ownership.',
        riasecWeights: { enterprising: 5, artistic: 1 }
      },
      {
        id: 'q15-opt3',
        label: 'Grant Funding, Research Freedom, & Intellectual Autonomy',
        description: 'Focus on scientific breakthrough impact, patents, and academic prestige.',
        riasecWeights: { investigative: 5 }
      },
      {
        id: 'q15-opt4',
        label: 'Creative Royalties, Independent Studio, & Licensing Freedom',
        description: 'Retaining intellectual property rights and building a personal creative brand.',
        riasecWeights: { artistic: 5, enterprising: 2 }
      }
    ]
  }
];
