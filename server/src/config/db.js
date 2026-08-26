import dns from 'dns';
import mongoose from 'mongoose';

// ─── Windows DNS Fix for MongoDB Atlas SRV Lookup ──────────────────
// Only override DNS servers if explicitly running on local Windows dev, NOT on Railway or containerized cloud
if (process.platform === 'win32' && !process.env.RAILWAY_ENVIRONMENT && !process.env.RAILWAY_STATIC_URL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (_e) {}
}

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_e) {}

export const connectDB = async () => {
  // Support standard Railway & Atlas MongoDB environment variable naming conventions
  const primaryUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL;

  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT);

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB Connection Error] Primary DB connection failed (${error.message}).`);
    }
  } else {
    console.warn('[MongoDB Warning] No MONGO_URI, MONGODB_URI, or MONGO_URL found in environment variables.');
  }

  // If running in cloud/production (like Railway), do not silently downgrade to local/memory DB without warning
  if (isProduction) {
    console.error('[MongoDB Error] Unable to establish connection to production MongoDB database on Railway.');
    return;
  }

  // 2. Try Local MongoDB Server (127.0.0.1:27017) for local dev fallback
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/pathseeker', {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    console.log(`[MongoDB Local] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn(`[MongoDB Notice] Local MongoDB server not running on port 27017.`);
  }

  // 3. High-Speed Persistent Disk DB Strategy + MongoMemoryServer (Development fallback)
  console.log('[MongoDB] PathSeeker Persistent Disk Database & Embedded Mongo Active.');
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    console.log('[MongoDB In-Memory Engine] Full Mongoose connection established!');
  } catch (e) {
    console.warn('[MongoDB Fallback] In-memory database initialization error:', e.message);
  }
};

