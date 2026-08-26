import { SuccessStory } from '../models/SuccessStory.js';

export const getApprovedStories = async (req, res, next) => {
  try {
    const { domain } = req.query;
    const filter = { status: 'approved' };
    if (domain && domain !== 'All') {
      filter.domain = { $regex: new RegExp(domain, 'i') };
    }

    const stories = await SuccessStory.find(filter).sort({ approvedAt: -1, createdAt: -1 });
    res.json({ success: true, stories });
  } catch (error) {
    next(error);
  }
};

export const getStoryById = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }
    res.json({ success: true, story });
  } catch (error) {
    next(error);
  }
};

export const submitStory = async (req, res, next) => {
  try {
    const { authorName, domain, headline, storyText, imageUrl, timeline } = req.body;

    const story = await SuccessStory.create({
      authorName: authorName || req.user.name,
      userId: req.user._id,
      domain,
      headline,
      storyText,
      imageUrl,
      timeline,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Success story submitted for review! An admin will review it shortly.',
      story,
    });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints
export const adminGetStories = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const stories = await SuccessStory.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, stories });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateStoryStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    story.status = status;
    if (status === 'approved') {
      story.approvedBy = req.user._id;
      story.approvedAt = new Date();
    }

    await story.save();
    res.json({ success: true, message: `Story status updated to ${status}!`, story });
  } catch (error) {
    next(error);
  }
};
