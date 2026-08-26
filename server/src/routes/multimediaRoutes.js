import express from 'express';
import {
  getMedia,
  getMediaById,
  searchYouTube,
  rateMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from '../controllers/multimediaController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.get('/', getMedia);
router.get('/youtube/search', searchYouTube);
router.get('/:id', getMediaById);
router.post('/:id/rate', authMiddleware, rateMedia);

// Admin-only management
router.post('/', authMiddleware, roleMiddleware('admin'), createMedia);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateMedia);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteMedia);

export default router;
