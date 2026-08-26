import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.patch('/read-all', markAsRead);

export default router;
