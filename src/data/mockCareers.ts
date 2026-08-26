import { Career } from '../types';

export const mockCareers: Career[] = [
  {
    id: 'car-ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    slug: 'ai-ml-engineer',
    domain: 'Technology',
    shortDescription: 'Architect, train, and deploy generative AI, computer vision, and neural models for autonomous systems.',
    overview: 'AI / ML Engineers research, design, and implement sophisticated artificial intelligence algorithms and large language model architectures. They transform massive datasets into intelligent predictive pipelines and production software systems.',
    averageSalary: 168000,
    salaryRange: {
      entry: 105000,
      mid: 155000,
      senior: 215000,
      lead: 285000
    },
    demandLevel: 'Very High',
    growthRate: '+34% (Next 5 Years)',
    matchScore: 96,
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'Transformer Architectures', 'MLOps & CI/CD', 'Mathematical Statistics', 'Vector Databases'],
    tools: ['PyTorch', 'Hugging Face', 'Weights & Biases', 'Docker', 'Kubernetes', 'CUDA', 'Pinecone'],
    educationLevel: "Bachelor's or Master's in Computer Science, Data Science, or Mathematics",
    experienceLevel: '1 - 4 Years for Mid-Level',
    dailyTasks: [
      'Design, fine-tune, and evaluate deep neural networks and multimodal models.',
      'Build scalable distributed training infrastructure using GPU clusters.',
      'Optimize model latency for real-time inference using quantization and ONNX.',
      'Collaborate with product and domain experts to translate business challenges into quantitative learning objectives.'
    ],
    riasecAffinity: {
      realistic: 40,
      investigative: 95,
      artistic: 45,
      social: 20,
      enterprising: 60,
      conventional: 70
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Data & ML Associate', duration: '0 - 2 yrs', expectedSalary: 98000, description: 'Data preprocessing, feature engineering, and baseline model experimentation.' },
      { stage: 'Junior', title: 'Machine Learning Engineer I', duration: '2 - 3 yrs', expectedSalary: 135000, description: 'Fine-tuning transformers, building reproducible data pipelines, and MLOps deployment.' },
      { stage: 'Mid-Level', title: 'Senior ML Systems Engineer', duration: '3 - 6 yrs', expectedSalary: 185000, description: 'Leading architectural design for foundation models, latency reduction, and cluster scaling.' },
      { stage: 'Senior', title: 'Staff AI Architect', duration: '6 - 9 yrs', expectedSalary: 245000, description: 'Setting cross-enterprise AI strategy, safety guardrails, and proprietary model breakthroughs.' },
      { stage: 'Specialist / Lead', title: 'Chief AI Scientist / VP AI', duration: '10+ yrs', expectedSalary: 320000, description: 'Executive research leadership, intellectual property creation, and transformative AI vision.' }
    ],
    certifications: ['AWS Certified Machine Learning Specialist', 'TensorFlow Developer Certificate', 'Google Professional ML Engineer'],
    relatedCareerIds: ['car-data-scientist', 'car-cloud-architect', 'car-software-engineer'],
    featured: true,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-product-designer',
    title: 'Product & UX/UI Designer',
    slug: 'product-designer',
    domain: 'Design',
    shortDescription: 'Craft intuitive, aesthetically captivating digital experiences through user research and design systems.',
    overview: 'Product Designers bridge human psychology, visual elegance, and commercial strategy to build seamless digital interfaces across web, mobile, and spatial platforms. They conduct user research, create design systems, and prototype complex flows.',
    averageSalary: 132000,
    salaryRange: {
      entry: 78000,
      mid: 124000,
      senior: 172000,
      lead: 220000
    },
    demandLevel: 'High',
    growthRate: '+19% (Next 5 Years)',
    matchScore: 92,
    requiredSkills: ['Design Systems', 'Figma & Prototyping', 'User Research', 'Information Architecture', 'Interaction Design', 'Micro-Animations'],
    tools: ['Figma', 'Principle', 'Framer', 'FigJam', 'Rive', 'Lottie', 'Notion'],
    educationLevel: "Bachelor's in Human-Computer Interaction, Graphic Design, or equivalent portfolio",
    experienceLevel: '2 - 5 Years for Mid-Level',
    dailyTasks: [
      'Conduct empathetic user interviews and usability testing sessions.',
      'Design modular design system components with comprehensive variant states.',
      'Build high-fidelity interactive prototypes to validate product hypotheses.',
      'Partner closely with front-end engineers to ensure pixel-perfect token implementation.'
    ],
    riasecAffinity: {
      realistic: 25,
      investigative: 65,
      artistic: 95,
      social: 75,
      enterprising: 60,
      conventional: 40
    },
    careerPath: [
      { stage: 'Beginner', title: 'Associate UI/UX Designer', duration: '0 - 2 yrs', expectedSalary: 75000, description: 'Wireframing, asset curation, and component library maintenance.' },
      { stage: 'Junior', title: 'Product Designer I', duration: '2 - 4 yrs', expectedSalary: 110000, description: 'End-to-end feature ownership, usability testing, and cross-functional handoffs.' },
      { stage: 'Mid-Level', title: 'Senior Product Designer', duration: '4 - 7 yrs', expectedSalary: 155000, description: 'Strategic design direction, multi-platform system architecture, and team mentorship.' },
      { stage: 'Senior', title: 'Lead / Principal Designer', duration: '7 - 10 yrs', expectedSalary: 195000, description: 'Executive design vision, core product philosophy, and company-wide design operations.' },
      { stage: 'Specialist / Lead', title: 'VP of Design / Head of UX', duration: '10+ yrs', expectedSalary: 260000, description: 'Building world-class creative culture, brand-level product unification, and design strategy.' }
    ],
    certifications: ['Nielsen Norman Group UX Master Certified', 'Google UX Design Professional Certificate'],
    relatedCareerIds: ['car-software-engineer', 'car-product-manager', 'car-creative-director'],
    featured: true,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-data-scientist',
    title: 'Data Scientist & Analytics Strategist',
    slug: 'data-scientist',
    domain: 'Technology',
    shortDescription: 'Uncover predictive patterns in massive data lakes to steer business strategy and product evolution.',
    overview: 'Data Scientists blend statistical modeling, programming, and commercial acumen to convert raw transactional and behavioral datasets into actionable organizational intelligence.',
    averageSalary: 152000,
    salaryRange: {
      entry: 92000,
      mid: 142000,
      senior: 198000,
      lead: 260000
    },
    demandLevel: 'Very High',
    growthRate: '+28% (Next 5 Years)',
    matchScore: 94,
    requiredSkills: ['SQL & Data Warehousing', 'Python / R', 'Statistical Hypothesis Testing', 'Machine Learning Models', 'Data Storytelling', 'Tableau / Looker'],
    tools: ['Snowflake', 'BigQuery', 'Python', 'Jupyter', 'dbt', 'Tableau', 'Scikit-Learn'],
    educationLevel: "Bachelor's or Master's in Statistics, Computer Science, Economics, or Mathematics",
    experienceLevel: '2 - 4 Years',
    dailyTasks: [
      'Query and clean petabyte-scale datasets across distributed warehouses.',
      'Design causal inference experiments and A/B test statistical frameworks.',
      'Build automated regression and clustering algorithms for user segmentation.',
      'Present strategic data findings to C-suite and product leaders.'
    ],
    riasecAffinity: {
      realistic: 35,
      investigative: 95,
      artistic: 40,
      social: 30,
      enterprising: 70,
      conventional: 85
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Data Analyst', duration: '0 - 2 yrs', expectedSalary: 85000, description: 'SQL queries, dashboard construction, and descriptive metrics reporting.' },
      { stage: 'Junior', title: 'Data Scientist', duration: '2 - 4 yrs', expectedSalary: 125000, description: 'Predictive modeling, regression analysis, and customer lifetime value models.' },
      { stage: 'Mid-Level', title: 'Senior Data Scientist', duration: '4 - 7 yrs', expectedSalary: 175000, description: 'Advanced experimentation frameworks, causal ML, and executive data roadmaps.' },
      { stage: 'Senior', title: 'Staff Data Scientist / Team Lead', duration: '7 - 10 yrs', expectedSalary: 230000, description: 'Enterprise data architecture, algorithmic decisioning, and research governance.' },
      { stage: 'Specialist / Lead', title: 'Chief Data Officer (CDO)', duration: '10+ yrs', expectedSalary: 310000, description: 'Company-wide data governance, monetizable data platforms, and analytics vision.' }
    ],
    certifications: ['IBM Data Science Professional', 'Microsoft Certified: Azure Data Scientist Associate'],
    relatedCareerIds: ['car-ai-ml-engineer', 'car-financial-analyst', 'car-business-analyst'],
    featured: true,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-product-manager',
    title: 'Product Manager (Tech & Growth)',
    slug: 'product-manager',
    domain: 'Business',
    shortDescription: 'Define product vision, orchestrate cross-functional teams, and deliver market-winning software products.',
    overview: 'Product Managers sit at the intersection of technology, user experience, and business. They are responsible for understanding customer pain points, defining product roadmaps, and guiding engineering teams to ship high-impact solutions.',
    averageSalary: 158000,
    salaryRange: {
      entry: 95000,
      mid: 148000,
      senior: 205000,
      lead: 275000
    },
    demandLevel: 'High',
    growthRate: '+21% (Next 5 Years)',
    matchScore: 89,
    requiredSkills: ['Product Strategy', 'User Empathy', 'Agile & Scrum Delivery', 'Data Analytics & Metrics', 'Market Research', 'Roadmap Prioritization'],
    tools: ['Jira', 'Linear', 'Mixpanel', 'Amplitude', 'Notion', 'Figma', 'Productboard'],
    educationLevel: "Bachelor's in Business, Engineering, Computer Science, or equivalent experience",
    experienceLevel: '2 - 5 Years',
    dailyTasks: [
      'Synthesize customer feedback and telemetry data into clear product PRDs.',
      'Prioritize engineering sprint backlogs using RICE and Value vs Effort frameworks.',
      'Lead sprint standups, sprint reviews, and cross-departmental alignment syncs.',
      'Monitor key product metrics including CAC, LTV, churn, and feature adoption.'
    ],
    riasecAffinity: {
      realistic: 20,
      investigative: 70,
      artistic: 55,
      social: 80,
      enterprising: 95,
      conventional: 60
    },
    careerPath: [
      { stage: 'Beginner', title: 'Associate Product Manager (APM)', duration: '0 - 2 yrs', expectedSalary: 90000, description: 'Feature requirement gathering, backlog grooming, and user testing.' },
      { stage: 'Junior', title: 'Product Manager', duration: '2 - 4 yrs', expectedSalary: 135000, description: 'Owning a core product squad, roadmap execution, and launch metrics.' },
      { stage: 'Mid-Level', title: 'Senior Product Manager', duration: '4 - 7 yrs', expectedSalary: 180000, description: 'Managing multi-squad product domains and cross-business unit growth initiatives.' },
      { stage: 'Senior', title: 'Director of Product Management', duration: '7 - 10 yrs', expectedSalary: 240000, description: 'Managing product teams, portfolio strategy, and product-market expansion.' },
      { stage: 'Specialist / Lead', title: 'Chief Product Officer (CPO)', duration: '10+ yrs', expectedSalary: 330000, description: 'Executive responsibility for entire digital portfolio, vision, and market leadership.' }
    ],
    certifications: ['Certified Scrum Product Owner (CSPO)', 'Product School Certified PM'],
    relatedCareerIds: ['car-product-designer', 'car-business-analyst', 'car-marketing-manager'],
    featured: true,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-cybersecurity-analyst',
    title: 'Cybersecurity Threat & Defense Analyst',
    slug: 'cybersecurity-analyst',
    domain: 'Technology',
    shortDescription: 'Protect mission-critical networks, cloud architectures, and sensitive enterprise data from cyber attacks.',
    overview: 'Cybersecurity Analysts assess vulnerabilities, build resilient cryptographic defenses, monitor live intrusion detections, and respond to sophisticated threat actors across cloud and on-premise environments.',
    averageSalary: 140000,
    salaryRange: {
      entry: 82000,
      mid: 130000,
      senior: 182000,
      lead: 240000
    },
    demandLevel: 'Very High',
    growthRate: '+32% (Next 5 Years)',
    matchScore: 91,
    requiredSkills: ['Threat Modeling', 'Network Security & Firewalls', 'SIEM & SOC Operations', 'Penetration Testing', 'Incident Response', 'Zero Trust Architecture'],
    tools: ['Splunk', 'Wireshark', 'Burp Suite', 'Metasploit', 'CrowdStrike', 'Kali Linux', 'Tenable'],
    educationLevel: "Bachelor's in Cybersecurity, Information Technology, or Computer Science",
    experienceLevel: '1 - 4 Years',
    dailyTasks: [
      'Monitor real-time network telemetry and SIEM alert dashboards for anomalies.',
      'Perform vulnerability assessments and ethical penetration testing on web apps.',
      'Formulate incident containment plans and post-mortem threat intelligence reports.',
      'Enforce Zero Trust identity access management and automated patch pipelines.'
    ],
    riasecAffinity: {
      realistic: 65,
      investigative: 90,
      artistic: 20,
      social: 25,
      enterprising: 50,
      conventional: 85
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior SOC Analyst (Tier 1)', duration: '0 - 2 yrs', expectedSalary: 78000, description: 'Alert triage, log analysis, and preliminary malware scans.' },
      { stage: 'Junior', title: 'Security Analyst (Tier 2)', duration: '2 - 4 yrs', expectedSalary: 115000, description: 'Incident response, vulnerability scanning, and firewall configuration.' },
      { stage: 'Mid-Level', title: 'Senior Threat Hunter / Pentester', duration: '4 - 7 yrs', expectedSalary: 165000, description: 'Red teaming, proactive adversary emulation, and security architecture.' },
      { stage: 'Senior', title: 'Lead Security Architect', duration: '7 - 10 yrs', expectedSalary: 215000, description: 'Cloud security governance, zero-trust infrastructure, and compliance.' },
      { stage: 'Specialist / Lead', title: 'Chief Information Security Officer (CISO)', duration: '10+ yrs', expectedSalary: 300000, description: 'Executive board-level risk management, disaster recovery, and cybersecurity command.' }
    ],
    certifications: ['CompTIA Security+', 'Certified Information Systems Security Professional (CISSP)', 'Certified Ethical Hacker (CEH)'],
    relatedCareerIds: ['car-cloud-architect', 'car-software-engineer', 'car-ai-ml-engineer'],
    featured: true,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-software-engineer',
    title: 'Full-Stack Software Engineer',
    slug: 'software-engineer',
    domain: 'Technology',
    shortDescription: 'Build high-performance web applications, resilient backend microservices, and modern user interfaces.',
    overview: 'Full-Stack Software Engineers write clean, maintainable, and scalable code across client and server layers. They design REST & GraphQL APIs, manage databases, and deploy modern reactive web applications.',
    averageSalary: 145000,
    salaryRange: {
      entry: 85000,
      mid: 138000,
      senior: 195000,
      lead: 265000
    },
    demandLevel: 'Very High',
    growthRate: '+25% (Next 5 Years)',
    matchScore: 93,
    requiredSkills: ['TypeScript / JavaScript', 'React / Next.js', 'Node.js / Go', 'PostgreSQL & Redis', 'System Design', 'Git & CI/CD Pipelines'],
    tools: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'Vite', 'TailwindCSS'],
    educationLevel: "Bachelor's in Computer Science, Software Engineering, or equivalent coding experience",
    experienceLevel: '1 - 4 Years',
    dailyTasks: [
      'Develop modern, responsive frontend components and server-rendered web pages.',
      'Design high-throughput backend APIs and optimize database query plans.',
      'Perform rigorous code reviews and write comprehensive automated test suites.',
      'Troubleshoot production performance bottlenecks and maintain CI/CD pipelines.'
    ],
    riasecAffinity: {
      realistic: 55,
      investigative: 90,
      artistic: 50,
      social: 30,
      enterprising: 50,
      conventional: 75
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Software Engineer', duration: '0 - 2 yrs', expectedSalary: 82000, description: 'Component development, bug fixing, and unit test coverage.' },
      { stage: 'Junior', title: 'Software Engineer II', duration: '2 - 4 yrs', expectedSalary: 125000, description: 'End-to-end feature ownership, API design, and schema migrations.' },
      { stage: 'Mid-Level', title: 'Senior Software Engineer', duration: '4 - 7 yrs', expectedSalary: 175000, description: 'Distributed systems design, performance profiling, and engineering mentorship.' },
      { stage: 'Senior', title: 'Staff / Principal Engineer', duration: '7 - 10 yrs', expectedSalary: 235000, description: 'Organization-wide architecture, technology radar selection, and system reliability.' },
      { stage: 'Specialist / Lead', title: 'VP of Engineering / CTO', duration: '10+ yrs', expectedSalary: 320000, description: 'Technical organization vision, engineering culture, and strategic tech bets.' }
    ],
    certifications: ['AWS Certified Solutions Architect', 'Meta Certified Front-End Developer'],
    relatedCareerIds: ['car-cloud-architect', 'car-product-designer', 'car-ai-ml-engineer'],
    featured: true,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-cloud-architect',
    title: 'Cloud & Infrastructure Solutions Architect',
    slug: 'cloud-architect',
    domain: 'Technology',
    shortDescription: 'Design resilient, scalable multi-cloud server topologies and automated container orchestration systems.',
    overview: 'Cloud Architects build the enterprise foundation for modern software. They specialize in Infrastructure as Code (IaC), Kubernetes container orchestration, cost optimization, and high availability systems across AWS, GCP, and Azure.',
    averageSalary: 165000,
    salaryRange: {
      entry: 100000,
      mid: 152000,
      senior: 210000,
      lead: 280000
    },
    demandLevel: 'Very High',
    growthRate: '+29% (Next 5 Years)',
    matchScore: 88,
    requiredSkills: ['Kubernetes & Docker', 'Terraform & IaC', 'AWS / GCP / Azure', 'Distributed Networking', 'Observability & Prometheus', 'Cost Governance'],
    tools: ['Terraform', 'Kubernetes', 'AWS', 'GCP', 'Helm', 'Datadog', 'Grafana', 'Ansible'],
    educationLevel: "Bachelor's in Computer Engineering, Computer Science, or equivalent certification",
    experienceLevel: '3 - 6 Years',
    dailyTasks: [
      'Author Terraform modules to provision multi-region VPCs and cluster meshes.',
      'Optimize cloud billing footprint and engineer auto-scaling policies.',
      'Implement zero-downtime blue/green deployment orchestration with Helm.',
      'Configure Prometheus alerts and distributed tracing with OpenTelemetry.'
    ],
    riasecAffinity: {
      realistic: 70,
      investigative: 85,
      artistic: 20,
      social: 25,
      enterprising: 60,
      conventional: 80
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Cloud / DevOps Engineer', duration: '0 - 2 yrs', expectedSalary: 92000, description: 'Basic CI/CD pipeline automation and server maintenance.' },
      { stage: 'Junior', title: 'Cloud Engineer', duration: '2 - 4 yrs', expectedSalary: 135000, description: 'Containerization, IaC script authoring, and monitoring setups.' },
      { stage: 'Mid-Level', title: 'Senior Cloud Solutions Architect', duration: '4 - 7 yrs', expectedSalary: 185000, description: 'Enterprise disaster recovery, hybrid cloud migrations, and security compliance.' },
      { stage: 'Senior', title: 'Principal Infrastructure Architect', duration: '7 - 10 yrs', expectedSalary: 240000, description: 'Global multi-cloud topology, edge computing networks, and platform engineering.' },
      { stage: 'Specialist / Lead', title: 'VP of Infrastructure & Platform', duration: '10+ yrs', expectedSalary: 310000, description: 'Directing worldwide infrastructure budgets, security posture, and platform uptime.' }
    ],
    certifications: ['AWS Solutions Architect Professional', 'Google Cloud Certified Professional Cloud Architect', 'Certified Kubernetes Administrator (CKA)'],
    relatedCareerIds: ['car-software-engineer', 'car-cybersecurity-analyst', 'car-ai-ml-engineer'],
    featured: false,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-financial-analyst',
    title: 'Financial Analyst & Investment Strategist',
    slug: 'financial-analyst',
    domain: 'Finance',
    shortDescription: 'Evaluate corporate asset valuations, build predictive fiscal forecasts, and guide capital investment strategies.',
    overview: 'Financial Analysts examine macroeconomic indicators, corporate balance sheets, and market trends to deliver quantitative recommendations for investments, acquisitions, and treasury growth.',
    averageSalary: 122000,
    salaryRange: {
      entry: 72000,
      mid: 115000,
      senior: 165000,
      lead: 230000
    },
    demandLevel: 'High',
    growthRate: '+15% (Next 5 Years)',
    matchScore: 84,
    requiredSkills: ['Financial Modeling (DCF / LBO)', 'Excel & Financial Forecasting', 'Market Valuation', 'Accounting Principles (GAAP/IFRS)', 'Data Synthesis', 'Pitch Deck Presentation'],
    tools: ['Bloomberg Terminal', 'CapIQ', 'Advanced Excel', 'Python for Finance', 'Power BI', 'FactSet'],
    educationLevel: "Bachelor's in Finance, Economics, Accounting, or Mathematics",
    experienceLevel: '1 - 4 Years',
    dailyTasks: [
      'Build discounted cash flow (DCF) models to assess company valuations.',
      'Analyze quarterly earnings releases and prepare variance reports.',
      'Conduct industry market research and synthesize competitor capital structures.',
      'Author executive briefing memos for investment committees and CFOs.'
    ],
    riasecAffinity: {
      realistic: 25,
      investigative: 85,
      artistic: 20,
      social: 45,
      enterprising: 90,
      conventional: 95
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Financial Analyst', duration: '0 - 2 yrs', expectedSalary: 72000, description: 'Data gathering, financial statement spreading, and model auditing.' },
      { stage: 'Junior', title: 'Financial Analyst II', duration: '2 - 4 yrs', expectedSalary: 105000, description: 'Three-statement modeling, budgeting forecasts, and M&A screening.' },
      { stage: 'Mid-Level', title: 'Senior Financial Strategist', duration: '4 - 7 yrs', expectedSalary: 155000, description: 'Strategic capital allocation, deal structuring, and corporate FP&A leadership.' },
      { stage: 'Senior', title: 'Director of Strategic Finance / VP', duration: '7 - 10 yrs', expectedSalary: 215000, description: 'Overseeing corporate treasury, investor relations, and capital fundraising.' },
      { stage: 'Specialist / Lead', title: 'Chief Financial Officer (CFO)', duration: '10+ yrs', expectedSalary: 320000, description: 'Executive fiscal stewardship, public market listings (IPO), and enterprise governance.' }
    ],
    certifications: ['Chartered Financial Analyst (CFA)', 'Certified Public Accountant (CPA)', 'FMVA (Financial Modeling & Valuation Analyst)'],
    relatedCareerIds: ['car-data-scientist', 'car-management-consultant', 'car-business-analyst'],
    featured: false,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-management-consultant',
    title: 'Management Consultant & Corporate Strategist',
    slug: 'management-consultant',
    domain: 'Business',
    shortDescription: 'Advise Fortune 500 executives on operational restructuring, digital transformation, and growth vectors.',
    overview: 'Management Consultants dissect intricate corporate bottlenecks, develop data-driven operating models, and guide organizational transformations across various global sectors.',
    averageSalary: 155000,
    salaryRange: {
      entry: 90000,
      mid: 145000,
      senior: 210000,
      lead: 310000
    },
    demandLevel: 'High',
    growthRate: '+17% (Next 5 Years)',
    matchScore: 87,
    requiredSkills: ['Problem Structuring (MECE)', 'Executive Communication', 'Business Case Modeling', 'Change Management', 'Operational Optimization', 'Strategic Vision'],
    tools: ['PowerPoint / Keynote', 'Excel', 'Miro', 'Tableau', 'Alteryx', 'Asana'],
    educationLevel: "Bachelor's or Master's (MBA) in Business, Economics, or Engineering",
    experienceLevel: '2 - 5 Years',
    dailyTasks: [
      'Conduct stakeholder interviews with executive sponsors and operational teams.',
      'Formulate MECE hypotheses and model financial impact of proposed restructuring.',
      'Deliver persuasive visual presentations to client Boards of Directors.',
      'Facilitate cross-functional workshops to drive change management adoption.'
    ],
    riasecAffinity: {
      realistic: 15,
      investigative: 80,
      artistic: 40,
      social: 75,
      enterprising: 95,
      conventional: 70
    },
    careerPath: [
      { stage: 'Beginner', title: 'Business Analyst / Associate', duration: '0 - 2 yrs', expectedSalary: 92000, description: 'Market research, financial analysis, and slide deck drafting.' },
      { stage: 'Junior', title: 'Consultant / Engagement Lead', duration: '2 - 4 yrs', expectedSalary: 140000, description: 'Managing workstreams, direct client interface, and analytical synthesis.' },
      { stage: 'Mid-Level', title: 'Engagement Manager / Project Leader', duration: '4 - 7 yrs', expectedSalary: 195000, description: 'Leading client engagements, team coaching, and strategic recommendations.' },
      { stage: 'Senior', title: 'Associate Partner / Principal', duration: '7 - 10 yrs', expectedSalary: 265000, description: 'Client account development, industry specialization, and thought leadership.' },
      { stage: 'Specialist / Lead', title: 'Senior Partner / Managing Director', duration: '10+ yrs', expectedSalary: 450000, description: 'Firm leadership, massive commercial deals, and global practice leadership.' }
    ],
    certifications: ['Project Management Professional (PMP)', 'Certified Management Consultant (CMC)'],
    relatedCareerIds: ['car-product-manager', 'car-financial-analyst', 'car-business-analyst'],
    featured: true,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-biomedical-scientist',
    title: 'Biomedical Scientist & Genomic Researcher',
    slug: 'biomedical-scientist',
    domain: 'Healthcare',
    shortDescription: 'Pioneer next-generation therapeutics, genetic sequencing breakthroughs, and targeted clinical treatments.',
    overview: 'Biomedical Scientists conduct rigorous laboratory experiments and computational bioinformatics analyses to understand molecular disease mechanisms and engineer personalized genetic medicines.',
    averageSalary: 135000,
    salaryRange: {
      entry: 75000,
      mid: 125000,
      senior: 180000,
      lead: 245000
    },
    demandLevel: 'High',
    growthRate: '+23% (Next 5 Years)',
    matchScore: 86,
    requiredSkills: ['Genomic Sequencing (CRISPR / NGS)', 'Bioinformatics & Python/R', 'Molecular Biology & Cell Culture', 'Clinical Trial Protocols', 'Scientific Publishing', 'FDA Compliance'],
    tools: ['PyMOL', 'BLAST', 'R/Bioconductor', 'Benchling', 'FlowJo', 'GraphPad Prism'],
    educationLevel: "Master's or Ph.D. in Biomedical Sciences, Genetics, or Bioengineering",
    experienceLevel: '2 - 5 Years',
    dailyTasks: [
      'Execute CRISPR gene editing assays and analyze Next-Gen Sequencing datasets.',
      'Perform statistical analyses on cellular response to novel therapeutic molecules.',
      'Write peer-reviewed scientific manuscripts and patent filings.',
      'Collaborate with bioinformaticians to model 3D protein-ligand binding dynamics.'
    ],
    riasecAffinity: {
      realistic: 60,
      investigative: 98,
      artistic: 25,
      social: 45,
      enterprising: 40,
      conventional: 75
    },
    careerPath: [
      { stage: 'Beginner', title: 'Research Associate', duration: '0 - 2 yrs', expectedSalary: 72000, description: 'Assay execution, laboratory maintenance, and data recording.' },
      { stage: 'Junior', title: 'Scientist I / Bioinformatician', duration: '2 - 4 yrs', expectedSalary: 110000, description: 'Experimental design, sequencing data pipelines, and target validation.' },
      { stage: 'Mid-Level', title: 'Senior Research Scientist', duration: '4 - 7 yrs', expectedSalary: 160000, description: 'Leading preclinical therapeutic programs and publishing novel discovery findings.' },
      { stage: 'Senior', title: 'Principal Investigator / Director', duration: '7 - 10 yrs', expectedSalary: 210000, description: 'Grant management, clinical translation roadmaps, and laboratory leadership.' },
      { stage: 'Specialist / Lead', title: 'Chief Scientific Officer (CSO)', duration: '10+ yrs', expectedSalary: 310000, description: 'Guiding entire biotech portfolio discovery pipeline, regulatory FDA approvals, and vision.' }
    ],
    certifications: ['Certified Clinical Research Professional (CCRP)', 'ASCP Molecular Biology Certification'],
    relatedCareerIds: ['car-data-scientist', 'car-clinical-data-manager', 'car-environmental-engineer'],
    featured: false,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-robotics-engineer',
    title: 'Autonomous Robotics & Mechatronics Engineer',
    slug: 'robotics-engineer',
    domain: 'Engineering',
    shortDescription: 'Design, simulate, and manufacture intelligent autonomous robots, robotic limbs, and automated vehicles.',
    overview: 'Robotics Engineers unite mechanical design, embedded firmware, sensor fusion, and computer vision to invent robotic machines capable of operating autonomously in complex physical environments.',
    averageSalary: 148000,
    salaryRange: {
      entry: 88000,
      mid: 140000,
      senior: 198000,
      lead: 265000
    },
    demandLevel: 'Very High',
    growthRate: '+26% (Next 5 Years)',
    matchScore: 90,
    requiredSkills: ['ROS (Robot Operating System)', 'C++ / Python Embedded', 'Kinematics & Control Systems', 'Sensor Fusion (LiDAR / IMU)', 'CAD & 3D Prototyping', 'Computer Vision'],
    tools: ['ROS 2', 'Gazebo Simulator', 'SolidWorks', 'MATLAB / Simulink', 'OpenCV', 'Altium'],
    educationLevel: "Bachelor's or Master's in Robotics, Mechanical, or Electrical Engineering",
    experienceLevel: '2 - 5 Years',
    dailyTasks: [
      'Program path planning and SLAM (Simultaneous Localization and Mapping) algorithms.',
      'Simulate mechanical stress, joint kinematics, and motor torque profiles in Gazebo.',
      'Solder, assemble, and test custom micro-controller boards and sensor suites.',
      'Conduct rigorous field testing of autonomous navigation in unstructured terrains.'
    ],
    riasecAffinity: {
      realistic: 95,
      investigative: 92,
      artistic: 30,
      social: 15,
      enterprising: 45,
      conventional: 65
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Mechatronics Engineer', duration: '0 - 2 yrs', expectedSalary: 85000, description: 'CAD modeling, PCB soldering, and basic motor driver testing.' },
      { stage: 'Junior', title: 'Robotics Software / Hardware Engineer', duration: '2 - 4 yrs', expectedSalary: 125000, description: 'SLAM implementation, sensor calibration, and ROS node development.' },
      { stage: 'Mid-Level', title: 'Senior Autonomous Systems Engineer', duration: '4 - 7 yrs', expectedSalary: 175000, description: 'Real-time control algorithms, hardware-in-the-loop testing, and safety architecture.' },
      { stage: 'Senior', title: 'Staff Robotics Architect', duration: '7 - 10 yrs', expectedSalary: 235000, description: 'Full robotic platform architecture, compute optimization, and patent creation.' },
      { stage: 'Specialist / Lead', title: 'VP of Robotics & Hardware', duration: '10+ yrs', expectedSalary: 315000, description: 'Commercial autonomous vehicle fleet deployment, executive hardware scaling.' }
    ],
    certifications: ['Certified Automation Professional (CAP)', 'SolidWorks Professional (CSWP)'],
    relatedCareerIds: ['car-ai-ml-engineer', 'car-software-engineer', 'car-environmental-engineer'],
    featured: true,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-marketing-manager',
    title: 'Brand Growth & Digital Marketing Strategist',
    slug: 'marketing-manager',
    domain: 'Business',
    shortDescription: 'Craft resonant brand narratives, lead multichannel acquisition campaigns, and optimize viral funnel loops.',
    overview: 'Digital Marketing Strategists architect high-conversion customer acquisition campaigns, brand identity ecosystems, content marketing, and influencer partnerships across modern media channels.',
    averageSalary: 128000,
    salaryRange: {
      entry: 68000,
      mid: 118000,
      senior: 168000,
      lead: 235000
    },
    demandLevel: 'Moderate',
    growthRate: '+14% (Next 5 Years)',
    matchScore: 82,
    requiredSkills: ['Growth Marketing Funnels', 'Brand Positioning & Copywriting', 'Performance Ads (Meta/Google)', 'SEO & Content Strategy', 'Marketing Analytics', 'Influencer Partnerships'],
    tools: ['Google Ads', 'Meta Ads Manager', 'HubSpot', 'Ahrefs', 'Google Analytics 4', 'Canva', 'Semrush'],
    educationLevel: "Bachelor's in Marketing, Communications, Business, or equivalent experience",
    experienceLevel: '2 - 4 Years',
    dailyTasks: [
      'Develop compelling editorial campaigns that amplify brand authority and inbound leads.',
      'Optimize performance advertising budgets across paid search and paid social channels.',
      'Analyze customer lifetime value (LTV) and customer acquisition cost (CAC) cohort curves.',
      'Manage agency partners, creative copywriters, and multimedia video producers.'
    ],
    riasecAffinity: {
      realistic: 15,
      investigative: 55,
      artistic: 85,
      social: 85,
      enterprising: 95,
      conventional: 50
    },
    careerPath: [
      { stage: 'Beginner', title: 'Marketing Coordinator', duration: '0 - 2 yrs', expectedSalary: 65000, description: 'Social media publishing, email campaigns, and campaign analytics.' },
      { stage: 'Junior', title: 'Growth Marketing Manager', duration: '2 - 4 yrs', expectedSalary: 105000, description: 'Paid acquisition channels, conversion rate optimization (CRO), and A/B ad testing.' },
      { stage: 'Mid-Level', title: 'Senior Brand & Growth Strategist', duration: '4 - 7 yrs', expectedSalary: 150000, description: 'Omnichannel campaign strategy, international brand expansion, and team leadership.' },
      { stage: 'Senior', title: 'Director of Marketing', duration: '7 - 10 yrs', expectedSalary: 205000, description: 'Managing multi-million dollar annual marketing budgets and full-funnel strategy.' },
      { stage: 'Specialist / Lead', title: 'Chief Marketing Officer (CMO)', duration: '10+ yrs', expectedSalary: 290000, description: 'Global brand stewardship, public company positioning, and category creation.' }
    ],
    certifications: ['Google Ads Search Certification', 'HubSpot Inbound Marketing Certified', 'Meta Certified Digital Marketing Associate'],
    relatedCareerIds: ['car-product-manager', 'car-product-designer', 'car-business-analyst'],
    featured: false,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-environmental-engineer',
    title: 'Environmental Engineer & Climate Technologist',
    slug: 'environmental-engineer',
    domain: 'Science',
    shortDescription: 'Build renewable clean energy systems, carbon capture technology, and ecological sustainability systems.',
    overview: 'Environmental Engineers innovate solutions to combat climate change, design carbon-neutral infrastructure, remediate toxic industrial waste, and architect sustainable municipal clean water systems.',
    averageSalary: 118000,
    salaryRange: {
      entry: 68000,
      mid: 108000,
      senior: 155000,
      lead: 215000
    },
    demandLevel: 'High',
    growthRate: '+20% (Next 5 Years)',
    matchScore: 83,
    requiredSkills: ['Renewable Energy Modeling', 'Carbon Accounting & LCA', 'Hydrology & Waste Remediation', 'GIS Spatial Mapping', 'Environmental Policy (EPA)', 'Thermodynamics'],
    tools: ['ArcGIS', 'AutoCAD Civil 3D', 'SimaPro LCA', 'OpenLCA', 'MATLAB', 'Python GIS'],
    educationLevel: "Bachelor's or Master's in Environmental, Chemical, or Civil Engineering",
    experienceLevel: '2 - 5 Years',
    dailyTasks: [
      'Conduct life cycle assessments (LCA) to quantify corporate carbon footprints.',
      'Design advanced biofiltration and water purification treatment facilities.',
      'Perform GIS spatial analysis to evaluate flood risk and clean energy siting.',
      'Advise industrial clients on environmental compliance and ESG sustainability metrics.'
    ],
    riasecAffinity: {
      realistic: 85,
      investigative: 90,
      artistic: 30,
      social: 50,
      enterprising: 45,
      conventional: 70
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Environmental Specialist', duration: '0 - 2 yrs', expectedSalary: 68000, description: 'Field sampling, air/water testing, and regulatory documentation.' },
      { stage: 'Junior', title: 'Environmental Project Engineer', duration: '2 - 4 yrs', expectedSalary: 98000, description: 'Remediation system design, carbon accounting, and site assessments.' },
      { stage: 'Mid-Level', title: 'Senior Sustainability Engineer', duration: '4 - 7 yrs', expectedSalary: 142000, description: 'Renewable energy microgrids, circular economy systems, and municipal consulting.' },
      { stage: 'Senior', title: 'Principal Climate Solutions Architect', duration: '7 - 10 yrs', expectedSalary: 195000, description: 'Enterprise ESG transformation, carbon capture facilities, and policy advising.' },
      { stage: 'Specialist / Lead', title: 'Chief Sustainability Officer (CSO)', duration: '10+ yrs', expectedSalary: 280000, description: 'Directing global net-zero commitments, clean energy investments, and green strategy.' }
    ],
    certifications: ['Professional Engineer (PE) License', 'LEED AP BD+C', 'Certified Carbon Reduction Manager'],
    relatedCareerIds: ['car-biomedical-scientist', 'car-robotics-engineer', 'car-data-scientist'],
    featured: false,
    colorAccent: '#6755C2'
  },
  {
    id: 'car-creative-director',
    title: 'Creative Director & Brand Storyteller',
    slug: 'creative-director',
    domain: 'Arts & Humanities',
    shortDescription: 'Lead visionary visual narratives, art direction, and immersive multimedia campaigns for world-class brands.',
    overview: 'Creative Directors shape the soul and visual prestige of modern brands. They lead multidisciplinary studios of writers, animators, 3D artists, and cinematographers to produce iconic culture-defining work.',
    averageSalary: 160000,
    salaryRange: {
      entry: 85000,
      mid: 145000,
      senior: 215000,
      lead: 300000
    },
    demandLevel: 'Moderate',
    growthRate: '+12% (Next 5 Years)',
    matchScore: 85,
    requiredSkills: ['Art Direction & Visual Storytelling', 'Cinematic Composition', 'Creative Team Leadership', 'Brand Identity Systems', 'Design Philosophy', 'Client Pitching'],
    tools: ['Adobe Creative Suite', 'Cinema 4D / Blender', 'Figma', 'Midjourney', 'After Effects', 'Notion'],
    educationLevel: "Bachelor's in Fine Arts, Visual Communication, or outstanding creative portfolio",
    experienceLevel: '4 - 8 Years',
    dailyTasks: [
      'Establish visual moodboards, aesthetic direction, and creative manifestos for new brand launches.',
      'Direct on-set photoshoots, commercial film shoots, and digital experience design.',
      'Critique and refine typography, spatial pacing, and animation keyframes with design leads.',
      'Pitch breakthrough creative concepts to Fortune 100 executive decision makers.'
    ],
    riasecAffinity: {
      realistic: 20,
      investigative: 40,
      artistic: 100,
      social: 70,
      enterprising: 85,
      conventional: 25
    },
    careerPath: [
      { stage: 'Beginner', title: 'Graphic Designer / Copywriter', duration: '0 - 2 yrs', expectedSalary: 62000, description: 'Visual design, layout design, and digital asset execution.' },
      { stage: 'Junior', title: 'Senior Art Director', duration: '2 - 5 yrs', expectedSalary: 110000, description: 'Campaign concepting, visual leadership, and design team guidance.' },
      { stage: 'Mid-Level', title: 'Associate Creative Director (ACD)', duration: '5 - 8 yrs', expectedSalary: 165000, description: 'Directing multiple brand accounts, strategic creative development, and mentoring.' },
      { stage: 'Senior', title: 'Creative Director', duration: '8 - 12 yrs', expectedSalary: 230000, description: 'Full studio creative authority, agency pitch leadership, and brand legacy design.' },
      { stage: 'Specialist / Lead', title: 'Chief Creative Officer (CCO)', duration: '12+ yrs', expectedSalary: 350000, description: 'Shaping cultural narratives, global creative agency leadership, and iconic impact.' }
    ],
    certifications: ['Cannes Lions Academy Alumni', 'D&AD Masterclass Certificate'],
    relatedCareerIds: ['car-product-designer', 'car-marketing-manager'],
    featured: true,
    colorAccent: '#402D9C'
  },
  {
    id: 'car-business-analyst',
    title: 'Business Systems Analyst & Intelligence Architect',
    slug: 'business-analyst',
    domain: 'Business',
    shortDescription: 'Translate complex operational workflows into data-backed technological specifications and automated ERPs.',
    overview: 'Business Systems Analysts serve as the vital bridge between business stakeholders and technical developers, auditing legacy workflows and designing automated software solutions.',
    averageSalary: 115000,
    salaryRange: {
      entry: 68000,
      mid: 105000,
      senior: 152000,
      lead: 198000
    },
    demandLevel: 'High',
    growthRate: '+16% (Next 5 Years)',
    matchScore: 85,
    requiredSkills: ['Process Mapping (BPMN)', 'SQL & Requirements Gathering', 'Agile User Stories', 'ERP / CRM Integration', 'Stakeholder Interviews', 'Data Analytics'],
    tools: ['Lucidchart', 'Jira', 'SQL Server', 'Power BI', 'Salesforce', 'SAP', 'Visio'],
    educationLevel: "Bachelor's in Information Systems, Business Administration, or Computer Science",
    experienceLevel: '1 - 4 Years',
    dailyTasks: [
      'Interview domain leaders to map current vs future state business processes (AS-IS / TO-BE).',
      'Author functional specification documents (FSDs) and detailed user acceptance criteria.',
      'Query relational databases to identify operational leakage and efficiency bottlenecks.',
      'Coordinate UAT (User Acceptance Testing) cycles prior to enterprise system rollout.'
    ],
    riasecAffinity: {
      realistic: 30,
      investigative: 75,
      artistic: 25,
      social: 65,
      enterprising: 80,
      conventional: 90
    },
    careerPath: [
      { stage: 'Beginner', title: 'Junior Business Analyst', duration: '0 - 2 yrs', expectedSalary: 68000, description: 'Documenting business requirements, meeting minutes, and basic flowcharts.' },
      { stage: 'Junior', title: 'Business Systems Analyst', duration: '2 - 4 yrs', expectedSalary: 102000, description: 'Managing technical requirements, SQL reporting, and system integrations.' },
      { stage: 'Mid-Level', title: 'Senior Business Intelligence Architect', duration: '4 - 7 yrs', expectedSalary: 145000, description: 'Enterprise ERP modernization, data warehouse modeling, and governance.' },
      { stage: 'Senior', title: 'Lead Systems Strategist', duration: '7 - 10 yrs', expectedSalary: 190000, description: 'Enterprise architecture planning, vendor selection, and transformation strategy.' },
      { stage: 'Specialist / Lead', title: 'Director of Business Applications', duration: '10+ yrs', expectedSalary: 260000, description: 'Executive ownership of all enterprise operational software and analytics.' }
    ],
    certifications: ['Certified Business Analysis Professional (CBAP)', 'PMI Professional in Business Analysis (PMI-PBA)'],
    relatedCareerIds: ['car-product-manager', 'car-data-scientist', 'car-management-consultant'],
    featured: false,
    colorAccent: '#6755C2'
  }
];
