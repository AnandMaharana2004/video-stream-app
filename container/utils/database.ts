
import mongoose, { Model, Schema } from "mongoose";


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

export async function connectToDatabase(MONGO_URI: string): Promise<typeof mongoose> {
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

interface IVideo extends Document {
  status: "uploading" | "processing" | "completed" | "failed";
  updatedAt: Date;
  cloudFrontUrl?: string;
}

const VideoSchema = new Schema<IVideo>({
    status: {
        type: String,
        enum: ["uploading", "processing", "completed", "failed"],
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    cloudFrontUrl: {
        type: String,
    },
});

const VideoModel: Model<IVideo> = mongoose.model<IVideo>(
    "videotranscodevideos",
    VideoSchema
);

export async function updateVideoStatus(
    videoId: string,
    status: "uploading" | "processing" | "completed" | "failed",
    cloudFrontUrl?: string
) {
    if (!videoId || !status) {
        throw new Error("Please provide Video ID and Status.");
    }

    try {
        const updateData: Partial<IVideo> = {
            status,
            updatedAt: new Date(),
        };
        if (cloudFrontUrl) updateData.cloudFrontUrl = cloudFrontUrl;

        const updatedVideo = await VideoModel.findByIdAndUpdate(
            videoId,
            { $set: updateData },
            { new: true } // return the updated document
        );

        if (!updatedVideo) {
            throw new Error("Video not found!");
        }

        console.log("✅ Updated video:", updatedVideo);
        return updatedVideo;
    } catch (error) {
        console.error("❌ Failed to update video status:", error);
        throw new Error("❌ Failed to update video status.");
    }
}

// Example usage
// await DBconnection("your_mongodb_url");
// await updateVideoStatus("649c5e31c8900f001e7b415a", "completed", "https://your-hls-url.m3u8");
