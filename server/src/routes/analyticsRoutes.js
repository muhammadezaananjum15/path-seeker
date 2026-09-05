import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import {
  trackPageEnter,
  trackPageExit,
  trackLinkClick,
  trackQuizEvent,
  getUserDashboardStats,
} from '../controllers/analyticsController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// ── Rate Limiters to prevent bot flooding / runaway loops ─────────────────────
const pageEnterLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // max 120 page enter events per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many page tracking requests. Please slow down.' },
});

const pageExitLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many exit tracking requests.' },
});

const linkClickLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many link click tracking requests.' },
});

const quizEventLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many quiz event requests.' },
});

// ── Validation Helper Middleware ──────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ── Tracking Routes ───────────────────────────────────────────────────────────

// POST /api/analytics/page-enter
router.post(
  '/page-enter',
  pageEnterLimiter,
  authMiddleware,
  [
    body('page').isString().trim().notEmpty().withMessage('Page is required'),
  ],
  validate,
  trackPageEnter
);

// POST /api/analytics/page-exit (Beacon friendly — uses optionalAuth to support navigator.sendBeacon)
router.post(
  '/page-exit',
  pageExitLimiter,
  optionalAuth,
  trackPageExit
);

// POST /api/analytics/link-click
router.post(
  '/link-click',
  linkClickLimiter,
  authMiddleware,
  [
    body('url').isString().trim().notEmpty().withMessage('URL is required'),
    body('sourcePage').optional().isString(),
  ],
  validate,
  trackLinkClick
);

// POST /api/analytics/quiz-event
router.post(
  '/quiz-event',
  quizEventLimiter,
  authMiddleware,
  [
    body('score').optional().isNumeric(),
    body('status').optional().isIn(['not_started', 'in_progress', 'completed']),
  ],
  validate,
  trackQuizEvent
);

// GET /api/analytics/my-stats (Self-service user analytics dashboard)
router.get(
  '/my-stats',
  authMiddleware,
  getUserDashboardStats
);

export default router;
