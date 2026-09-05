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
      roleAgg,
      totalUsers,
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
      recentSignupAgg,
      totalContentCount,
      totalPageViews,
      totalLinkClicks,
      totalQuizEvents,
      pageDurationAgg,
      topPagesAgg,
      topLinksAgg
    ] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments(),
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

    const roleMap = {};
    (roleAgg || []).forEach((r) => {
      roleMap[r._id] = r.count;
    });

    const sumRoleUsers = (roleMap.student || 0) + (roleMap.graduate || 0) + (roleMap.professional || 0) + (roleMap.admin || 0);
    const finalTotalUsers = totalUsers > 0 ? totalUsers : (sumRoleUsers > 0 ? sumRoleUsers : 0);

    const totalSiteDurationMs = pageDurationAgg[0]?.totalDurationMs || 0;

    const analytics = {
      totalUsers: finalTotalUsers,
      roleBreakdown: {
        student: roleMap.student || 0,
        graduate: roleMap.graduate || 0,
        professional: roleMap.professional || 0,
        admin: roleMap.admin || 0,
      },
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

    setCache(cacheKey, analytics, 30); // 30-sec cache for rapid dashboard loading

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

    // Build Match Query
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

    if (quizStatus === 'taken' || quizStatus === 'not_taken') {
      const quizUserIds = await QuizAttempt.distinct('user');
      if (quizStatus === 'taken') {
        matchStage._id = { $in: quizUserIds };
      } else {
        matchStage._id = { $nin: quizUserIds };
      }
    }

    // Determine Sort object
    let sortObj = { createdAt: -1 };
    if (sort === 'createdAt') sortObj = { createdAt: 1 };
    if (sort === '-createdAt') sortObj = { createdAt: -1 };
    if (sort === 'lastLogin_desc' || sort === '-lastLogin') sortObj = { lastLogin: -1 };
    if (sort === 'lastLogin_asc' || sort === 'lastLogin') sortObj = { lastLogin: 1 };
    if (sort === 'name') sortObj = { name: 1 };
    if (sort === '-name') sortObj = { name: -1 };

    const isDirectSort = !['time_desc', 'time_asc', 'clicks_desc'].includes(sort);

    if (isDirectSort) {
      // FAST PATH: Direct indexed query with pagination on 20 users, then fast in-memory join
      const [users, total] = await Promise.all([
        User.find(matchStage).sort(sortObj).skip(skip).limit(limitNum).select('-passwordHash -otp -otpExpiry').lean(),
        User.countDocuments(matchStage),
      ]);

      const userIds = users.map((u) => u._id);

      const [allQuizzes, allPageActivities, allLinkClicks] = await Promise.all([
        QuizAttempt.find({ user: { $in: userIds } }).sort({ createdAt: -1 }).lean(),
        PageActivity.find({ user: { $in: userIds } }).lean(),
        LinkClick.find({ user: { $in: userIds } }).sort({ clickedAt: -1 }).lean(),
      ]);

      // Group activities by user ID
      const quizMap = {};
      allQuizzes.forEach((q) => {
        const uid = String(q.user);
        if (!quizMap[uid]) quizMap[uid] = [];
        quizMap[uid].push(q);
      });

      const pageMap = {};
      allPageActivities.forEach((pa) => {
        const uid = String(pa.user);
        if (!pageMap[uid]) pageMap[uid] = [];
        pageMap[uid].push(pa);
      });

      const clickMap = {};
      allLinkClicks.forEach((lc) => {
        const uid = String(lc.user);
        if (!clickMap[uid]) clickMap[uid] = [];
        clickMap[uid].push(lc);
      });

      const formattedUsers = users.map((u) => {
        const uid = String(u._id);
        const userQuizzes = quizMap[uid] || [];
        const userPages = pageMap[uid] || [];
        const userClicks = clickMap[uid] || [];

        let totalTime = 0;
        const pageAgg = {};
        userPages.forEach((p) => {
          totalTime += Number(p.durationMs) || 0;
          if (p.page) {
            if (!pageAgg[p.page]) pageAgg[p.page] = { page: p.page, durationMs: 0, visits: 0 };
            pageAgg[p.page].durationMs += Number(p.durationMs) || 0;
            pageAgg[p.page].visits += 1;
          }
        });

        return {
          ...u,
          quizTaken: userQuizzes.length > 0,
          quizzes: userQuizzes.map((q) => ({
            _id: q._id,
            quizTitle: q.quizTitle,
            score: q.score,
            totalQuestions: q.totalQuestions,
            status: q.status,
            completedAt: q.completedAt,
            createdAt: q.createdAt,
          })),
          totalPageTimeMs: totalTime,
          totalPagesVisited: userPages.length,
          pageAggregated: Object.values(pageAgg).sort((a, b) => b.durationMs - a.durationMs),
          externalClicksCount: userClicks.length,
          linkClicks: userClicks.map((lc) => ({
            _id: lc._id,
            url: lc.url,
            sourcePage: lc.sourcePage,
            clickedAt: lc.clickedAt,
          })),
        };
      });

      return res.json({
        success: true,
        users: formattedUsers,
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      });
    }

    // SLOW PATH FALLBACK: For computed sort (time_desc, clicks_desc)
    let computedSortObj = { totalPageTimeMs: -1 };
    if (sort === 'time_asc') computedSortObj = { totalPageTimeMs: 1 };
    if (sort === 'clicks_desc') computedSortObj = { externalClicksCount: -1 };

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
          quizzes: 1,
          totalPageTimeMs: { $sum: '$pageActivity.durationMs' },
          totalPagesVisited: { $size: '$pageActivity' },
          pageBreakdown: '$pageActivity',
          externalClicksCount: { $size: '$linkClicks' },
          linkClicks: 1,
        },
      },
      { $sort: computedSortObj },
      { $skip: skip },
      { $limit: limitNum },
    ];

    const [users, total] = await Promise.all([
      User.aggregate(pipeline),
      User.countDocuments(matchStage),
    ]);

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
    const feedback = await Feedback.find().sort({ createdAt: -1 }).populate('userId', 'name email').lean();
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
