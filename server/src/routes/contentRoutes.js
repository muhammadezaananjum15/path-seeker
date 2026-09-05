import express from 'express';
import {
  getPublicPublishedArticles,
  getContentById,
} from '../controllers/contentController.js';

const router = express.Router();

// GET /api/content — Get all published articles with search & pagination
router.get('/', getPublicPublishedArticles);

// GET /api/content/:id — Get a single article by ID
router.get('/:id', getContentById);

export default router;
