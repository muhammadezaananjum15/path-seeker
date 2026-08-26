import express from 'express';
import axios from 'axios';
import { getCache, setCache } from '../utils/cache.js';
import { YOUTUBE_VIDEO_DATASET } from '../utils/videoData.js';

const router = express.Router();
const CURATED_CAREER_VIDEOS = YOUTUBE_VIDEO_DATASET;

// Helper to filter dataset by query / category
const filterDataset = (queryStr, categoryStr) => {
  let list = [...CURATED_CAREER_VIDEOS];
  if (categoryStr && categoryStr !== 'All') {
    list = list.filter((v) => v.category.toLowerCase() === categoryStr.toLowerCase());
  }
  if (queryStr && queryStr.trim() !== '') {
    const q = queryStr.trim().toLowerCase();
    const matches = list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.tags && v.tags.some((t) => t.toLowerCase().includes(q)))
    );
    if (matches.length > 0) return matches;
  }
  return list;
};

// GET /api/youtube/search?q=career+roadmap
router.get('/search', async (req, res) => {
  try {
    const { q = '', category, maxResults = 150 } = req.query;
    const cacheKey = `yt_search_${(q || 'all').toLowerCase().replace(/\s+/g, '_').substring(0, 80)}_${category || ''}`;

    const cached = getCache(cacheKey);
    if (cached) return res.json({ success: true, source: 'cache', items: cached });

    const apiKey = process.env.YOUTUBE_API_KEY;
    const isKeyValid = Boolean(apiKey && !apiKey.includes('your_') && apiKey.length > 20);

    if (!isKeyValid) {
      const filtered = filterDataset(q, category);
      return res.json({ success: true, source: 'fallback', items: filtered.slice(0, Number(maxResults)) });
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: Math.min(Number(maxResults), 50),
          q: q ? `${q} career guidance` : 'tech career guidance software development 2025',
          type: 'video',
          key: apiKey,
          relevanceLanguage: 'en',
          safeSearch: 'moderate',
          order: 'relevance',
        },
        timeout: 8000,
      });

      const liveItems = (response.data.items || []).map((item) => ({
        youtubeVideoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description.substring(0, 120),
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        category: category || 'Technology',
      }));

      // Combine live items with curated dataset for a rich 100+ video experience
      const filteredCurated = filterDataset(q, category);
      const combined = [...liveItems, ...filteredCurated];
      // Deduplicate by youtubeVideoId
      const uniqueMap = new Map();
      combined.forEach((v) => {
        if (v.youtubeVideoId && !uniqueMap.has(v.youtubeVideoId)) {
          uniqueMap.set(v.youtubeVideoId, v);
        }
      });
      const finalItems = Array.from(uniqueMap.values());

      setCache(cacheKey, finalItems, 7200);
      return res.json({ success: true, source: 'live', items: finalItems });
    } catch (apiErr) {
      const filtered = filterDataset(q, category);
      return res.json({ success: true, source: 'fallback', items: filtered });
    }
  } catch (error) {
    console.error('[YouTube Search Error]', error.message);
    res.json({ success: true, source: 'fallback', items: filterDataset(req.query.q, req.query.category) });
  }
});

// GET /api/youtube/career-videos — Curated career topics
router.get('/career-videos', async (req, res) => {
  try {
    const { query, category } = req.query;
    const filtered = filterDataset(query, category);
    res.json({ success: true, source: 'curated', items: filtered });
  } catch (error) {
    console.error('[YouTube Career Videos Route Error]', error.message);
    res.json({ success: true, source: 'fallback', items: CURATED_CAREER_VIDEOS });
  }
});

export default router;
