import { User } from "@/models/UserModel";
import { Video } from "@/models/VideoModels";
import { connectTODB } from "@/utils/Dbconnection";

import mongoose from "mongoose";


export interface IReturnVideoData {
    videoId: string;
    videoTitle: string;
    videoDescription: string;
    videoUrl: string;
    thamdilUrl: string;
    autoherName: string;
}

export async function GetVideos(): Promise<IReturnVideoData[]> {
    await connectTODB()
    const videos = await Video.find({ status: "completed" })
    console.log("videos : ", videos)

    // await GetUserVideos('68947fc053efc9f42bc60a3c')
    // console.log("the videhgfdsdfghjis ;: ", await GetVideosForUploadPage("68947fc053efc9f42bc60a3c"))
    // console.log("user is : ", await getUserInfo("68947fc053efc9f42bc60a3c"))
    // mock database response
    const returnData: IReturnVideoData[] = [
        {
            videoId: "ertyuiuytrewsdfghjkhgfdw11111",
            videoTitle: "this is the test data",
            videoDescription: "any video description",
            videoUrl: "this contain the master.m3u8 file url",
            thamdilUrl: "https://i.ytimg.com/vi/nzBwdkjEo-Y/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCoHGIRsqY5VGkX7VOdcaWHKjaYmw",
            autoherName: "Anand Maharana"
        },
        {
            videoId: "ertyuiuytrewsdfghjkhgfdw22222",
            videoTitle: "this is the test data",
            videoDescription: "any video description",
            videoUrl: "this contain the master.m3u8 file url",
            thamdilUrl: "https://i.ytimg.com/vi/9zZfabSup8c/hq720.jpg",
            autoherName: "Anand Maharana"
        },
        {
            videoId: "ertyuiuytrewsdfghjkhgfdw33333",
            videoTitle: "this is the test data",
            videoDescription: "any video description",
            videoUrl: "this contain the master.m3u8 file url",
            thamdilUrl: "https://i.ytimg.com/vi/1OAjeECW90E/hqdefault.jpg",
            autoherName: "Anand Maharana"
        },
        {
            videoId: "ertyuiuytrewsdfghjkhgfdw44444",
            videoTitle: "this is the test data",
            videoDescription: "any video description",
            videoUrl: "this contain the master.m3u8 file url",
            thamdilUrl: "https://i.ytimg.com/vi/gvhVtaEA1z8/hq720.jpg",
            autoherName: "Anand Maharana"
        }
    ];
    return returnData;
}

export async function GetUserVideos(authorID: string) {
    // find videos on the basis of autor id and return them
    try {
        const userID = new mongoose.Types.ObjectId(authorID)
        await connectTODB()

        const Videos = await Video.aggregate([
            {
                $match: { author: userID }
            },
            {
                $lookup: {
                    from: "videotranscodeusers",           // the collection name (check your MongoDB)
                    localField: "author",    // field in Video
                    foreignField: "_id",     // field in User
                    as: "authorDetails"
                }
            },
            {
                $unwind: "$authorDetails" // flatten array
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    "authorDetails._id": 1,
                    "authorDetails.username": 1,
                    "authorDetails.profilePic": 1
                }
            }
        ])

        console.log("my persional videos : ", Videos)
    } catch (error) {
        console.log("Some thing went wrong wile GetUsser Videos", error)
        throw new Error("something went worng!!")
    }


}

// export async function DeleteVideo(videoID:string) {
//     // find the video and delete also delete the object from s3 also
// }

// export async function UpdateVideo(videoID:string) {
//     // find the video and update what ever the user want to update
// }

// get usre info 
export async function getUserInfo(userID: string) {
    try {
        await connectTODB();
        const userid = new mongoose.Types.ObjectId(userID);
        const user = await User.findById(userid);

        if (!user) throw new Error("Invalid user id, user not found ❌");

        const numberOfVideos = await Video.countDocuments({ author: userid });

        return {
            userID,
            userName: user.username,
            profilePic: user.profilePic || "https://yt3.ggpht.com/yfDlM-R-AdeTSX5H2a_4OX2bzr3wr8kcof8JgQk6Y32aNWBpehOMZFOaYrr6BhjT3U0KueVibg=s88-c-k-c0x00ffffff-no-rj",
            numberOfVideos,
        };
    } catch (error: unknown) {
        console.error("Error in getUserInfo:", error);
        throw new Error("Something went wrong while getting user info ❌");
    }
}

export async function GetVideosForUploadPage(userID: string) {
    try {
        await connectTODB();
        const userId = new mongoose.Types.ObjectId(userID);

        const videos = await Video.find({ author: userId });
        // console.log("Videos fetched for UploadPage:", videos);

        return videos.map((video) => ({
            videoID: video._id.toString(),
            videoTitle: video.title,
            status: video.status,
            thumbnail: video.thumbnailPicUrl || "https://default-thumbnail-url.com/thumb.jpg",
        }));
    } catch (error: unknown) {
        console.error("Error in GetVideosForUploadPage:", error);
        throw new Error("Something went wrong in GetVideosForUploadPage ❌");
    }
}

export async function RefresshVideo(videoID: string) {
    try {
        await connectTODB()
        const videoId = new mongoose.Types.ObjectId(videoID)
        const video = await Video.findById(videoId).select("status")
        if (!video) throw Error("Envaid video id or fail to find Video")
        console.log("video with status is : ", video)
        return {
            _id: video._id,
            status: video.status
        }
    } catch (error) {
        console.log("Something went wrong while Refresh video content !! ❌", error)
        throw Error("Something went wrong wile refresh the video content , Error on RefresshVideo function ")
    }
}