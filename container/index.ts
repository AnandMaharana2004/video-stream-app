
import dotenv from "dotenv"
import { DeleteObjectFromS3, DownloadObjectFromS3, uploadFolderToS3, UploadObjectOnS3 } from "./utils/s3utils"
import { convertToHLSFormat } from "./utils/ffmpeg"
import path from "path";
import { mkdir } from "fs/promises";

dotenv.config();

(async () => {
    try {
        const temporaryBucket = "anand-video-stream-temp"
        const permanentBucket = "anand-video-stream-permanent"
        const temporaryVideoKey = process.env.TEMP_VIDEO_KEY //|| "video-480p.mp4"
        const s3OutputPath = process.env.S3_OUTPUT_PATH
        if (!temporaryVideoKey) { throw Error("Provide the key name of the Tempory video") }
        if (!s3OutputPath) { throw Error("Please provide the folder where you store the HLS format video in anand-video-stream-permanent bucket") }

        const inputPath = path.join(__dirname, "videos", "input");
        await mkdir(inputPath, { recursive: true });

        const filePath = path.join(inputPath, temporaryVideoKey)

        await DownloadObjectFromS3(temporaryBucket, temporaryVideoKey, filePath);

        const inputVideoPath = path.join(__dirname, `videos/input/${temporaryVideoKey}`);
        const outputHlsDirectory = path.join(__dirname, 'videos/output');
        await mkdir(outputHlsDirectory, { recursive: true });

        await convertToHLSFormat(inputVideoPath, outputHlsDirectory)
        const hlsInputFilePath = path.join(__dirname, "videos/output")
        await uploadFolderToS3(hlsInputFilePath, permanentBucket, s3OutputPath)

        await DeleteObjectFromS3(temporaryBucket, temporaryVideoKey)
        process.exit(0)
    } catch (error) {
        console.log("something went wrong while do the work", error)
        process.exit(0)
    }
})()
