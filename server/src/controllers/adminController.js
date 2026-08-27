import { User } from '../models/User.js';
import { Career } from '../models/Career.js';
import { QuizResult } from '../models/QuizResult.js';
import { Resource } from '../models/Resource.js';
import { SuccessStory } from '../models/SuccessStory.js';
import { Feedback } from '../models/Feedback.js';
import { Multimedia } from '../models/Multimedia.js';
import { QuizQuestion } from '../models/QuizQuestion.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { getCache, setCache } from '../utils/cache.js';

export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const cacheKey = 'admin_analytics_overview';
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', analytics: cached });
    }

    const [
      totalUsers, studentCount, graduateCount, proCount, adminCount,
      totalCareers, quizAttempts, pendingStories, openFeedback,
      totalResources, totalMultimedia, totalQuizQuestions, totalLogs,
      topResources, recentLogs, recentSignupAgg
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'graduate' }),
      User.countDocuments({ role: 'professional' }),
      User.countDocuments({ role: 'admin' }),
      Career.countDocuments(),
      QuizResult.countDocuments(),
      SuccessStory.countDocuments({ status: 'pending' }),
      Feedback.countDocuments({ status: 'open' }),
      Resource.countDocuments(),
      Multimedia.countDocuments(),
      QuizQuestion.countDocuments(),
      ActivityLog.countDocuments(),
      Resource.find().sort({ downloadCount: -1 }).limit(5).lean(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email role').lean(),
      User.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const analytics = {
      totalUsers,
      roleBreakdown: { student: studentCount, graduate: graduateCount, professional: proCount, admin: adminCount },
      totalCareers,
      quizAttempts,
      pendingStories,
      openFeedback,
      totalResources,
      totalMultimedia,
      totalQuizQuestions,
      totalLogs,
      topResources,
      recentLogs,
      recentSignups: recentSignupAgg,
    };

    setCache(cacheKey, analytics, 30); // 30-sec fast cache for instant loading

    res.json({ success: true, analytics });
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
    user.isVerified = !user.isVerified;
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
