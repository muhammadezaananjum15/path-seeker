import express from 'express';
import {
  getCareers,
  getCareerById,
  getTrendingCareers,
  getAiCareerAdvisor,
  createCareer,
  updateCareer,
  deleteCareer,
} from '../controllers/careerController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.get('/', getCareers);
router.get('/trending', getTrendingCareers);
router.post('/ai-advisor', getAiCareerAdvisor);
router.get('/:id', getCareerById);

// Admin-only management routes
router.post('/', authMiddleware, roleMiddleware('admin'), createCareer);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateCareer);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCareer);

export default router;
