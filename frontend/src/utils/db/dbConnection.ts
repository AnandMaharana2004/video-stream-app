"use server";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("❌ Please define the MONGO_URI environment variable inside .env.local");
}

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS global object
declare global {
  var mongoose: MongooseGlobalCache | undefined;
}

const globalCache = globalThis.mongoose ?? {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalCache.conn) {
    console.log("👍👍 MongoDB connection already established 👍👍");
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(MONGO_URI)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  globalCache.conn = await globalCache.promise;

  globalThis.mongoose = globalCache;
  return globalCache.conn;
}
