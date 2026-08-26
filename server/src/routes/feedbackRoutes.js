import express from 'express';
import { submitFeedback, adminGetFeedback, adminUpdateFeedbackStatus } from '../controllers/feedbackController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.post('/', submitFeedback);

// Admin routes
router.get('/admin', authMiddleware, roleMiddleware('admin'), adminGetFeedback);
router.patch('/admin/:id/status', authMiddleware, roleMiddleware('admin'), adminUpdateFeedbackStatus);

export default router;
