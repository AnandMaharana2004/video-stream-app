import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import dotenv from "dotenv";

dotenv.config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const QUEUE_URL = process.env.QUEUE_URL;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !QUEUE_URL) {
    throw new Error("Please provide the AWS credentials");
}

const sqs = new SQSClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

const pollQueue = async () => {
    const params = {
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,         // You can increase this to 10 for more throughput
        WaitTimeSeconds: 10,            // Long polling
    };

    try {
        const command = new ReceiveMessageCommand(params);
        const response = await sqs.send(command);

        const messages = response.Messages || [];

        for (const message of messages) {
            if (!message.Body) {
                console.log("❌ Message body is undefined.");
                continue;
            }
            let job;
            try {
                job = JSON.parse(message.Body);
            } catch (err) {
                console.log("❌ Invalid JSON in message body:", err);
                continue;
            }
            handleS3Event(job);

            // Delete message from queue after successful processing
            try {
                await sqs.send(
                    new DeleteMessageCommand({
                        QueueUrl: QUEUE_URL,
                        ReceiptHandle: message.ReceiptHandle!,
                    })
                );
                console.log("🗑️ Job deleted from queue");
            } catch (deleteErr) {
                console.error("❌ Error deleting message from queue:", deleteErr);
            }
        }
    } catch (error) {
        console.error("❌ Error polling queue:", error);
    }

    setTimeout(pollQueue, 2000); // poll again after 2 seconds
};

type S3EventRecord = {
    s3: {
        bucket: { name: string };
        object: { key: string };
    };
};

const handleS3Event = (job: any) => {
    if (!job.Records || !Array.isArray(job.Records)) {
        console.log("❌ Not a valid S3 event message.");
        return;
    }

    for (const record of job.Records as S3EventRecord[]) {
        const bucket = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
        console.log(`📦 New video uploaded: s3://${bucket}/${key}`);
        // 👉 Here you can call a function to start transcoding or any other processing
    }
};

export default pollQueue;