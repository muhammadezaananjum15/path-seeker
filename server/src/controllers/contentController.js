import { Content } from '../models/Content.js';

export const createContent = async (req, res, next) => {
  try {
    const { title, body, images, tags, status, category, readTimeMinutes } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required.' });
    }

    const authorId = req.user?._id || req.user?.id || null;

    const content = await Content.create({
      title,
      body,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      status: status || 'draft',
      category: category || 'Article',
      readTimeMinutes: Number(readTimeMinutes) || 5,
      author: authorId,
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully!',
      content,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContent = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', tag = '', sort = '-createdAt' } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [contentList, total] = await Promise.all([
      Content.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('author', 'name email role')
        .lean(),
      Content.countDocuments(query),
    ]);

    res.json({
      success: true,
      content: contentList,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    next(error);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id).populate('author', 'name email role');
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content item not found.' });
    }

    // Increment views counter
    content.viewsCount = (content.viewsCount || 0) + 1;
    await content.save();

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { title, body, images, tags, status, category, readTimeMinutes } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (body !== undefined) updateData.body = body;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : (images ? [images] : []);
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []);
    if (status !== undefined) updateData.status = status;
    if (category !== undefined) updateData.category = category;
    if (readTimeMinutes !== undefined) updateData.readTimeMinutes = Number(readTimeMinutes);

    const content = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email role');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content item not found.' });
    }

    res.json({
      success: true,
      message: 'Content updated successfully!',
      content,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content item not found.' });
    }

    res.json({
      success: true,
      message: `Content "${content.title}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicPublishedArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, search = '', tag = '' } = req.query;

    const query = { status: 'published' };

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Content.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .populate('author', 'name')
        .lean(),
      Content.countDocuments(query),
    ]);

    res.json({
      success: true,
      articles,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    next(error);
  }
};
