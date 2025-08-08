import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function S3ClientSetup() {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        throw new Error("Please provide the AWS credentials");
    }

    const s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        }
    });
    return s3Client;
}

export const generateUrlForUploadFileOnS3 = async (
    bucketName: string,
    keyName: string,
    contentType: string
) => {
    if (!bucketName || !keyName || !contentType) {
        throw new Error("Please provide bucket name, key name, and contentType");
    }
    const s3Client = S3ClientSetup();
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: keyName,
        ContentType: contentType
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
    return signedUrl;
};

export const GetObjectFromS3 = async (
    bucketName: string,
    keyName: string,
    timeDuration: number
) => {
    if (!bucketName || !keyName || !timeDuration) {
        throw new Error("Please provide bucket name, key name and TimeDuration for getObject")
    }
    const s3Client = S3ClientSetup();
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: keyName,
    })
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * timeDuration })
    return signedUrl
}