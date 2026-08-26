import express from 'express';
import {
  getResources,
  downloadResource,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.get('/', getResources);
router.post('/:id/download', downloadResource);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), createResource);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateResource);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteResource);

export default router;
