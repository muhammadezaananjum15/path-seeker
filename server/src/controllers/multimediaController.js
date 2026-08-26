import { Multimedia } from '../models/Multimedia.js';
import { getCache, setCache } from '../utils/cache.js';
import axios from 'axios';

const CURATED_FALLBACK_VIDEOS = [
  {
    youtubeVideoId: 'zOjov-2OZ0E',
    title: 'Software Engineering Full Career Roadmap 2025',
    description: 'Complete guide to becoming a software engineer in 2025 with salary insights and skill roadmap.',
    thumbnail: 'https://i.ytimg.com/vi/zOjov-2OZ0E/hqdefault.jpg',
    channelTitle: 'TechWithTim',
    publishedAt: new Date().toISOString(),
  },
  {
    youtubeVideoId: 'ua-CiDNNj30',
    title: 'Data Science Career Path: Full Beginner to Expert Guide',
    description: 'Detailed data science and machine learning career guide covering Python, ML, and job market.',
    thumbnail: 'https://i.ytimg.com/vi/ua-CiDNNj30/hqdefault.jpg',
    channelTitle: 'Ken Jee',
    publishedAt: new Date().toISOString(),
  },
  {
    youtubeVideoId: 'J69-q4eLsYU',
    title: 'How to Become a Product Manager in 2025 – Complete Guide',
    description: 'Everything you need to know about breaking into product management at top tech companies.',
    thumbnail: 'https://i.ytimg.com/vi/J69-q4eLsYU/hqdefault.jpg',
    channelTitle: 'Exponent',
    publishedAt: new Date().toISOString(),
  },
  {
    youtubeVideoId: 'vLsVkgngKDQ',
    title: 'UI/UX Design Career: How to Get Your First Job',
    description: 'A comprehensive guide to starting your UI/UX design career, building your portfolio, and landing jobs.',
    thumbnail: 'https://i.ytimg.com/vi/vLsVkgngKDQ/hqdefault.jpg',
    channelTitle: 'DesignCourse',
    publishedAt: new Date().toISOString(),
  },
  {
    youtubeVideoId: 'grEKMHGYyns',
    title: 'Cloud Architecture & AWS Career Guide for 2025',
    description: 'How to become a cloud architect on AWS, Azure, or GCP. Certifications, salaries, and roadmap.',
    thumbnail: 'https://i.ytimg.com/vi/grEKMHGYyns/hqdefault.jpg',
    channelTitle: 'TechWorld with Nana',
    publishedAt: new Date().toISOString(),
  },
  {
    youtubeVideoId: '0GypdsJQN4',
    title: 'Cybersecurity Career Roadmap – From Zero to Expert',
    description: 'Learn how to enter cybersecurity in 2025 with no experience. Covers certifications and job pathways.',
    thumbnail: 'https://i.ytimg.com/vi/0GypdsJQN4/hqdefault.jpg',
    channelTitle: 'NetworkChuck',
    publishedAt: new Date().toISOString(),
  },
];

export const getMedia = async (req, res, next) => {
  try {
    const { category, type, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const mediaList = await Multimedia.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, media: mediaList });
  } catch (error) {
    next(error);
  }
};

export const getMediaById = async (req, res, next) => {
  try {
    const item = await Multimedia.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }
    res.json({ success: true, media: item });
  } catch (error) {
    next(error);
  }
};

export const searchYouTube = async (req, res, next) => {
  try {
    const { query = 'career roadmap guide 2025' } = req.query;
    const cacheKey = `youtube_search_${query.toLowerCase()}`;

    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
      return res.json({ success: true, source: 'cache', items: cachedResult });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.json({ success: true, source: 'fallback', items: CURATED_FALLBACK_VIDEOS });
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 8,
          q: `${query} career guidance`,
          type: 'video',
          key: apiKey,
        },
        timeout: 7000,
      });

      if (response.data?.items?.length > 0) {
        const items = response.data.items.map((item) => ({
          youtubeVideoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
        }));

        setCache(cacheKey, items, 7200); // cache for 2 hours
        return res.json({ success: true, source: 'live', items });
      }
    } catch (apiErr) {
      console.warn('[YouTube API Warning]', apiErr.response?.data?.error?.message || apiErr.message);
    }

    // Fallback if YouTube quota exceeded or failed
    res.json({ success: true, source: 'fallback', items: CURATED_FALLBACK_VIDEOS });
  } catch (error) {
    console.error('[YouTube Search Controller Error]', error.message);
    res.json({ success: true, source: 'fallback', items: CURATED_FALLBACK_VIDEOS });
  }
};

export const rateMedia = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const item = await Multimedia.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }

    const newCount = item.ratingCount + 1;
    const newAvg = (item.ratingAvg * item.ratingCount + Number(rating)) / newCount;

    item.ratingCount = newCount;
    item.ratingAvg = Number(newAvg.toFixed(1));
    await item.save();

    res.json({ success: true, message: 'Rating saved!', ratingAvg: item.ratingAvg, ratingCount: item.ratingCount });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const item = await Multimedia.create(req.body);
    res.status(201).json({ success: true, message: 'Media created!', media: item });
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req, res, next) => {
  try {
    const item = await Multimedia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Media updated!', media: item });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    await Multimedia.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Media deleted!' });
  } catch (error) {
    next(error);
  }
};
