import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ─── Load .env FIRST — before any other imports that need env vars ────────────
const __filenameEnv = fileURLToPath(import.meta.url);
const __dirnameEnv = path.dirname(__filenameEnv);

// Priority 1: server/.env  (canonical — what the user edits)
dotenv.config({ path: path.resolve(__dirnameEnv, '..', '.env') });

const hasMongoUri = () =>
  Boolean(
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL
  );

// Priority 2: server/src/.env  (legacy mirror — kept for backward compat)
if (!hasMongoUri()) {
  dotenv.config({ path: path.join(__dirnameEnv, '.env') });
}

// Priority 3: project root .env  (last resort)
if (!hasMongoUri()) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// ─── Route Imports ────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import multimediaRoutes from './routes/multimediaRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import claudeRoutes from './routes/claudeRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import publicApiRoutes from './routes/publicApiRoutes.js';
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Startup: Validate critical env vars ──────────────────────────────────────
const warnMissing = (key) => {
  if (!process.env[key]) {
    console.warn(`[PathSeeker] ⚠️  Missing env var: ${key} — some features may be limited.`);
  }
};
if (!hasMongoUri()) {
  console.warn('[PathSeeker] ⚠️  Missing MongoDB URI env var (MONGO_URI / MONGODB_URI / MONGO_URL / DATABASE_URL).');
}
warnMissing('JWT_ACCESS_SECRET');
warnMissing('GEMINI_API_KEY');
warnMissing('YOUTUBE_API_KEY');
warnMissing('GOOGLE_SEARCH_API_KEY');
// ─────────────────────────────────────────────────────────────────────────────

// Connect to MongoDB
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from localhost, Vercel frontend, Railway, or custom CLIENT_URL
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// ─────────────────────────────────────────────────────────────────────────────

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'PathSeeker API is active',
    timestamp: new Date(),
    apis: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      youtube: Boolean(process.env.YOUTUBE_API_KEY),
      googleSearch: Boolean(process.env.GOOGLE_SEARCH_API_KEY),
      tavily: Boolean(process.env.TAVILY_API_KEY),
      claude: Boolean(
        process.env.ANTHROPIC_API_KEY &&
        !process.env.ANTHROPIC_API_KEY.includes('YOUR_')
      ),
    },
  });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/multimedia', multimediaRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/public-apis', publicApiRoutes);
// Serve Frontend Static Build in Production (Single Service on Railway)
const distPath = path.resolve(__dirname, '..', '..', 'dist');
try {
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[PathSeeker] Production static frontend attached from:', distPath);
  }
} catch (e) {
  console.warn('[PathSeeker Warning] Could not attach static frontend dist:', e.message);
}

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════════╗`);
  console.log(`║  PathSeeker API  →  http://localhost:${PORT}   ║`);
  console.log(`╚═══════════════════════════════════════════════╝\n`);
});
