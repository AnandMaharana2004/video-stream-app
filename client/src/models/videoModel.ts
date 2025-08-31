import mongoose, { Schema } from "mongoose";

interface IVideo extends Document {
    title: string,
    status: "Uploading" | "Processing" | "Completed" | "Failed",
    description: string,
    cloudFrontUrl: string,
    videoS3key: string,
    author: mongoose.Types.ObjectId,
    thamdilPicUrl: string,
    thumbnailS3Key: string,
    isPublic: boolean,
    temporarys3Key: string
}

const VideoSchema = new Schema<IVideo>({
    title: {
        type: String
    },
    status: {
        type: String,
        enum: ["Uploading", "Processing", "Completed", "Failed"],
        default: "Uploading"
    },
    description: {
        type: String
    },
    cloudFrontUrl: {
        type: String
    },
    temporarys3Key: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "videostreamUser"
    },
    thamdilPicUrl: {
        type: String,
        // default : "not set yet"
    },
    thumbnailS3Key: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: true
    }

})

// export const Video = mongoose.models?.videostreamVideo || mongoose.model<IVideo>("videostreamVideo", VideoSchema)
export const Video = mongoose.models?.VideoTranscodeVideos || mongoose.model<IVideo>("VideoTranscodeVideos", VideoSchema);