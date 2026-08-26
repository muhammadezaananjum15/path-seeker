import express from 'express';
import {
  getAnalyticsOverview,
  getUsers,
  updateUserRole,
  deleteUser,
  toggleBanUser,
  approveStory,
  rejectStory,
  getAllFeedback,
  updateFeedbackStatus,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/analytics', getAnalyticsOverview);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-ban', toggleBanUser);

// Story approval
router.patch('/stories/:id/approve', approveStory);
router.patch('/stories/:id/reject', rejectStory);

// Feedback management
router.get('/feedback', getAllFeedback);
router.patch('/feedback/:id/status', updateFeedbackStatus);

export default router;
