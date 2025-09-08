import { DeleteFilesFromS3, DeleteWholeFolder } from "@/aws/setup";
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

// export async function GetVideos(): Promise<IReturnVideoData[]> {
//     await connectTODB()
//     const videos = await Video.find({ status: "completed" })

//     // use aggrigaton pipeline here and get inforrmaton

//     const returnData = videos.map((video) => {
//         return {
//             videoId: `${video._id}`,
//             videoTitle: `${video.title}`,
//             videoDescription: `${video.description}`,
//             videoUrl: `${video.cloudFrontUrl}`,
//             thamdilUrl: `https://d11wd0j17w56pr.cloudfront.net/${encodeURIComponent(video.thamdilPicUrl)}`,
//             autoherName: `Anand Maharana`
//         }
//     })
//     return returnData;
// }

export async function GetVideos(): Promise<IReturnVideoData[]> {
    await connectTODB();

    const videos = await Video.aggregate([
        {
            $match: {
                status: "Completed",
                isPublic: true
            }
        },
        {
            $lookup: {
                from: "videotranscodeusers",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails"
            }
        },
        {
            $unwind: "$authorDetails"
        },
        {
            $project: {
                _id: 0,
                videoId: "$_id",
                videoTitle: "$title",
                videoDescription: "$description",
                videoUrl: "$cloudFrontUrl",
                thamdilUrl: {
                    $concat: ["https://d11wd0j17w56pr.cloudfront.net/", "$thamdilPicUrl"]
                },
                authorName: "$authorDetails.username",
                // authorProfilePic: "$authorDetails.profilePic"
            }
        }
    ]);

    return videos as IReturnVideoData[];
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
            profilePic: `${user?.profilePic}`,
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
    try {
        await connectTODB()
        const videoId = new mongoose.Types.ObjectId(videoID)

        const video = await Video.findById(videoId)
        if (!video) throw Error("Invalid Video Id please provide proper video id ")
        const user = await User.findById(video.author)
        if (!user) throw Error("Invaid User id or user not found")
        const userprofilePic = user?.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.username.split(" ").join("+")}`
        return {
            videoId: video._id,
            videoUrl: `https://${video.cloudFrontUrl}`,
            thamdilUrl: `https://d11wd0j17w56pr.cloudfront.net/${encodeURIComponent(video.thamdilPicUrl)}`,
            User: `${user.username}`,
            userprofilePic: `${userprofilePic}`,
            descripton: `${video.description}`,
            title: `${video.title}`
        }

    } catch (error) {
        console.log("Error on the getVideoInfo function ", error)
        throw Error("something went wrong whilee fetch video data")
    }
}

export async function deleteVideo(videoID: string) {
    try {
        /*
        find  particular file 
        first delete the file from HLss S3
        if the video on the state of precess then you do't aboe to delte it you delete it after complete
        if staus is ("completed, uploading, fails ") then you able to delete that, 
        */

        await connectTODB()
        const videoId = new mongoose.Types.ObjectId(videoID)
        const video = await Video.findById(videoId)
        if (!video) throw Error("Invalid id or video not found!!")
        const status = video.status.toLowerCase()
        console.log("the video status is : ", status)
        if (status === "completed" || status === "uploading" || status === "failed") {
            // then delte the file
            if (video.cloudFrontUrl) {
                const [_, hlsKey, __] = video.cloudFrontUrl.split("/")
                console.log(_, __)
                const fullHlskey = `permanent/hls/${hlsKey}/`;
                const thamdilKey = `permanent/thumbnail-images/${video.thamdilPicUrl}`
                const bucket = process.env.TEMPORARY_BUCKET
                if (!bucket) { console.log("please provide bucket key in .env file"); return { status: false } }
                const result = await DeleteWholeFolder(fullHlskey, bucket)
                const result2 = await DeleteFilesFromS3(thamdilKey, bucket)
                if (!result) {
                    console.log("something went wrong while delteting HLS file");
                    return { status: false }
                }
                if (!result2) {
                    console.log("something went wrong while delteting thamdil file");
                    return { status: false }
                }
                await Video.findOneAndDelete({ _id: videoId })
                return {
                    videoStaus: status,
                    message: "File delte successfuly ✅",
                    success: true
                }
            }
        } else if (status === "processing") {
            return {
                videoStaus: status,
                message: "After the competed you able ot dete the file",
                success: false
            }
        }
        // const video 

        return {
            videoStaus: status,
            message: "After the competed you able ot dete the file",
            success: false,
            data: video
        }
    } catch (error: unknown) {
        console.log(`Internal serveer error while delete video with id : ${videoID}`, error)
        return {
            videoStaus: null,
            message: "Internal serveer error while delete video with id : ${videoID}",
            success: false,
            data: null
        }
        // throw Error(`Internal serveer error while delete video with id : ${videoID}`,)
    }
}
