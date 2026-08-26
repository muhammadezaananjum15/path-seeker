import { MultimediaItem } from '../types';

export const mockMultimedia: MultimediaItem[] = [
  {
    id: 'media-ai-foundations-masterclass',
    title: 'The AI Systems Blueprint: From Transformers to Real-Time Agents',
    type: 'Masterclass',
    domain: 'Technology',
    instructor: {
      name: 'Dr. Evelyn Morales',
      role: 'Principal AI Scientist',
      company: 'Neural Frontier Labs',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    },
    durationMinutes: 28,
    durationSeconds: 1680,
    views: 42300,
    rating: 4.95,
    description: 'An executive deep dive into modern foundation model architectures, latency optimization techniques, context window scaling, and agentic workflows in enterprise production.',
    keyTakeaways: [
      'Deconstruct the computational bottlenecks of dense attention vs mixture-of-experts (MoE).',
      'Architect resilient autonomous agent loops with self-reflection and tool execution.',
      'Quantization strategies: INT4, FP8, and AWQ memory efficiency trade-offs.'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    relatedCareerIds: ['car-ai-ml-engineer', 'car-data-scientist', 'car-software-engineer'],
    featured: true,
    transcript: [
      { timestamp: 0, formattedTime: '00:00', speaker: 'Dr. Evelyn Morales', text: 'Welcome to this masterclass on modern AI system architectures. Today we bridge theoretical neural models with production engineering reality.' },
      { timestamp: 45, formattedTime: '00:45', speaker: 'Dr. Evelyn Morales', text: 'When we evaluate generative AI systems at scale, the primary limiting constraint is almost never model parameter size alone—it is memory bandwidth and KV-cache saturation.' },
      { timestamp: 120, formattedTime: '02:00', speaker: 'Dr. Evelyn Morales', text: 'Let us examine the transition from dense transformers to sparse Mixture-of-Experts. By activating only a subset of parameter pathways per token, we achieve 3x throughput without sacrificing perplexity.' },
      { timestamp: 240, formattedTime: '04:00', speaker: 'Dr. Evelyn Morales', text: 'Next, we explore agentic feedback loops: how structured function calling turns a passive LLM into an autonomous reasoning engine.' },
      { timestamp: 420, formattedTime: '07:00', speaker: 'Dr. Evelyn Morales', text: 'To build a competitive career in AI engineering, mastering CUDA kernels, PyTorch distributed training, and vector similarity indexing is paramount.' }
    ]
  },
  {
    id: 'media-ux-design-systems',
    title: 'Editorial Design Systems: Crafting Luxury Digital Aesthetics in Figma',
    type: 'Video',
    domain: 'Design',
    instructor: {
      name: 'Julian Sterling',
      role: 'Head of Brand & Experience',
      company: 'Vogue & Atelier Digital',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    durationMinutes: 22,
    durationSeconds: 1320,
    views: 31200,
    rating: 4.92,
    description: 'Learn how to elevate generic UI components into timeless, luxury editorial digital products using typography scaling, asymmetrical layouts, and micro-interactions.',
    keyTakeaways: [
      'Master the mathematical harmony of serif and sans-serif pairing in luxury interfaces.',
      'Construct scalable Figma token architectures with semantic dark theme variables.',
      'Implement restrained, meaningful motion design that enhances comprehension.'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    relatedCareerIds: ['car-product-designer', 'car-creative-director'],
    featured: true,
    transcript: [
      { timestamp: 0, formattedTime: '00:00', speaker: 'Julian Sterling', text: 'Most digital applications today look identical because they rely on the same generic component kits. In this session, we reclaim editorial craftsmanship.' },
      { timestamp: 60, formattedTime: '01:00', speaker: 'Julian Sterling', text: 'Notice how intentional whitespace and dramatic typographic scale create an immediate sense of prestige and calm authority.' },
      { timestamp: 180, formattedTime: '03:00', speaker: 'Julian Sterling', text: 'We will construct our color token tokens in Figma: void blacks, deep indigos, and soft violet accents with zero generic neon gradients.' },
      { timestamp: 350, formattedTime: '05:50', speaker: 'Julian Sterling', text: 'Perforated borders and stamp seals introduce tactile physical metaphors without turning the platform into a retro novelty.' }
    ]
  },
  {
    id: 'media-product-leadership-podcast',
    title: 'The Product Strategist: From Day One APM to Chief Product Officer',
    type: 'Podcast',
    domain: 'Business',
    instructor: {
      name: 'Sofia Al-Mansoor',
      role: 'Chief Product Officer',
      company: 'HyperScale Global',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
    },
    durationMinutes: 34,
    durationSeconds: 2040,
    views: 24800,
    rating: 4.88,
    description: 'A candid conversation on navigating high-stakes product prioritization, saying no to executive pet projects, and scaling multi-squad product organizations.',
    keyTakeaways: [
      'Why the best product managers focus on outcome metrics rather than feature velocity.',
      'How to build an unshakeable narrative that aligns engineering, design, and sales.',
      'Navigating career transitions from individual contributor to executive leadership.'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    relatedCareerIds: ['car-product-manager', 'car-management-consultant'],
    featured: false,
    transcript: [
      { timestamp: 0, formattedTime: '00:00', speaker: 'Sofia Al-Mansoor', text: 'The biggest misconception in product management is that your job is to come up with ideas. Your true job is to create clarity amidst chaos.' },
      { timestamp: 90, formattedTime: '01:30', speaker: 'Sofia Al-Mansoor', text: 'Every roadmap item should directly answer: what user behavior are we altering, and why does that expand our commercial moat?' },
      { timestamp: 210, formattedTime: '03:30', speaker: 'Sofia Al-Mansoor', text: 'When speaking with engineers, speak in terms of architecture constraints and user latency. When speaking to the board, speak in unit economics and retention cohorts.' }
    ]
  },
  {
    id: 'media-cybersecurity-red-team',
    title: 'Day in the Life: Elite Red Team Cyber Threat Simulation',
    type: 'Explainer',
    domain: 'Technology',
    instructor: {
      name: 'Marcus Sterling',
      role: 'Staff Infrastructure Architect',
      company: 'ScaleGrid Systems',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    durationMinutes: 18,
    durationSeconds: 1080,
    views: 19500,
    rating: 4.91,
    description: 'Go behind the scenes of an adversarial red-team penetration test against a mock banking cloud infrastructure and learn critical defensive responses.',
    keyTakeaways: [
      'Real-world zero-day discovery and payload staging techniques.',
      'How modern SIEM platforms isolate anomalous lateral movement.',
      'Core certifications that unlock six-figure offensive security careers.'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    relatedCareerIds: ['car-cybersecurity-analyst', 'car-cloud-architect'],
    featured: false,
    transcript: [
      { timestamp: 0, formattedTime: '00:00', speaker: 'Marcus Sterling', text: 'Today we are executing an authorized red-team breach simulation to stress-test Zero Trust identity federation.' },
      { timestamp: 60, formattedTime: '01:00', speaker: 'Marcus Sterling', text: 'We begin with passive reconnaissance, inspecting exposed endpoints, SSL certificates, and misconfigured S3 buckets.' },
      { timestamp: 150, formattedTime: '02:30', speaker: 'Marcus Sterling', text: 'Once an initial foothold is achieved, the defensive blue team has an average window of 8 minutes to detect and revoke token credentials.' }
    ]
  },
  {
    id: 'media-robotics-mechatronics',
    title: 'Autonomous Robotics: Building Humanoid Locomotion in ROS 2',
    type: 'Masterclass',
    domain: 'Engineering',
    instructor: {
      name: 'Dr. Kenji Takahashi',
      role: 'Lead Robotics Fellow',
      company: 'Apex Dynamics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    durationMinutes: 26,
    durationSeconds: 1560,
    views: 18400,
    rating: 4.89,
    description: 'Understand the mathematical foundations of inverse kinematics, real-time torque actuation, and reinforcement learning for bipedal robot stability.',
    keyTakeaways: [
      'Zero-moment point (ZMP) calculations for dynamic balance.',
      'Integrating LiDAR and depth cameras with ROS 2 navigation stacks.',
      'Sim-to-real transfer: Training locomotion policies in Isaac Gym.'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    relatedCareerIds: ['car-robotics-engineer', 'car-ai-ml-engineer'],
    featured: true,
    transcript: [
      { timestamp: 0, formattedTime: '00:00', speaker: 'Dr. Kenji Takahashi', text: 'Humanoid robotics has reached an inflection point where reinforcement learning in simulation transfers directly into physical metal actuators.' },
      { timestamp: 90, formattedTime: '01:30', speaker: 'Dr. Kenji Takahashi', text: 'We will inspect joint trajectory controllers and how micro-second latency deterministic loops maintain center-of-mass balance.' }
    ]
  },
  {
    id: 'media-biotech-genomics',
    title: 'Genomic Frontiers: CRISPR Precision & Computational Biology',
    type: 'Masterclass',
    domain: 'Healthcare',
    instructor: {
      name: 'Dr. Amara Thorne',
      role: 'Director of Molecular Therapeutics',
      company: 'GeneCraft Bio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    durationMinutes: 24,
    durationSeconds: 1440,
    views: 15200,
    rating: 4.93,
    description: 'Explore how base editing, computational protein folding, and mRNA delivery are revolutionizing therapeutics for previously incurable genetic conditions.',
    keyTakeaways: [
      'Prime editing versus classical double-strand break CRISPR.',
      'Using AlphaFold and ESM models for de novo antibody design.',
      'The regulatory roadmap for FDA Phase 1/2 clinical approval.'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    relatedCareerIds: ['car-biomedical-scientist', 'car-data-scientist'],
    featured: false,
    transcript: [
      { timestamp: 0, formattedTime: '00:00', speaker: 'Dr. Amara Thorne', text: 'Biology is fundamentally an informational science. In this masterclass, we explore how software algorithms and molecular biology are converging.' }
    ]
  }
];
