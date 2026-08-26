import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCache, setCache } from '../utils/cache.js';
import axios from 'axios';

const HTTP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
};

export const getArticles = async (req, res, next) => {
  try {
    const { category, search, role } = req.query;
    const cacheKey = `articles_${category || 'all'}_${search || 'none'}_${role || 'all'}`;
    const cachedResult = getCache(cacheKey);

    if (cachedResult) {
      return res.json({ success: true, source: 'cache', articles: cachedResult });
    }

    // 1. Try Blogger API if configured
    const blogId = process.env.BLOGGER_BLOG_ID;
    const bloggerKey = process.env.BLOGGER_API_KEY;

    if (blogId && bloggerKey && !blogId.includes('your_') && !bloggerKey.includes('your_')) {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${bloggerKey}&maxResults=12&fetchBodies=true&status=LIVE`,
          { headers: HTTP_HEADERS, timeout: 5000 }
        );
        if (response.data?.items?.length > 0) {
          const posts = response.data.items.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            snippet: post.content.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...',
            url: post.url,
            published: post.published,
            author: post.author?.displayName || 'PathSeeker Editorial',
            category: 'Blog Article',
            readTime: '5 min read',
            imageUrl:
              post.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
          }));
          setCache(cacheKey, posts, 14400);
          return res.json({ success: true, source: 'blogger', articles: posts });
        }
      } catch (err) {
        console.warn('[Blogger API Fetch Warning]', err.message);
      }
    }

    // 2. Dev.to Public REST API with proper User-Agent header
    try {
      const devTag = search
        ? encodeURIComponent(search)
        : category === 'Resume & CV'
        ? 'career'
        : category === 'Interview Prep'
        ? 'interview'
        : 'career';

      const devRes = await axios.get(
        `https://dev.to/api/articles?tag=${devTag}&per_page=12`,
        { headers: HTTP_HEADERS, timeout: 6000 }
      );

      if (Array.isArray(devRes.data) && devRes.data.length > 0) {
        const devArticles = devRes.data.map((item) => ({
          id: `devto-${item.id}`,
          title: item.title,
          snippet: item.description || item.title,
          content: `${item.description || item.title}\n\nRead the full detailed post on Dev.to: ${item.url}`,
          url: item.url,
          published: item.published_at || new Date().toISOString(),
          author: item.user?.name || item.user?.username || 'Dev.to Tech Author',
          category: item.tag_list?.includes('interview')
            ? 'Interview Prep'
            : item.tag_list?.includes('resume')
            ? 'Resume & CV'
            : item.tag_list?.includes('guide')
            ? 'Career Guides'
            : 'Industry Insights',
          readTime: `${item.reading_time_minutes || 5} min read`,
          imageUrl:
            item.cover_image ||
            item.social_image ||
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        }));

        setCache(cacheKey, devArticles, 7200);
        return res.json({ success: true, source: 'devto', articles: devArticles });
      }
    } catch (devErr) {
      console.warn('[Dev.to API Warning]', devErr.message);
    }

    // 3. Try Tavily for live industry blogs if key available
    const tavilyKey = process.env.TAVILY_API_KEY;
    if (tavilyKey && !tavilyKey.includes('your_') && !tavilyKey.includes('xxx')) {
      try {
        const tQuery = search || category || 'tech career hiring software engineering 2025';
        const tRes = await axios.post(
          'https://api.tavily.com/search',
          { api_key: tavilyKey, query: tQuery, search_depth: 'basic', max_results: 8 },
          { headers: HTTP_HEADERS, timeout: 5000 }
        );
        if (tRes.data?.results?.length > 0) {
          const tavilyArticles = tRes.data.results.map((item) => ({
            id: `tavily-${item.url.replace(/[^a-z0-9]/gi, '').substring(0, 20)}`,
            title: item.title,
            snippet: (item.content || '').substring(0, 200),
            url: item.url,
            published: item.published_date || new Date().toISOString(),
            author: (() => {
              try {
                return new URL(item.url).hostname.replace('www.', '');
              } catch {
                return 'Career Portal';
              }
            })(),
            category: 'Industry Insights',
            readTime: '4 min read',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
          }));
          setCache(cacheKey, tavilyArticles, 7200);
          return res.json({ success: true, source: 'tavily', articles: tavilyArticles });
        }
      } catch (err) {
        console.warn('[Tavily Articles Warning]', err.message);
      }
    }

    // 4. High-quality curated articles fallback
    const articles = [
      {
        id: 'art-1',
        title: 'Navigating Tech Careers in 2025: AI, Cloud, and Beyond',
        snippet: 'Understand how emerging technologies like Generative AI, LLMs, and Cloud Native architecture are reshaping software engineering roles worldwide.',
        content: `The technology landscape in 2025 is evolving faster than ever. Generative AI tools are becoming standard copilots for developers, while cloud infrastructure management demands expertise in Kubernetes, serverless architectures, and DevSecOps.\n\nKey Skills to Focus On:\n1. Artificial Intelligence & Machine Learning Integration\n2. Cloud Architecture (AWS, Azure, GCP)\n3. Full-Stack Web Development with React, Node, and TypeScript\n4. System Design & Microservices Security`,
        author: 'PathSeeker Editorial Team',
        published: new Date().toISOString(),
        category: 'Industry Insights',
        readTime: '6 min read',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        url: null,
      },
      {
        id: 'art-2',
        title: '10 High-Growth Careers That Do Not Require a CS Degree',
        snippet: 'Explore lucrative career paths in UX design, product marketing, data analysis, and tech sales that focus on skills over formal degrees.',
        content: `You don't need a Computer Science degree to thrive in tech. Today's top tech companies prioritize portfolios, problem-solving skills, and practical project experience over traditional university degrees.\n\nTop Non-CS High-Growth Roles:\n- UI/UX Designer\n- Product Manager\n- Data Analyst\n- Technical Writer`,
        author: 'Sarah Jenkins, Career Specialist',
        published: new Date(Date.now() - 86400000 * 2).toISOString(),
        category: 'Career Guides',
        readTime: '8 min read',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        url: null,
      },
      {
        id: 'art-3',
        title: 'Mastering the Behavioral Interview: STAR Method Explained',
        snippet: 'A step-by-step breakdown with real-world examples on answering behavioral interview questions confidently for top global companies.',
        content: `Behavioral interview questions evaluate how you handled past situations to predict your future performance. The STAR method provides a structured framework: Situation, Task, Action, Result.`,
        author: 'David Vance, Former Tech Recruiter',
        published: new Date(Date.now() - 86400000 * 5).toISOString(),
        category: 'Interview Prep',
        readTime: '5 min read',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        url: null,
      },
      {
        id: 'art-4',
        title: 'Resume Tips 2025: How to Pass ATS Scanners Easily',
        snippet: 'Learn how Applicant Tracking Systems parse resumes and formatting strategies to get your CV shortlisted by hiring managers.',
        content: `Over 90% of Fortune 500 companies use Applicant Tracking Systems (ATS) to screen resumes. Optimize formatting and section headers.`,
        author: 'Aya Khan, HR Advisor',
        published: new Date(Date.now() - 86400000 * 7).toISOString(),
        category: 'Resume & CV',
        readTime: '7 min read',
        imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
        url: null,
      },
      {
        id: 'art-5',
        title: 'Cloud Architecture & DevOps: 2025 Industry Roadmap',
        snippet: 'AWS, Azure, GCP and Docker certifications are among the most sought-after credentials in 2025. Learn the required skills.',
        content: `Cloud architects and DevOps engineers manage the infrastructure powering modern web applications. Focus on Linux, Docker, Kubernetes, and CI/CD automation.`,
        author: 'PathSeeker Editorial Team',
        published: new Date(Date.now() - 86400000 * 9).toISOString(),
        category: 'Industry Insights',
        readTime: '9 min read',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        url: null,
      },
      {
        id: 'art-6',
        title: 'Product Management Strategy & Growth Metrics',
        snippet: 'Product Managers command $120,000+ salaries. Learn how to define product roadmaps, write PRDs, and run agile sprints.',
        content: `Product Management bridges user needs, engineering execution, and business strategy. Master user research, analytics, and agile frameworks.`,
        author: 'PathSeeker Product Desk',
        published: new Date(Date.now() - 86400000 * 11).toISOString(),
        category: 'Career Guides',
        readTime: '6 min read',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
        url: null,
      },
    ];

    let filtered = articles;
    if (category && category !== 'All') {
      filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.snippet.toLowerCase().includes(search.toLowerCase())
      );
    }

    setCache(cacheKey, filtered, 14400);
    res.json({ success: true, source: 'curated', articles: filtered });
  } catch (error) {
    next(error);
  }
};

