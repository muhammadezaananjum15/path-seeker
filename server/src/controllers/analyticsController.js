import mongoose from 'mongoose';
import { PageActivity } from '../models/PageActivity.js';
import { LinkClick } from '../models/LinkClick.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { User } from '../models/User.js';

export const trackPageEnter = async (req, res, next) => {
  try {
    const { page } = req.body;

    if (!page) {
      return res.status(400).json({ success: false, message: 'Page path is required.' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User must be authenticated to track activity.' });
    }

    const activity = await PageActivity.create({
      user: userId,
      page,
      enteredAt: new Date(),
    });

    res.status(201).json({
      success: true,
      activityId: activity._id,
    });
  } catch (error) {
    next(error);
  }
};

export const trackPageExit = async (req, res, next) => {
  try {
    let activityId = req.body?.activityId;

    // Support navigator.sendBeacon where body might be a parsed JSON or raw string
    if (!activityId && typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        activityId = parsed.activityId;
      } catch (e) {}
    }

    if (!activityId) {
      return res.status(400).json({ success: false, message: 'activityId is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ success: false, message: 'Invalid activityId.' });
    }

    const activity = await PageActivity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity record not found.' });
    }

    const exitedAt = new Date();
    const durationMs = Math.max(0, exitedAt.getTime() - new Date(activity.enteredAt).getTime());

    activity.exitedAt = exitedAt;
    activity.durationMs = durationMs;
    await activity.save();

    res.status(200).json({
      success: true,
      durationMs,
    });
  } catch (error) {
    next(error);
  }
};

export const trackLinkClick = async (req, res, next) => {
  try {
    const { url, sourcePage = '/' } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'External URL is required.' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User must be authenticated to track link clicks.' });
    }

    const click = await LinkClick.create({
      user: userId,
      url,
      sourcePage,
      clickedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      clickId: click._id,
    });
  } catch (error) {
    next(error);
  }
};

export const trackQuizEvent = async (req, res, next) => {
  try {
    const { quizId, quizTitle = 'Career Aptitude Assessment', score, totalQuestions, status = 'completed' } = req.body;

    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User must be authenticated to record quiz events.' });
    }

    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: mongoose.Types.ObjectId.isValid(quizId) ? quizId : undefined,
      quizTitle,
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 10,
      status,
      completedAt: status === 'completed' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz attempt recorded successfully!',
      attempt,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDashboardStats = async (req, res, next) => {
  try {
    const rawUserId = req.user?._id || req.user?.id;
    if (!rawUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    let userObjectId = null;
    if (mongoose.Types.ObjectId.isValid(rawUserId)) {
      userObjectId = new mongoose.Types.ObjectId(rawUserId);
    }

    // 1. Aggregation scoped to the logged-in user
    let userStats = null;
    if (userObjectId) {
      const aggResult = await User.aggregate([
        { $match: { _id: userObjectId } },
        {
          $lookup: {
            from: 'quizattempts',
            localField: '_id',
            foreignField: 'user',
            as: 'quizzes',
          },
        },
        {
          $lookup: {
            from: 'pageactivities',
            localField: '_id',
            foreignField: 'user',
            as: 'pageActivity',
          },
        },
        {
          $lookup: {
            from: 'linkclicks',
            localField: '_id',
            foreignField: 'user',
            as: 'linkClicks',
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            role: 1,
            createdAt: 1,
            lastLogin: 1,
            quizTaken: { $gt: [{ $size: '$quizzes' }, 0] },
            quizzes: {
              $sortArray: { input: '$quizzes', sortBy: { createdAt: -1 } }
            },
            totalPageTimeMs: { $sum: '$pageActivity.durationMs' },
            totalPagesVisited: { $size: '$pageActivity' },
            externalClicksCount: { $size: '$linkClicks' },
            linkClicks: {
              $sortArray: { input: '$linkClicks', sortBy: { clickedAt: -1 } }
            },
            pageActivity: 1,
          },
        },
      ]);

      if (aggResult && aggResult.length > 0) {
        userStats = aggResult[0];
      }
    }

    // 2. Aggregate time-per-page breakdown for this user
    let pageBreakdown = [];
    if (userObjectId) {
      pageBreakdown = await PageActivity.aggregate([
        { $match: { user: userObjectId } },
        {
          $group: {
            _id: '$page',
            totalDurationMs: { $sum: { $ifNull: ['$durationMs', 0] } },
            visits: { $sum: 1 },
            lastVisited: { $max: '$enteredAt' },
          },
        },
        { $sort: { totalDurationMs: -1 } },
        {
          $project: {
            _id: 0,
            page: '$_id',
            totalDurationMs: 1,
            visits: 1,
            lastVisited: 1,
          },
        },
      ]);
    }

    // Fallback if user is persistent memory / not in MongoDB yet
    if (!userStats) {
      userStats = {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        quizTaken: false,
        quizzes: [],
        totalPageTimeMs: 0,
        totalPagesVisited: 0,
        externalClicksCount: 0,
        linkClicks: [],
      };
    }

    res.json({
      success: true,
      stats: {
        ...userStats,
        pageBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
