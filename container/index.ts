
import dotenv from "dotenv"
import { DeleteObjectFromS3, DownloadObjectFromS3, uploadFolderToS3, UploadObjectOnS3 } from "./utils/s3utils"
import { convertToHLSFormat } from "./utils/ffmpeg"
import path from "path";
import { mkdir } from "fs/promises";
import { updateVideoStatus } from "./utils/database";

dotenv.config();

(async () => {
    try {
        console.log('Start time : ', Date.now())
        const DatabaseUrl = process.env.MONGO_URI
        const cloudfront_domain_name = process.env.CLOUDFRONT_DOMAIN_NAME
        if (!cloudfront_domain_name) throw Error("please provide cloudfront_domain_name in Environment veriable")
        if (!DatabaseUrl) throw Error("Please provide Database URL in Environment veriable")

        const temporaryBucket = "anand-video-stream-bucket"
        const permanentBucket = "anand-video-stream-bucket"
        const temporaryVideoKey = process.env.TEMP_VIDEO_KEY
        // const s3OutputPath = process.env.S3_OUTPUT_PATH
        if (!temporaryVideoKey) throw Error("please provide temporary video key")
        const splitkey = temporaryVideoKey?.split("/")
        const videoIDwithFileName = splitkey[1].split(".")
        const s3OutputPath = `permanent/hls/${videoIDwithFileName[0]}`
        if (!temporaryVideoKey) { throw Error("Provide the key name of the Tempory video") }
        if (!s3OutputPath) { throw Error("Please provide the folder where you store the HLS format video in anand-vieo-stream bucket") }

        const inputPath = path.join(__dirname, "videos", "input");
        await mkdir(inputPath, { recursive: true });

        const filePath = path.join(inputPath, splitkey[1])

        await DownloadObjectFromS3(temporaryBucket, temporaryVideoKey, filePath);

        const inputVideoPath = path.join(__dirname, `videos/input/${splitkey[1]}`);
        const outputHlsDirectory = path.join(__dirname, 'videos/output');
        await mkdir(outputHlsDirectory, { recursive: true });

        await convertToHLSFormat(inputVideoPath, outputHlsDirectory)
        const hlsInputFilePath = path.join(__dirname, "videos/output")
        await uploadFolderToS3(hlsInputFilePath, permanentBucket, s3OutputPath)

        const videoId = videoIDwithFileName[0].split("-")
        const cloudFrontUrl = `${cloudfront_domain_name}/${videoId[0]}/master.m3u8`

        await updateVideoStatus(DatabaseUrl, videoId[0], "completed",cloudFrontUrl)

        await DeleteObjectFromS3(temporaryBucket, temporaryVideoKey)
        console.log('End time : ', Date.now())

        process.exit(0)

    } catch (error) {
        console.log("something went wrong while do the work", error)
        process.exit(0)
    }
})()