export const generateAiArticle = async (req, res, next) => {
  try {
    const { topic, userRole = 'Student', targetCareer } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic query is required for AI generation.' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey.includes('your_')) {
      return res.json({
        success: true,
        source: 'fallback',
        article: {
          id: `ai-gen-${Date.now()}`,
          title: `Career Strategy Guide: ${topic}`,
          category: 'Career Intelligence',
          readTime: '5 min read',
          snippet: `A comprehensive guide to navigating ${topic} for ${userRole}s in 2025.`,
          content: `## ${topic} — Career Roadmap for ${userRole}s\n\nThis guide covers essential skills, salary benchmarks, and growth pathways for ${topic}.\n\n### Core Competencies\n- Technical foundation & tool mastery\n- Analytical problem-solving\n- Portfolio development\n\n### Salary Benchmarks\n- Entry Level: $65,000 - $95,000/yr\n- Mid-Senior: $95,000 - $150,000+/yr`,
          keyTakeaways: ['Build real-world portfolio projects', 'Master core technical fundamentals', 'Network with industry leaders'],
          recommendedSkills: ['Problem Solving', 'Technical Expertise', 'Communication'],
          author: 'PathSeeker AI',
          published: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        },
      });
    }

    const prompt = `You are an expert career counsellor and industry writer for PathSeeker.
Generate a comprehensive, engaging, highly structured career insight blog article on the topic: "${topic}".
Target Audience: ${userRole} (e.g. Student, Graduate, or Working Professional).
${targetCareer ? `Focus Career: ${targetCareer}` : ''}

Respond ONLY with a valid JSON object matching this structure (no extra markdown codeblocks):
{
  "title": "Compelling Title Here",
  "category": "Career Insights",
  "readTime": "5 min read",
  "snippet": "A brief 2-sentence summary highlighting the core takeaways.",
  "content": "Detailed markdown formatted article content with sections, key bullet points, and salary/growth projections.",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "recommendedSkills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

    const genAI = new GoogleGenerativeAI(geminiKey);
    const candidateModels = ['gemini-3.6-flash'];
    let text = '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text().trim();
        if (text) break;
      } catch (err) {
        console.warn(`[Gemini Model ${modelName} Warning]`, err.message);
      }
    }

    if (!text) {
      return res.json({
        success: true,
        source: 'fallback',
        article: {
          id: `ai-gen-${Date.now()}`,
          title: `Career Guide: ${topic}`,
          category: 'AI Guidance',
          readTime: '5 min read',
          snippet: `AI-generated career insights for ${topic}.`,
          content: `## Strategy Guide: ${topic}\n\nBuild foundational projects, master core technical concepts, and connect with industry mentors.`,
          keyTakeaways: ['Focus on portfolio execution', 'Stay consistent with daily learning'],
          recommendedSkills: ['Technical Fundamentals', 'Agile Workflow'],
          author: 'PathSeeker AI',
          published: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        },
      });
    }

    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    try {
      const parsedArticle = JSON.parse(text);
      parsedArticle.id = `ai-gen-${Date.now()}`;
      parsedArticle.author = 'PathSeeker AI Career Intelligence';
      parsedArticle.published = new Date().toISOString();
      parsedArticle.imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

      return res.json({ success: true, article: parsedArticle });
    } catch (parseErr) {
      return res.json({
        success: true,
        article: {
          id: `ai-gen-${Date.now()}`,
          title: `Career Guide: ${topic}`,
          category: 'AI Guidance',
          readTime: '4 min read',
          snippet: `AI-generated career insights for ${topic}.`,
          content: text,
          keyTakeaways: ['Build hands-on projects', 'Tailor resume for target roles'],
          recommendedSkills: ['Problem Solving', 'Domain Expertise'],
          author: 'PathSeeker Gemini AI',
          published: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
