import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatLog } from '../models/ChatLog.js';
import { Profile } from '../models/Profile.js';
import { Career } from '../models/Career.js';

// Pre-seeded comprehensive Career & Technology Knowledge Base stored for instant retrieval
const STORED_KNOWLEDGE_BASE = [
  {
    keywords: ['become full stack', 'full stack roadmap', 'full stack developer', 'mern stack', 'web developer'],
    question: 'How do I become a Full Stack Web Developer?',
    answer: `### 🚀 Step-by-Step Roadmap to Become a Full Stack Developer (2025)

#### 1. Core Fundamentals (Weeks 1 - 6)
- **Languages**: HTML5, CSS3, Modern JavaScript (ES6+), TypeScript.
- **Concepts**: DOM manipulation, Async/Await, Promises, Responsive Design (Flexbox, Grid).

#### 2. Frontend Mastery (Weeks 7 - 14)
- **Frameworks**: React.js 19 or Next.js 15.
- **Styling**: Tailwind CSS v4, CSS Modules.
- **State Management**: Zustand, Redux Toolkit.

#### 3. Backend & Database Architecture (Weeks 15 - 22)
- **Runtime**: Node.js & Express.js.
- **Databases**: MongoDB (NoSQL) and PostgreSQL (Relational SQL).
- **Authentication**: JWT, OAuth 2.0, HTTP-Only cookies.

#### 4. DevOps & Cloud Deployment (Weeks 23 - 28)
- **Deployment**: Vercel, Render, AWS S3, Docker containers.
- **Version Control**: Git & GitHub actions.

💰 **Average Salary**: $85,000 – $155,000/year depending on location & experience.`
  },
  {
    keywords: ['become data scientist', 'data science roadmap', 'data analyst', 'machine learning', 'python for data'],
    question: 'How do I become a Data Scientist or Data Analyst?',
    answer: `### 📊 Data Science & Analytics Career Roadmap (2025)

#### 1. Mathematics & Programming (Weeks 1 - 8)
- **Language**: Python 3.12, SQL (PostgreSQL / Snowflake).
- **Math**: Linear Algebra, Probability, Calculus, Inferential Statistics.

#### 2. Data Wrangling & Visualization (Weeks 9 - 16)
- **Libraries**: Pandas, NumPy, Matplotlib, Seaborn, Plotly.
- **BI Tools**: Tableau, Power BI, Metabase.

#### 3. Machine Learning & Predictive Modeling (Weeks 17 - 24)
- **Frameworks**: Scikit-Learn, PyTorch, TensorFlow.
- **Algorithms**: Regression, Decision Trees, Random Forests, XGBoost, Clustering.

#### 4. Big Data & AI Pipelines (Weeks 25 - 30)
- **Tools**: Apache Spark, Airflow, Vector Databases (Pinecone, ChromaDB), LangChain.

💰 **Average Salary**: $95,000 – $180,000/year.`
  },
  {
    keywords: ['become cybersecurity', 'ethical hacking', 'security analyst', 'cyber security', 'comptia security'],
    question: 'How do I get started in Cybersecurity & Ethical Hacking?',
    answer: `### 🛡️ Cybersecurity & Ethical Hacking Career Blueprint

#### 1. Foundational Networking & Systems (Weeks 1 - 8)
- **OS**: Linux Administration (Ubuntu/Kali), Windows PowerShell.
- **Networking**: TCP/IP stack, DNS, Routing, Wireshark packet analysis.

#### 2. Security Fundamentals & Defenses (Weeks 9 - 16)
- **Concepts**: Cryptography, Firewalls, OWASP Top 10 web vulnerabilities, IAM.
- **SIEM Tools**: Splunk, Elastic Security, Logstash.

#### 3. Offensive Security & Penetration Testing (Weeks 17 - 24)
- **Tools**: Nmap, Metasploit, Burp Suite, John the Ripper, Hydra.
- **Scripting**: Python & Bash automation.

#### 4. Industry Certifications
- CompTIA Security+, Certified Ethical Hacker (CEH), OSCP (Offensive Security Certified Professional).

💰 **Average Salary**: $90,000 – $165,000/year.`
  },
  {
    keywords: ['ui ux', 'graphic design', 'become designer', 'figma', 'design system'],
    question: 'How do I become a UI/UX Designer?',
    answer: `### 🎨 UI/UX & Product Design Mastery Blueprint

#### 1. Design Principles & User Research
- **Foundations**: Typography, Color Theory, Grid Systems, Information Architecture.
- **Research**: User personas, journey mapping, usability testing.

#### 2. Industry Tooling
- **Primary Tool**: Figma (Auto-layout, Components, Variants, Design Systems).
- **Prototyping**: Framer, Protopie, Adobe XD.

#### 3. Portfolio & Case Studies
- Build 3 complete ATS-ready case studies highlighting problem definition, wireframes, iteration, and final interactive prototypes.

💰 **Average Salary**: $75,000 – $140,000/year.`
  },
  {
    keywords: ['cloud architect', 'devops', 'aws', 'docker', 'kubernetes'],
    question: 'How do I become a Cloud Architect or DevOps Engineer?',
    answer: `### ☁️ Cloud & DevOps Engineering Roadmap (2025)

#### 1. Linux & Infrastructure as Code (IaC)
- **Linux**: Command line, SSH, Shell Scripting.
- **IaC**: Terraform, Ansible, CloudFormation.

#### 2. Containerization & Orchestration
- **Docker**: Container images, Docker Compose.
- **Kubernetes**: Pods, Services, Ingress, Helm charts.

#### 3. Public Cloud Providers
- AWS (Solutions Architect), Google Cloud Platform (GCP), or Azure.

💰 **Average Salary**: $110,000 – $210,000/year.`
  },
  {
    keywords: ['ats resume', 'resume tips', 'prepare interview', 'job application'],
    question: 'How do I write an ATS-friendly resume for tech jobs?',
    answer: `### 📝 Top 5 ATS-Friendly Resume Best Practices

1. **Use Single-Column Layouts**: Avoid tables, graphic bars, or custom icons that break ATS parsers.
2. **Include Action Verbs & Metrics**: Example: *"Engineered REST APIs reducing latency by 45% using Node.js & Redis."*
3. **Target Relevant Keywords**: Match key terms directly from the job description in your Skills section.
4. **Standard File Format**: Export as clean text-searchable PDF.
5. **Add GitHub & Portfolio Links**: Place live links prominently at the top.`
  }
];

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const userId = req.user._id || req.user.id || 'usr-101';
    const query = message.toLowerCase().trim();

    // Fetch user profile & database context if available
    let profile = null;
    let topCareers = [];
    try {
      profile = await Profile.findOne({ userId });
      topCareers = await Career.find().select('title domain expectedSalaryRange demandLevel').limit(10);
    } catch (e) {}

    let chatLog = null;
    try {
      chatLog = await ChatLog.findOne({ userId });
    } catch (e) {}

    if (!chatLog) {
      chatLog = new ChatLog({ userId, messages: [] });
    }

    // Save user message to log
    chatLog.messages.push({ role: 'user', text: message });

    let aiResponseText = '';

    // 1. Direct Knowledge Base Lookup (Check pre-stored DB answers first)
    const matchedKbItem = STORED_KNOWLEDGE_BASE.find(item =>
      item.keywords.some(kw => query.includes(kw))
    );

    if (matchedKbItem) {
      aiResponseText = matchedKbItem.answer;
    }

    // 2. Fallback to Gemini AI Engine if API key is provided and no exact KB match
    if (!aiResponseText && process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const candidateModels = ['gemini-3.6-flash'];

        const systemPrompt = `You are PathSeeker AI, an expert Career Guidance Advisor.
User Name: ${req.user.name || 'Explorer'}
User Role: ${req.user.role || 'student'}
Provide clean markdown formatting with bullet points and bold headers. Keep answers structured, encouraging, and actionable.`;

        for (const modelName of candidateModels) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
            const response = await result.response;
            aiResponseText = response.text();
            if (aiResponseText) break;
          } catch (err) {}
        }
      } catch (err) {}
    }

    // 3. Fallback to General Smart Advisor
    if (!aiResponseText) {
      aiResponseText = `### PathSeeker AI Career Guidance 🎯

Hello **${req.user.name || 'Explorer'}**! Here are recommended steps for your career path:

- **1. Take our AI Interest Assessment Quiz**: Determine your RIASEC score and match percentages across 1,000+ tech streams.
- **2. Explore Detailed Roadmaps**: Visit our **Career Bank** (`/careers`) to view step-by-step learning stages, skill checklists, and salary progressions.
- **3. Master Technical Tools**: Watch 150+ video masterclasses in our **Multimedia Hub** (`/multimedia`).
- **4. Download ATS Toolkits**: Access free resume templates and interview guides in our **Resource Vault** (`/resources`).

*Feel free to ask about Software Engineering, Cybersecurity, AI/ML, Data Science, or Resume Tips!*`;
    }

    // Save AI response to chat log
    chatLog.messages.push({ role: 'model', text: aiResponseText });
    try {
      await chatLog.save();
    } catch (e) {}

    res.json({
      success: true,
      response: aiResponseText,
      chatLog: chatLog.messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    let chatLog = null;
    try {
      chatLog = await ChatLog.findOne({ userId: req.user._id || req.user.id });
    } catch (e) {}

    res.json({ success: true, messages: chatLog ? chatLog.messages : [] });
  } catch (error) {
    next(error);
  }
};

export const clearChatHistory = async (req, res, next) => {
  try {
    try {
      await ChatLog.findOneAndDelete({ userId: req.user._id || req.user.id });
    } catch (e) {}
    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (error) {
    next(error);
  }
};
