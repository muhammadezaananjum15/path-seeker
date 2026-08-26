import express from 'express';
import { getArticles, generateAiArticle } from '../controllers/articleController.js';

const router = express.Router();

router.get('/', getArticles);
router.post('/ai-generate', generateAiArticle);

export default router;
