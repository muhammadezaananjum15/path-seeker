import { User } from '../models/User.js';
import { Career } from '../models/Career.js';
import { QuizResult } from '../models/QuizResult.js';
import { Resource } from '../models/Resource.js';
import { SuccessStory } from '../models/SuccessStory.js';
import { Feedback } from '../models/Feedback.js';
import { Multimedia } from '../models/Multimedia.js';
import { QuizQuestion } from '../models/QuizQuestion.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { PageActivity } from '../models/PageActivity.js';
import { LinkClick } from '../models/LinkClick.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Content } from '../models/Content.js';
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
      topResources, recentLogs, recentSignupAgg,
      totalContentCount, totalPageViews, totalLinkClicks, totalQuizEvents,
      pageDurationAgg, topPagesAgg, topLinksAgg
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
      Content.countDocuments(),
      PageActivity.countDocuments(),
      LinkClick.countDocuments(),
      QuizAttempt.countDocuments(),
      PageActivity.aggregate([
        { $group: { _id: null, totalDurationMs: { $sum: '$durationMs' } } }
      ]),
      PageActivity.aggregate([
        { $group: { _id: '$page', totalDurationMs: { $sum: '$durationMs' }, count: { $sum: 1 } } },
        { $sort: { totalDurationMs: -1 } },
        { $limit: 6 }
      ]),
      LinkClick.aggregate([
        { $group: { _id: '$url', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 }
      ])
    ]);

    const totalSiteDurationMs = pageDurationAgg[0]?.totalDurationMs || 0;

    const analytics = {
      totalUsers,
      roleBreakdown: { student: studentCount, graduate: graduateCount, professional: proCount, admin: adminCount },
      totalCareers,
      quizAttempts: quizAttempts + totalQuizEvents,
      pendingStories,
      openFeedback,
      totalResources,
      totalMultimedia,
      totalQuizQuestions,
      totalLogs,
      topResources,
      recentLogs,
      recentSignups: recentSignupAgg,
      realTimeTracking: {
        totalContentCount,
        totalPageViews,
        totalLinkClicks,
        totalQuizEvents,
        totalSiteDurationMs,
        topPages: topPagesAgg.map(p => ({ page: p._id, durationMs: p.totalDurationMs, count: p.count })),
        topLinks: topLinksAgg.map(l => ({ url: l._id, count: l.count })),
      },
    };

    setCache(cacheKey, analytics, 15); // 15-sec cache for near real-time updates

    res.json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search = '', role, quizStatus = 'all', page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // Match Stage
    const matchStage = {};
    if (role && role !== 'all') {
      matchStage.role = role;
    }
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Aggregation pipeline to join quizzes, pageActivity, linkClicks
    const pipeline = [
      { $match: matchStage },
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
          isVerified: 1,
          createdAt: 1,
          lastLogin: 1,
          quizTaken: { $gt: [{ $size: '$quizzes' }, 0] },
          quizzes: {
            $map: {
              input: '$quizzes',
              as: 'q',
              in: {
                _id: '$$q._id',
                quizTitle: '$$q.quizTitle',
                score: '$$q.score',
                totalQuestions: '$$q.totalQuestions',
                status: '$$q.status',
                completedAt: '$$q.completedAt',
                createdAt: '$$q.createdAt',
              },
            },
          },
          totalPageTimeMs: { $sum: '$pageActivity.durationMs' },
          totalPagesVisited: { $size: '$pageActivity' },
          pageBreakdown: {
            $map: {
              input: '$pageActivity',
              as: 'pa',
              in: {
                page: '$$pa.page',
                durationMs: '$$pa.durationMs',
                enteredAt: '$$pa.enteredAt',
                exitedAt: '$$pa.exitedAt',
              },
            },
          },
          externalClicksCount: { $size: '$linkClicks' },
          linkClicks: {
            $map: {
              input: '$linkClicks',
              as: 'lc',
              in: {
                _id: '$$lc._id',
                url: '$$lc.url',
                sourcePage: '$$lc.sourcePage',
                clickedAt: '$$lc.clickedAt',
              },
            },
          },
        },
      },
    ];

    // Filter by quiz status if requested
    if (quizStatus === 'taken') {
      pipeline.push({ $match: { quizTaken: true } });
    } else if (quizStatus === 'not_taken') {
      pipeline.push({ $match: { quizTaken: false } });
    }

    // Sort stage
    let sortObj = { createdAt: -1 };
    if (sort === 'time_desc') sortObj = { totalPageTimeMs: -1 };
    if (sort === 'time_asc') sortObj = { totalPageTimeMs: 1 };
    if (sort === 'clicks_desc') sortObj = { externalClicksCount: -1 };
    if (sort === 'lastLogin_desc') sortObj = { lastLogin: -1 };

    const countPipeline = [...pipeline, { $count: 'total' }];

    pipeline.push({ $sort: sortObj });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    const [users, countResult] = await Promise.all([
      User.aggregate(pipeline),
      User.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    // Also process aggregated page breakdown summaries for each user
    const formattedUsers = users.map((u) => {
      const pageMap = {};
      (u.pageBreakdown || []).forEach((p) => {
        if (!p.page) return;
        if (!pageMap[p.page]) {
          pageMap[p.page] = { page: p.page, durationMs: 0, visits: 0 };
        }
        pageMap[p.page].durationMs += Number(p.durationMs) || 0;
        pageMap[p.page].visits += 1;
      });

      return {
        ...u,
        pageAggregated: Object.values(pageMap).sort((a, b) => b.durationMs - a.durationMs),
      };
    });

    res.json({
      success: true,
      users: formattedUsers,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
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
