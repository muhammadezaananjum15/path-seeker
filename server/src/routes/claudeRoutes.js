import express from 'express';
import axios from 'axios';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();

const getClaudeResponse = async (prompt, systemInstruction = '') => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey.includes('your_') || apiKey === 'YOUR_CLAUDE_API_KEY') {
    return null;
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemInstruction || 'You are Claude, a senior career mentor and counselor for the PathSeeker Career Passport platform.',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 15000,
      }
    );

    if (response.data && response.data.content && response.data.content[0]) {
      return response.data.content[0].text;
    }
  } catch (error) {
    console.warn('[Claude API Call Notice]:', error.response?.data?.error?.message || error.message);
  }
  return null;
};

// GET /api/claude/status
router.get('/status', (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const configured = Boolean(apiKey && !apiKey.includes('your_'));
  res.json({
    success: true,
    provider: 'Anthropic Claude',
    model: 'claude-3-5-sonnet',
    configured,
  });
});

// POST /api/claude/career-guidance
router.post('/career-guidance', async (req, res) => {
  try {
    const { prompt, userRole = 'Student', userDomain = 'Technology' } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    const systemInstruction = `You are Anthropic Claude 3.5 Sonnet acting as a high-precision career strategy coach for PathSeeker users (${userRole} in ${userDomain}). Provide inspiring, actionable advice.`;
    const claudeResult = await getClaudeResponse(prompt, systemInstruction);

    if (claudeResult) {
      return res.json({ success: true, provider: 'claude', result: claudeResult });
    }

    // Dynamic intelligent fallback response if key not active
    const fallbackText = `**[Claude 3.5 Career Insight]** For a ${userRole} focusing on ${userDomain}:
1. **Skill Primacy**: Focus on hands-on project portfolio over passive theory.
2. **Industry Alignment**: Study top job descriptions in your domain and build 2 real-world projects matching their tech stack.
3. **Networking**: Connect with 3 practitioners weekly and request informational interviews.`;

    return res.json({ success: true, provider: 'claude-fallback', result: fallbackText });
  } catch (error) {
    console.error('[Claude Route Error]', error);
    res.status(500).json({ success: false, message: 'Failed to query Claude AI engine.' });
  }
});

// POST /api/claude/generate
router.post('/generate', async (req, res) => {
  try {
    const { topic, promptType = 'article', role = 'Student' } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required.' });
    }

    const prompt = `Generate a comprehensive ${promptType} about "${topic}" tailored for a ${role}. Include key skills, learning roadmap, and expected career trajectory. Use Markdown formatting.`;
    const claudeResult = await getClaudeResponse(prompt);

    if (claudeResult) {
      return res.json({ success: true, provider: 'claude', article: { title: `Career Mastery: ${topic}`, content: claudeResult } });
    }

    const fallbackArticle = {
      title: `Career Guide: ${topic}`,
      content: `### Mastering ${topic} in 2025\n\n**Overview:**\n${topic} represents one of the highest growing domains today. To excel as a ${role}, master core principles, contribute to open-source or portfolio projects, and acquire certifications.\n\n**30-Day Action Plan:**\n- **Week 1:** Fundamentals & Tooling setup\n- **Week 2:** Build initial functional prototype\n- **Week 3:** Refactor & optimize performance\n- **Week 4:** Publish live demo and document learnings`,
    };

    return res.json({ success: true, provider: 'claude-fallback', article: fallbackArticle });
  } catch (error) {
    console.error('[Claude Generate Error]', error);
    res.status(500).json({ success: false, message: 'Generation failed.' });
  }
});

export default router;
