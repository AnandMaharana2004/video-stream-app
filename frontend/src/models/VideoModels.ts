import mongoose, { Schema } from "mongoose";

interface IVideo extends Document {
    title: string,
    status: "Uploading" | "Processing" | "Completed" | "Failed",
    description: string,
    cloudFrontUrl: string,
    videoS3key: string,
    author: mongoose.Types.ObjectId,
    duration: number,
    preSignedUrl: string,
    thamdilPicUrl: string,
    thatmdilS3key: string,
    isPublic: boolean
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
    videoS3key: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "videostreamUser"
    },
    duration: {
        type: Number
    },
    preSignedUrl: {
        type: String
    },
    thamdilPicUrl: {
        type: String,
        default : "not set yet"
    },
    thatmdilS3key: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: true
    }

})

// export const Video = mongoose.models?.videostreamVideo || mongoose.model<IVideo>("videostreamVideo", VideoSchema)
export const Video = mongoose.models?.VideoTranscodeVideos || mongoose.model<IVideo>("VideoTranscodeVideos", VideoSchema);