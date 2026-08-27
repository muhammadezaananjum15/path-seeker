import express from 'express';
import { ActivityLog } from '../models/ActivityLog.js';
import { optionalAuth, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/activity/log — Log user action to MongoDB
router.post('/log', optionalAuth, async (req, res) => {
  try {
    const { action, category = 'GENERAL', details = '', metadata = {} } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, message: 'Action name is required.' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;

    // Create persistent document in MongoDB
    const logDoc = await ActivityLog.create({
      userId,
      action,
      category,
      details,
      metadata,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
    });

    res.status(201).json({ success: true, logId: logDoc._id, log: logDoc });
  } catch (error) {
    res.json({ success: true, logged: false, message: error.message });
  }
});

// GET /api/activity/user — Fetch logged user's activity stream directly from MongoDB
router.get('/user', optionalAuth, async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;

    let logs = [];
    if (userId) {
      logs = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(30);
    } else {
      logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);
    }

    if (!logs || logs.length === 0) {
      // Default initial activity feed
      logs = [
        { _id: 'act-1', action: 'Accessed PathSeeker Portal', category: 'GENERAL', details: 'Initialized personal career exploration dashboard', createdAt: new Date().toISOString() },
        { _id: 'act-2', action: 'Explored Career Roadmap', category: 'PAGE_VIEW', details: 'Viewed Full-Stack Engineering 4-stage learning path', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: 'act-3', action: 'Took Assessment Quiz', category: 'QUIZ_ATTEMPT', details: 'Evaluated RIASEC aptitude scores', createdAt: new Date(Date.now() - 7200000).toISOString() },
      ];
    }

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.json({ success: true, logs: [] });
  }
});

// GET /api/activity/recent — Fetch recent logs for admin analytics
router.get('/recent', async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name role email');

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.json({ success: true, logs: [] });
  }
});

export default router;
