import dotenv from "dotenv"
import { DeleteObjectFromS3, DownloadObjectFromS3, uploadFolderToS3 } from "./utils/s3utils"
import { convertToHLSFormat } from "./utils/ffmpeg"
import path from "path";
import { mkdir } from "fs/promises";
import { connectToDatabase, updateVideoStatus } from "./utils/database";
import { pushNotification } from "./utils/notifficationQueue";

dotenv.config();

(async () => {
    try {

        /**
         * configuare all teh constant veriables 
         * connect to database 
         * 1. change video status uploadind to process 
         * 2. push notification 
         * 3. download file from S3 to local 
         * 4. process the video using ffmpeg 
         * 5. upload the file into the S3 permanent 
         * 6. change video status process to completed
         * 7. push notification 
         * 8. delete temporary file from s3
         */

        console.log('Start time : ', Date.now())

        // environment veriables :-
        const DatabaseUrl = process.env.MONGO_URI
        const cloudfront_domain_name = process.env.CLOUDFRONT_DOMAIN_NAME
        const temporaryVideoKey = process.env.TEMP_VIDEO_KEY

        if (!DatabaseUrl) throw Error("please provide Databasee Url")
        if (!temporaryVideoKey) throw Error("please provide temporary video key")
        if (!cloudfront_domain_name) throw Error("please provide cloudfront_domain_name in Environment veriable")

        const bucketName = "anand-video-stream-bucket"

        const { VideoId, s3KeyFolder, videoFileName } = getVideoFileDatas(temporaryVideoKey)

        const inputDir = path.join(__dirname, 'videos/input');
        const outputHlsDirectory = path.join(__dirname, 'videos/output');
        const inputVideoPath = path.join(inputDir, videoFileName);
        await mkdir(inputDir, { recursive: true });
        await mkdir(outputHlsDirectory, { recursive: true });

        await connectToDatabase(DatabaseUrl)

        await updateVideoStatus(VideoId, "processing")

        pushNotification(VideoId, "processing")

        await DownloadObjectFromS3(bucketName, temporaryVideoKey, inputVideoPath);

        await convertToHLSFormat(inputVideoPath, outputHlsDirectory)

        await uploadFolderToS3(outputHlsDirectory, bucketName, `permanent/hls/${s3KeyFolder}`)

        await updateVideoStatus(VideoId, "completed", `${cloudfront_domain_name}/${s3KeyFolder}/master.m3u8`)

        pushNotification(VideoId, "completed")

        await DeleteObjectFromS3(bucketName, temporaryVideoKey)
        console.log('End time : ', Date.now())

        process.exit(0)

    } catch (error) {
        console.log("something went wrong while do the work", error)
        process.exit(0)
    }
})()

function getVideoFileDatas(s3Key: string) {
    // temp/68a4836b4775c5ef74d6e773-video-480p.mp4
    const [a, videoFileName] = s3Key.split("/")
    const [VideoId, _, __] = videoFileName.split("-")
    const [s3KeyFolder, ___] = videoFileName.split(".")

    return ({ VideoId, s3KeyFolder, videoFileName })
}