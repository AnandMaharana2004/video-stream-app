"use server";

import { auth } from "@/auth";
import { generateUrlForUploadFileOnS3 } from "@/aws/s3Setup";
import { User } from "@/models/userModel";
import { Video } from "@/models/videoModel";
import { z } from "zod";


// Validate input
const fileMetadataSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.string().min(1),
  fileType: z.string().min(1),
});

export async function UploadFileController(fileName: string, fileSize: string, fileType: string, title: string, description: string) {
  const parsed = fileMetadataSchema.safeParse({ fileName, fileSize, fileType });
  if (!parsed.success) throw new Error("Invalid file metadata");

  const session = await auth()
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const email = session.user.email
  const name = session.user.name
  if (!name || !email) throw new Error("Unauthorized");

  // check in data base 
  const user = await User.findOne({ email }).select("-password")
  if (!user) {
    throw new Error("Unauthorized User")
  }

  const userId = user._id

  // const fileKey = `temp-videos/${userId}/${Date.now()}-${fileName}`;
  const fileKey = `${userId}-${fileName}-${Date.now()}`
  const bucketName = process.env.TEMPORARY_BUCKET!;
  const presignedUrl = await generateUrlForUploadFileOnS3(bucketName, fileKey, fileType);

  await Video.create({
    author: userId,
    title: title || "Now testing time",
    fileName,
    description: description || "",


  });

  return { presignedUrl };
}
