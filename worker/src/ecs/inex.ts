import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs"

import dotenv from "dotenv";

dotenv.config();

const AWS_REGION_TASK = process.env.AWS_REGION_TASK;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const TASK_DEFINATION_ARN = process.env.TASK_DEFINATION_ARN
const CLUSTER_ARN = process.env.CLUSTER_ARN

if (!AWS_REGION_TASK || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("Please provide the AWS credentials");
}
const ecsClient = new ECSClient({
    region: AWS_REGION_TASK,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})
export async function RunTask(outputPath: string, videoKey: string) {
    if (!videoKey || !outputPath) {
        throw Error("please provide Temporary video Key(S3 key) and Output folder path.")
    }
    const runtaskCommand = new RunTaskCommand({
        taskDefinition: TASK_DEFINATION_ARN,
        cluster: CLUSTER_ARN,
        launchType: "FARGATE",
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: ['subnet-0ea194a7d2c1d62f8', 'subnet-09ee6b913685974b8', 'subnet-09d3ff5eb0f197551'],
                securityGroups: ['sg-0ba05e4c8058af77b']
            }
        },
        overrides: {
            containerOverrides: [{
                name: "videoTranscoder",
                environment: [
                    { name: "TEMP_VIDEO_KEY", value: `${videoKey}` },
                    { name: "S3_OUTPUT_PATH", value: `${outputPath}` },
                    { name: "AWS_REGION", value: `ap-south-1` },
                    { name: "MONGO_URI", value: `mongodb+srv://anandmaharana427:4vG0cyO2EfMzkeFb@cluster0.l3bmxmu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` },
                    { name: "CLOUDFRONT_DOMAIN_NAME", value: `d2ovrq2g0trwce.cloudfront.net` },
                ]
            }]
        }

    })

    const reslut = await ecsClient.send(runtaskCommand)
    // how can i know that the task is complete or not 
    const taskArn = reslut.tasks?.[0]?.taskArn
    if (!taskArn) {
        throw Error("❌Task fail to start!!")
    }

}