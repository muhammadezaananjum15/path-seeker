/**
 * Simple in-memory cache utility for the server.
 * Avoids redundant API calls to YouTube and Gemini.
 */
const store = new Map();

export const getCache = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

export const setCache = (key, value, ttlSeconds = 3600) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const deleteCache = (key) => store.delete(key);
export const clearCache = () => store.clear();
