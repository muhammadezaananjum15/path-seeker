import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.resolve(__dirname, '..', '..', 'data', 'persistent_db.json');

// Ensure /server/data directory exists
const dataDir = path.dirname(DB_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbData = {
  users: [
    {
      id: 'prod-admin-420',
      name: 'System Administrator',
      email: 'admin420@gmail.com',
      passwordHash: '',
      role: 'admin',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ],
  profiles: [],
  bookmarks: [],
  activities: [],
};

// Load existing data from file on startup
try {
  if (fs.existsSync(DB_FILE_PATH)) {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        dbData.users = parsed.users;
      }
      if (Array.isArray(parsed.profiles)) dbData.profiles = parsed.profiles;
      if (Array.isArray(parsed.bookmarks)) dbData.bookmarks = parsed.bookmarks;
      if (Array.isArray(parsed.activities)) dbData.activities = parsed.activities;
    }
  } else {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbData, null, 2));
  }
} catch (err) {
  console.warn('[PersistentDB Warning] Failed loading persistent JSON database:', err.message);
}

export const savePersistentDb = () => {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbData, null, 2));
  } catch (err) {
    console.error('[PersistentDB Error] Failed saving disk file database:', err.message);
  }
};

export const getPersistentUsers = () => dbData.users;

export const findPersistentUserByEmail = (email) => {
  const clean = (email || '').toLowerCase().trim();
  return dbData.users.find((u) => u.email === clean);
};

export const savePersistentUser = (userObj) => {
  const cleanEmail = (userObj.email || '').toLowerCase().trim();
  const existingIdx = dbData.users.findIndex((u) => u.email === cleanEmail);
  if (existingIdx >= 0) {
    dbData.users[existingIdx] = { ...dbData.users[existingIdx], ...userObj };
  } else {
    dbData.users.push(userObj);
  }
  savePersistentDb();
  return userObj;
};
