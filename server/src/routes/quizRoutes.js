import express from 'express';
import {
  getQuestions,
  submitQuiz,
  getQuizHistory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/quizController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/submit', authMiddleware, submitQuiz);
router.get('/history', authMiddleware, getQuizHistory);

// Admin-only question management
router.post('/questions', authMiddleware, roleMiddleware('admin'), createQuestion);
router.put('/questions/:id', authMiddleware, roleMiddleware('admin'), updateQuestion);
router.delete('/questions/:id', authMiddleware, roleMiddleware('admin'), deleteQuestion);

export default router;
