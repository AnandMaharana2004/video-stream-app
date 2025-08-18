/**
 * connect to database 
 * find the particular document throw (VIdeo_Id)
 * update the status (from )
 */

import { MongoClient, ObjectId } from "mongodb";

interface VideoUpdate {
    status: "uploading" | "processing" | "completed" | "failed"
    updatedAt: Date;
    cloudFrontUrl?: string; // or cloudFrontUrl?: string; based on your naming
    [key: string]: any; // Allows any additional properties in the update
}

export async function DBconnection(dbUrl: string) {
    if (!dbUrl) throw Error("Please provide DB Url");
    const dbClient = new MongoClient(dbUrl);
    try {
        await dbClient.connect();
        await dbClient.db("admin").command({ ping: 1 });
        console.log("Connected successfully to MongoDB!");
        return dbClient;
    } catch (error) {
        throw new Error("❌ Something went wrong while connecting to the Database ❌");
    }
}

export async function updateVideoStatus(dbUrl: string, videoId: string, status: "uploading" | "processing" | "completed" | "failed" , cloudFrontUrl: string) {
    if (!dbUrl || !videoId || !status) {
        throw new Error("Please provide DB URL, Video ID, and Status.");
    }
    
    if (!ObjectId.isValid(videoId)) {
        throw new Error("Invalid Video ID format.");
    }

    const client = await DBconnection(dbUrl);

    try {
        const db = client.db("Cluster0");
        const collection = db.collection("VideoTranscodeVideos");

        let updateData: VideoUpdate = {
            status: status,
            updatedAt: new Date()
        };

        // Conditionally add the cloudFrontUrl property if it exists
        if (cloudFrontUrl) {
            updateData.cloudFrontUrl = cloudFrontUrl;
        }

        const updateDoc = {
            $set: updateData
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(videoId) },
            updateDoc
        );

        if (result.modifiedCount === 0) {
            console.warn(`No document found or updated with ID: ${videoId}`);
            return { success: false, message: `No document found for ID: ${videoId}` };
        }

        console.log(`Successfully updated video with ID: ${videoId} to status: ${status}`);
        return { success: true, modifiedCount: result.modifiedCount };

    } catch (error) {
        console.error("❌ Failed to update video status:", error);
        throw new Error("❌ Failed to update video status.");
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Example usage
// await updateVideoStatus("your_db_url", "649c5e31c8900f001e7b415a", "completed", "https://your-hls-url.m3u8");