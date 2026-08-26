import express from 'express';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  updateNote,
  exportBookmarksPDF,
} from '../controllers/bookmarkController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:id', removeBookmark);
router.patch('/:id/note', updateNote);
router.get('/export/pdf', exportBookmarksPDF);

export default router;
