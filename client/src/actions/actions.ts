import { User } from "@/models/userModel";
import { Video } from "@/models/videoModel";
import { connectTODB } from "@/utils/dbConnection";

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
    const returnData = videos.map((video) => {
        return {
            videoId: video._id,
            videoTitle: video.title,
            videoDescription: video.description,
            videoUrl: video.cloudFrontUrl,
            thamdilUrl: `https://d11wd0j17w56pr.cloudfront.net/${encodeURIComponent(video.thamdilPicUrl)}`,
            autoherName: "Anand Maharana"
        }
    })
    // const returnData: IReturnVideoData[] = [
    //     {
    //         videoId: "ertyuiuytrewsdfghjkhgfdw11111",
    //         videoTitle: "this is the test data",
    //         videoDescription: "any video description",
    //         videoUrl: "this contain the master.m3u8 file url",
    //         thamdilUrl: "https://d11wd0j17w56pr.cloudfront.net/68a4836b4775c5ef74d6e773-WhatsApp%20Image%202025-05-25%20at%2010.25.45%20PM.jpeg",
    //         autoherName: "Anand Maharana"
    //     },
    //     {
    //         videoId: "ertyuiuytrewsdfghjkhgfdw22222",
    //         videoTitle: "this is the test data",
    //         videoDescription: "any video description",
    //         videoUrl: "this contain the master.m3u8 file url",
    //         thamdilUrl: "https://i.ytimg.com/vi/9zZfabSup8c/hq720.jpg",
    //         autoherName: "Anand Maharana"
    //     },
    //     {
    //         videoId: "ertyuiuytrewsdfghjkhgfdw33333",
    //         videoTitle: "this is the test data",
    //         videoDescription: "any video description",
    //         videoUrl: "this contain the master.m3u8 file url",
    //         thamdilUrl: "https://i.ytimg.com/vi/1OAjeECW90E/hqdefault.jpg",
    //         autoherName: "Anand Maharana"
    //     },
    //     {
    //         videoId: "ertyuiuytrewsdfghjkhgfdw44444",
    //         videoTitle: "this is the test data",
    //         videoDescription: "any video description",
    //         videoUrl: "this contain the master.m3u8 file url",
    //         thamdilUrl: "https://i.ytimg.com/vi/gvhVtaEA1z8/hq720.jpg",
    //         autoherName: "Anand Maharana"
    //     }
    // ];
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
            profilePic: "https://lh3.googleusercontent.com/ogw/AF2bZyjSDEA0RHfwdkGiSl0SBlfWZI0yHFeQPmLKJ3YVw0q-Xj0=s64-c-mo",
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
            thumbnail: `https://d11wd0j17w56pr.cloudfront.net/${encodeURIComponent(video.thamdilPicUrl)}`,
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

export async function getVideoInfo(videoID: string) {
    // this function return the videos metadata and the .m3u8file also 
    // for this we will use aggrigate and fetch data like 
    // {
    //     videoId ,
    //     videosUrl : .m3u8
    //     thatmdilUrl, 
    //     User name, 
    //     userprofilePic, 
    //     // recomand videos [] in future 
    // }

    try {
        await connectTODB()
        const videoId = new mongoose.Types.ObjectId(videoID)

        const video = await Video.findById(videoId)
        if (!video) throw Error("Invalid Video Id please provide proper video id ")

        return {
            videoId: video._id,
            videoUrl: `https://${video.cloudFrontUrl}`,
            thamdilUrl: `https://d11wd0j17w56pr.cloudfront.net/${encodeURIComponent(video.thamdilPicUrl)}`,
            User: "Anand Maharana",
            userprofilePic: "https://lh3.googleusercontent.com/ogw/AF2bZyjSDEA0RHfwdkGiSl0SBlfWZI0yHFeQPmLKJ3YVw0q-Xj0=s64-c-mo",
            descripton: `${video.description}`,
            title: `${video.title}`
        }

    } catch (error) {
        console.log("Error on the getVideoInfo function ", error)
        throw Error("something went wrong whilee fetch video data")
    }
}