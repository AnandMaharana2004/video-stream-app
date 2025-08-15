import { Document, Schema, Types, model, models } from "mongoose";

export interface IVideo extends Document {
  author: Types.ObjectId;
  title: string;
  description?: string;
  fileName: string;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  temporarys3Key?: string;
  permanentS3Key?: string;
  thumbnailS3Key?: string;
  views: number;
  duration?: number;
  size?: number;
  isPublished: boolean;
}

const videoSchema = new Schema<IVideo>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "VideoTransCodeUser",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fileName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "uploading", "processing", "completed", "failed"],
      required: true,
      default: "pending",
    },
    temporarys3Key: {
      type: String,
    },
    permanentS3Key: {
      type: String,
    },
    thumbnailS3Key: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
    },
    size: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Double-check model name
export const Video = models?.VideoTranscodeVideos || model<IVideo>("VideoTranscodeVideos", videoSchema);
