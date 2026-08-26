import express from 'express';
import { getProfile, updateProfile, uploadAvatar, uploadResume } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/resume', upload.single('resume'), uploadResume);

export default router;
