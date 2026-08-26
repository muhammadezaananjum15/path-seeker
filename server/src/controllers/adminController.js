import { User } from '../models/User.js';
import { Career } from '../models/Career.js';
import { QuizResult } from '../models/QuizResult.js';
import { Resource } from '../models/Resource.js';
import { SuccessStory } from '../models/SuccessStory.js';
import { Feedback } from '../models/Feedback.js';
import { Multimedia } from '../models/Multimedia.js';
import { QuizQuestion } from '../models/QuizQuestion.js';

export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const graduateCount = await User.countDocuments({ role: 'graduate' });
    const proCount = await User.countDocuments({ role: 'professional' });
    const totalCareers = await Career.countDocuments();
    const quizAttempts = await QuizResult.countDocuments();
    const pendingStories = await SuccessStory.countDocuments({ status: 'pending' });
    const openFeedback = await Feedback.countDocuments({ status: 'open' });
    const totalResources = await Resource.countDocuments();
    const totalMultimedia = await Multimedia.countDocuments();
    const totalQuizQuestions = await QuizQuestion.countDocuments();

    const topResources = await Resource.find().sort({ downloadCount: -1 }).limit(5);

    // Recent signups — last 7 days bucketed by day
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignupAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        roleBreakdown: { student: studentCount, graduate: graduateCount, professional: proCount },
        totalCareers,
        quizAttempts,
        pendingStories,
        openFeedback,
        totalResources,
        totalMultimedia,
        totalQuizQuestions,
        topResources,
        recentSignups: recentSignupAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search = '', role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);

    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'graduate', 'professional', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: `User role updated to ${role}!`, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: `User "${user.name}" deleted from platform.` });
  } catch (error) {
    next(error);
  }
};

export const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    user.isVerified = !user.isVerified; // Using isVerified as active/banned flag
    await user.save();
    res.json({
      success: true,
      message: user.isVerified ? `User "${user.name}" account restored.` : `User "${user.name}" account suspended.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const approveStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    );
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' });
    res.json({ success: true, message: 'Story approved!', story });
  } catch (error) {
    next(error);
  }
};

export const rejectStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' });
    res.json({ success: true, message: 'Story rejected.', story });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};

export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const fb = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!fb) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    res.json({ success: true, message: 'Feedback status updated!', feedback: fb });
  } catch (error) {
    next(error);
  }
};
