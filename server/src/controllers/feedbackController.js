import { Feedback } from '../models/Feedback.js';

export const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, category, message } = req.body;
    const feedback = await Feedback.create({
      userId: req.user ? req.user._id : null,
      name: name || (req.user ? req.user.name : 'Anonymous'),
      email: email || (req.user ? req.user.email : 'anonymous@pathseeker.com'),
      category: category || 'suggestion',
      message,
    });

    res.status(201).json({ success: true, message: 'Thank you for your feedback!', feedback });
  } catch (error) {
    next(error);
  }
};

export const adminGetFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }
    res.json({ success: true, message: 'Feedback status updated!', feedback });
  } catch (error) {
    next(error);
  }
};
