import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();

const generateGeminiText = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = ['gemini-3.6-flash'];
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response?.text()?.trim();
      if (text) return text;
    } catch (err) {
      console.warn(`[Gemini Model ${modelName} Warning]`, err.message);
    }
  }
  return null;
};

// GET /api/gemini/career-tip — Daily AI career tip
router.get('/career-tip', async (req, res) => {
  try {
    const cacheKey = `gemini_career_tip_${new Date().toDateString()}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json({ success: true, source: 'cache', tip: cached });

    const prompt = `Generate a powerful, actionable career tip of the day for students and professionals in tech, design, or business. 
    Keep it under 80 words. Make it inspiring and practical. 
    Format: Just the tip text, no title or label needed. Start directly with an action verb or insight.`;

    const tip = await generateGeminiText(prompt);
    if (!tip) {
      return res.json({
        success: true,
        source: 'fallback',
        tip: 'Start building your personal brand today. Update your LinkedIn profile, contribute to open-source projects, and write one article per month about your field. Consistency beats intensity in career building.',
      });
    }

    setCache(cacheKey, tip, 86400); // Cache for 24 hours
    res.json({ success: true, source: 'live', tip });
  } catch (error) {
    console.error('[Gemini Career Tip Error]', error.message);
    res.json({
      success: true,
      source: 'fallback',
      tip: 'Network your way to your next role: attend one industry event or webinar per month, connect with 3 new professionals on LinkedIn weekly, and follow up within 24 hours. Relationships are your greatest career asset.',
    });
  }
});

// POST /api/gemini/analyze — General AI analysis
router.post('/analyze', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    const fullPrompt = context ? `Context: ${context}\n\nRequest: ${prompt}` : prompt;
    const text = await generateGeminiText(fullPrompt);

    if (!text) {
      const fallbackResult = `Based on your profile and interest in tech, design, and software development: Your analytical strengths, problem-solving skills, and technical curiosity make Software Engineering, Data Science, and Product Management ideal high-growth paths for 2025.`;
      return res.json({ success: true, source: 'fallback', result: fallbackResult });
    }

    res.json({ success: true, result: text });
  } catch (error) {
    console.error('[Gemini Analyze Error]', error.message);
    res.json({
      success: true,
      source: 'fallback',
      result: 'Your analytical aptitude, programming fundamentals, and technical problem-solving skills make software development, AI engineering, and cybersecurity ideal high-growth paths.',
    });
  }
});

// GET /api/gemini/career-roadmap?role=developer
router.get('/career-roadmap', async (req, res) => {
  try {
    const { role = 'software developer', level = 'beginner' } = req.query;
    const cacheKey = `gemini_roadmap_${role.toLowerCase().replace(/\s+/g, '_')}_${level}`;

    const cached = getCache(cacheKey);
    if (cached) return res.json({ success: true, source: 'cache', roadmap: cached });

    const prompt = `Create a concise 6-month career roadmap for a ${level} ${role}. 
    Format as JSON with this structure:
    { "months": [ { "month": 1, "focus": "title", "skills": ["skill1","skill2"], "milestone": "milestone text" } ] }
    Keep each entry brief. Return only valid JSON.`;

    let text = await generateGeminiText(prompt);

    const defaultRoadmap = {
      months: [
        { month: 1, focus: 'Foundations & Problem Solving', skills: ['Git', 'Data Structures', 'Basic Syntax'], milestone: 'Build 2 mini algorithmic projects' },
        { month: 2, focus: 'Core Framework & Frontend', skills: ['React/Next.js', 'State Management', 'TailwindCSS'], milestone: 'Deploy responsive SPA dashboard' },
        { month: 3, focus: 'Backend & Database Architecture', skills: ['Node.js', 'Express', 'MongoDB/SQL'], milestone: 'Build RESTful backend with Auth & CRUD' },
        { month: 4, focus: 'Full-Stack Integration', skills: ['API Integration', 'Authentication', 'State Sync'], milestone: 'Deploy full-stack MERN application' },
        { month: 5, focus: 'Testing & DevOps', skills: ['Docker', 'CI/CD Pipelines', 'Jest/Vitest'], milestone: 'Automate build & deployment pipelines' },
        { month: 6, focus: 'Interview Prep & Portfolio', skills: ['System Design', 'ATS Resume', 'Portfolio'], milestone: 'Land entry-level or junior role' },
      ],
    };

    if (!text) {
      return res.json({ success: true, source: 'fallback', roadmap: defaultRoadmap });
    }

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let roadmap;
    try {
      roadmap = JSON.parse(text);
    } catch {
      roadmap = defaultRoadmap;
    }

    setCache(cacheKey, roadmap, 3600); // 1 hour
    res.json({ success: true, source: 'live', roadmap });
  } catch (error) {
    console.error('[Gemini Roadmap Error]', error.message);
    res.json({
      success: true,
      source: 'fallback',
      roadmap: {
        months: [
          { month: 1, focus: 'Fundamentals', skills: ['Programming Basics', 'Git'], milestone: 'Complete beginner tutorial' },
          { month: 2, focus: 'Projects', skills: ['React', 'Node.js'], milestone: 'Build portfolio website' },
        ],
      },
    });
  }
});

// POST /api/gemini/generate-article — AI Career Article Generator
router.post('/generate-article', async (req, res) => {
  try {
    const { topic, userRole = 'Student', targetCareer } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required.' });
    }

    const fallbackArticle = {
      id: `ai-gen-${Date.now()}`,
      title: `Career Strategy Guide: ${topic}`,
      category: 'Career Intelligence',
      readTime: '5 min read',
      snippet: `A comprehensive guide to navigating ${topic} for ${userRole}s in 2025.`,
      content: `## ${topic} — Career Roadmap for ${userRole}s\n\nThis guide covers the essential skills, salary benchmarks, and career progression pathways for ${topic}.\n\n### Key Skills Required\n- Technical proficiency in core tools\n- Communication and collaboration skills\n- Problem-solving and analytical thinking\n\n### Career Growth Path\n1. Entry Level (0-2 years): Build foundational skills\n2. Mid Level (2-5 years): Specialize and lead small teams\n3. Senior Level (5+ years): Strategic leadership and mentorship\n\n### Salary Benchmarks (2025)\n- Entry: $60,000 - $90,000/year\n- Mid-Level: $90,000 - $130,000/year\n- Senior: $130,000 - $200,000+/year`,
      keyTakeaways: ['Build core technical skills', 'Network consistently', 'Stay updated with industry trends'],
      recommendedSkills: ['Communication', 'Problem Solving', 'Technical Expertise'],
      author: 'PathSeeker Career Intelligence',
      published: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    };

    const prompt = `You are an expert career counsellor for PathSeeker. Generate a detailed career insight article on: "${topic}" for ${userRole}s.${targetCareer ? ` Focus on: ${targetCareer}` : ''}

Respond with ONLY a valid JSON object (no markdown):
{
  "title": "Engaging title here",
  "category": "Career Intelligence",
  "readTime": "5 min read",
  "snippet": "2-sentence summary",
  "content": "Full markdown article with sections and bullet points",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "recommendedSkills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

    let text = await generateGeminiText(prompt);
    if (!text) {
      return res.json({ success: true, source: 'fallback', article: fallbackArticle });
    }

    text = text.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();

    try {
      const article = JSON.parse(text);
      article.id = `ai-gen-${Date.now()}`;
      article.author = 'PathSeeker AI Career Intelligence';
      article.published = new Date().toISOString();
      article.imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
      return res.json({ success: true, source: 'live', article });
    } catch {
      return res.json({
        success: true,
        source: 'live',
        article: {
          id: `ai-gen-${Date.now()}`,
          title: `Career Guide: ${topic}`,
          category: 'AI Guidance',
          readTime: '4 min read',
          snippet: `AI-powered career insights for ${topic}.`,
          content: text,
          author: 'PathSeeker Gemini AI',
          published: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        },
      });
    }
  } catch (error) {
    console.error('[Gemini Generate Article Error]', error.message);
    res.status(500).json({ success: false, message: 'Article generation failed.' });
  }
});

export default router;
