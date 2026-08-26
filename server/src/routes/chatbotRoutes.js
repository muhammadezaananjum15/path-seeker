import express from 'express';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/chatbotController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/message', sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
