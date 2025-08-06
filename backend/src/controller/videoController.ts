import { Request, response, Response } from "express";
import { z } from "zod";
import { generateUrlForUploadFileOnS3 } from "../aws/setup";

// Zod schema for validation
const uploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().max(25 * 1024 * 1024, "File size should not exceed 25MB"), // 25MB
  fileType: z.string().min(1, "File type is required"),
});

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    // Validate incoming data
    const parseResult = uploadSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.issues.map(err => err.message).join(", "),
        statusCode: 400,
        data: null,
        success: false,
      });
    }

    const { fileName, fileSize, fileType } = parseResult.data;

    // Optionally: Generate a unique key (e.g., with user id, timestamp)
    const keyName = `${Date.now()}_${fileName}`;
    
    // Generate pre-signed URL
    const url = await generateUrlForUploadFileOnS3(
      "anand-video-stream-temp",
      keyName,
      fileType
    );

    // Success response
    return res.status(200).json({
      message: "Pre-signed URL generated successfully",
      statusCode: 200,
      data: { url, keyName },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while uploading video",
      statusCode: 500,
      data: null,
      success: false,
    });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "all are going GOOD",
      statusCode: 200,
      data: null,
      success: false,
    })

  } catch (error) {
  return res.status(500).json({
    message: "Something went wrong retrive videos",
    statusCode: 500,
    data: null,
    success: false,
  });
}
}