import express from 'express';
import {
  getApprovedStories,
  getStoryById,
  submitStory,
  adminGetStories,
  adminCreateStory,
  adminUpdateStory,
  adminUpdateStoryStatus,
  adminDeleteStory,
} from '../controllers/storyController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.get('/', getApprovedStories);
router.get('/:id', getStoryById);
router.post('/submit', authMiddleware, submitStory);

// Admin routes
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), adminGetStories);
router.post('/admin/create', authMiddleware, roleMiddleware('admin'), adminCreateStory);
router.put('/admin/:id', authMiddleware, roleMiddleware('admin'), adminUpdateStory);
router.patch('/admin/:id/status', authMiddleware, roleMiddleware('admin'), adminUpdateStoryStatus);
router.delete('/admin/:id', authMiddleware, roleMiddleware('admin'), adminDeleteStory);

export default router;


