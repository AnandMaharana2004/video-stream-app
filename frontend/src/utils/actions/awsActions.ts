"use server";

import { auth } from "@/auth";
import { generateUrlForUploadFileOnS3 } from "@/aws/s3Setup";
import { User } from "@/models/userModel";
import { Video } from "@/models/videoModel";
import { z } from "zod";
import { connectToDatabase } from "../db/dbConnection";

// Validate input
const videofileMetadataSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.string().min(1),
  fileType: z.string().min(1),
});

const thamadilFileMedtaDataSchema = z.object({
  thamadilFileName: z.string().min(1),
  thamadilFileSize: z.string().min(1),
  thamadilFileType: z.string().min(1)
})

const videoDetailsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
})

export async function UploadFileController(
  fileName: string,
  fileSize: string,
  fileType: string,
  thamadilFileName: string,
  thamadilFileSize: string,
  thamadilFileType: string,
  title: string,
  description: string,
) {

  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const email = session.user.email
    const name = session.user.name
    if (!name || !email) throw new Error("Unauthorized");

    const parsed = videofileMetadataSchema.safeParse({ fileName, fileSize, fileType });
    if (!parsed.success) throw new Error("Invalid file metadata");

    const thamadilValidate = thamadilFileMedtaDataSchema.safeParse({ thamadilFileName, thamadilFileSize, thamadilFileType })
    if (!thamadilValidate.success) throw new Error("Invalid thamadil metadata", thamadilValidate.error)

    const videoDetailsValidation = videoDetailsSchema.safeParse({
      description,
      title
    })

    if (!videoDetailsValidation.success) throw new Error("Please provide descripton as well as title", videoDetailsValidation.error)

    // check in data base 
    await connectToDatabase()
    const user = await User.findOne({ email }).select("-password")
    if (!user) {
      throw new Error("Unauthorized User")
    }

    const userId = user._id

    // const VideoFileKey = `temp-videos/${userId}/${Date.now()}-${fileName}`;
    const bucketName = process.env.TEMPORARY_BUCKET;

    if (!bucketName) {
      throw Error("Please provide S3 bucket name")
    }

    const videoDocument = await Video.create({
      author: userId,
      title: title || "Now testing time",
      fileName,
      description: description || "",
    });

    const VideoFileKey = `temp/${videoDocument._id}-${fileName}`
    const thamadilFileKey = `permanent/thumbnail-images/${videoDocument._id}-${thamadilFileName}`
    const videoPresignedUrl = await generateUrlForUploadFileOnS3(bucketName, VideoFileKey, fileType);
    const thamadilPresignedUrl = await generateUrlForUploadFileOnS3(bucketName, thamadilFileKey, thamadilFileType);

    videoDocument.temporarys3Key = VideoFileKey
    videoDocument.thumbnailS3Key = thamadilFileKey
    await videoDocument.save()

    return { videoPresignedUrl, thamadilPresignedUrl, VideoFileKey, thamadilFileKey };
  } catch (error:unknown) {
    console.log("server error :", error)
    throw new Error("Something went wrong : while generating video and thamadil file presign url")
  }
}

export async function CancelFileUploadingController(key: string) {
  /**
   * delete teh thamadil if uploade in the s3
   */
  await connectToDatabase()
  if (!key) {
    return false
  }
  await Video.findOneAndDelete({
    temporarys3Key: key
  })
  return true
}