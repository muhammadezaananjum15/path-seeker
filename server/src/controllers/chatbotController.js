import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatLog } from '../models/ChatLog.js';
import { Profile } from '../models/Profile.js';
import { Career } from '../models/Career.js';

// ─── PathSeeker System Prompt Builder ──────────────────────────────────────────
const buildSystemPrompt = ({ userName, userRole, careers, profileBio, profileSkills }) => {
  const careerList = careers.length > 0
    ? careers.map(c => `- ${c.title} (${c.domain}) — Salary: $${c.expectedSalaryRange?.min?.toLocaleString() || '60k'}–$${c.expectedSalaryRange?.max?.toLocaleString() || '140k'}`).join('\n')
    : '- Software Developer\n- Data Scientist\n- UI/UX Designer\n- Cybersecurity Analyst\n- Cloud Engineer';

  const skills = profileSkills && profileSkills.length > 0
    ? `User's existing skills: ${profileSkills.join(', ')}`
    : '';

  const bio = profileBio ? `User bio: ${profileBio}` : '';

  return `You are PathSeeker AI, an elite Career Guidance Advisor and Technology Strategist for the PathSeeker platform.

User Profile:
- Name: ${userName}
- Role: ${userRole}
${bio}
${skills}

PathSeeker's Live Career Bank (available career paths):
${careerList}

Instructions:
- Give structured, personalized, actionable career guidance using markdown formatting.
- Use bold headers (###), bullet points, and numbered lists for clarity.
- Reference specific PathSeeker platform features when relevant (/careers, /quiz, /resources, /multimedia).
- Include realistic salary ranges and skill timelines where appropriate.
- Be encouraging but realistic — give honest assessments.
- Keep responses comprehensive but scannable (not a wall of text).
- Always end with 1-2 specific next steps the user can take TODAY.

Respond only about career guidance, education paths, skill development, job market trends, resume tips, interview preparation, and tech industry insights.`;
};

// ─── Send Message — Always Uses Gemini Live API ─────────────────────────────
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please add GEMINI_API_KEY to your environment.',
      });
    }

    const userId = req.user._id || req.user.id;
    const userName = req.user.name || 'Explorer';
    const userRole = req.user.role || 'student';

    // ── Fetch user profile and career context from MongoDB ──────────────────
    let profileBio = '';
    let profileSkills = [];
    let topCareers = [];

    try {
      const profile = await Profile.findOne({ userId });
      if (profile) {
        profileBio = profile.bio || '';
        profileSkills = profile.skills || [];
      }
    } catch (e) { /* non-blocking */ }

    try {
      topCareers = await Career.find({})
        .select('title domain expectedSalaryRange')
        .limit(12)
        .lean();
    } catch (e) { /* non-blocking */ }

    // ── Fetch or create chat log ─────────────────────────────────────────────
    let chatLog = null;
    try {
      chatLog = await ChatLog.findOne({ userId });
    } catch (e) { /* non-blocking */ }

    if (!chatLog) {
      chatLog = new ChatLog({ userId, messages: [] });
    }

    // ── Save user message ────────────────────────────────────────────────────
    chatLog.messages.push({ role: 'user', text: message });

    // ── Build conversation history for Gemini ────────────────────────────────
    const recentMessages = chatLog.messages.slice(-12); // last 6 turns
    const history = recentMessages.slice(0, -1).map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // ── Call Gemini API ──────────────────────────────────────────────────────
    const systemPrompt = buildSystemPrompt({ userName, userRole, careers: topCareers, profileBio, profileSkills });
    let aiResponseText = '';

    const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-pro'];

    for (const modelName of candidateModels) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        let result;
        if (history.length > 0) {
          // Multi-turn conversation
          const chat = model.startChat({ history });
          result = await chat.sendMessage(message);
        } else {
          result = await model.generateContent(message);
        }

        const response = await result.response;
        aiResponseText = response.text();

        if (aiResponseText && aiResponseText.trim()) break;
      } catch (modelErr) {
        // Try next model
      }
    }

    if (!aiResponseText || !aiResponseText.trim()) {
      aiResponseText = `### PathSeeker AI is temporarily unavailable 🔧\n\nI'm experiencing a brief service interruption. Please try again in a moment.\n\nIn the meantime, you can:\n- **Explore Career Paths**: Browse our comprehensive roadmaps at [/careers](/careers)\n- **Take the Assessment Quiz**: Get instant recommendations at [/quiz](/quiz)\n- **Download Resources**: Access free ATS resume templates at [/resources](/resources)`;
    }

    // ── Save AI response to MongoDB ──────────────────────────────────────────
    chatLog.messages.push({ role: 'model', text: aiResponseText });

    try {
      await chatLog.save();
    } catch (saveErr) { /* non-blocking, still return response */ }

    res.json({
      success: true,
      response: aiResponseText,
      chatLog: chatLog.messages,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Chat History ────────────────────────────────────────────────────────
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let chatLog = null;
    try {
      chatLog = await ChatLog.findOne({ userId });
    } catch (e) { /* non-blocking */ }

    res.json({ success: true, messages: chatLog ? chatLog.messages : [] });
  } catch (error) {
    next(error);
  }
};

// ─── Clear Chat History ──────────────────────────────────────────────────────
export const clearChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    try {
      await ChatLog.findOneAndDelete({ userId });
    } catch (e) { /* non-blocking */ }

    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (error) {
    next(error);
  }
};
