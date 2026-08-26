import { Bookmark } from '../models/Bookmark.js';
import { generateBookmarksPDF } from '../utils/pdfGenerator.js';

export const getBookmarks = async (req, res, next) => {
  try {
    const { itemType } = req.query;
    const filter = { userId: req.user._id };
    if (itemType) filter.itemType = itemType;

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, bookmarks });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId, title, category, note } = req.body;

    const existing = await Bookmark.findOne({ userId: req.user._id, itemType, itemId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Item is already bookmarked.' });
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      itemType,
      itemId,
      title,
      category: category || 'General',
      note: note || '',
    });

    res.status(201).json({ success: true, message: 'Bookmark added!', bookmark });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Bookmark.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ success: true, message: 'Bookmark removed.' });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { note },
      { new: true }
    );

    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found.' });
    }

    res.json({ success: true, message: 'Note updated!', bookmark });
  } catch (error) {
    next(error);
  }
};

export const exportBookmarksPDF = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });
    generateBookmarksPDF(req.user, bookmarks, res);
  } catch (error) {
    next(error);
  }
};
