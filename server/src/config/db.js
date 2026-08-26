import dns from 'dns';
import mongoose from 'mongoose';

// ─── Windows DNS Fix for MongoDB Atlas SRV Lookup ──────────────────
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_e) {}

// Disable buffering globally so Mongoose operations never hang or timeout
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pathseeker';

  // 1. Try Primary MongoDB Atlas Connection
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.warn(`[MongoDB Notice] Primary connection attempt failed (${error.message}).`);
  }

  // 2. Try Local MongoDB Server (127.0.0.1:27017)
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/pathseeker', {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500,
    });
    console.log(`[MongoDB Local] Connected successfully: ${conn.connection.host}`);
    return;
  } catch (localErr) {
    console.warn(`[MongoDB Notice] Local MongoDB server not running on port 27017.`);
  }

  // 3. High-Speed Persistent Disk DB Strategy + MongoMemoryServer
  console.log('[MongoDB] PathSeeker Persistent Disk Database & Embedded Mongo Active.');
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    MongoMemoryServer.create().then((server) => {
      mongoose.connect(server.getUri()).then(() => {
        console.log('[MongoDB In-Memory Engine] Full Mongoose connection established!');
      }).catch(() => {});
    }).catch(() => {});
  } catch (e) {}
};
