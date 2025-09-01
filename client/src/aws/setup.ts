import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";
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
    if (!signedUrl) throw Error("Something went wrong while generating the signedUrl")
    return signedUrl
}

export const DeleteFilesFromS3 = async (key: string, bucketName: string) => {
    try {
        console.log("the incomming key is : ", key)
        const s3Client = S3ClientSetup();
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        })
        const result = await s3Client.send(deleteCommand)
        console.log("Delte objectly successfyly", result)
        return true
    } catch (error) {
        console.log(`Something went wrong while deleting file from S3, s3 key : ${key} and error`, error)
        return false
        // throw Error(`Something went wrong while deleting Hls file from S3, s3 key : ${key}`)
    }
}

export const DeleteWholeFolder = async (key: string, bucketName: string) => {
    try {
        const s3Client = S3ClientSetup();

        // 1. List all objects with the specified prefix (folder)
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: key
        });

        const listResponse = await s3Client.send(listCommand);

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            console.log(`No objects found in folder: ${key}`);
            return;
        }
        console.log("als file list are : ", listResponse.Contents)
        // 2. Prepare the list of objects to be deleted
        const objectsToDelete = listResponse.Contents.map((object) => ({ Key: object.Key }));

        // 3. Delete all listed objects in a single batch operation
        const deleteCommand = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: objectsToDelete
            }
        });

        const deleteResponse = await s3Client.send(deleteCommand);
        console.log(`Successfully deleted ${deleteResponse.Deleted?.length || 0} objects from folder: ${key}`);
        return deleteResponse;

    } catch (error) {
        console.error(`Something went wrong while deleting folder with prefix from S3, s3 prefix key : ${key}. Error:`, error);
        throw error; // Re-throw the error to be handled by the caller
    }
}