"use client";

import Image from "next/image";
// import Image from "next/image";
import { redirect } from "next/navigation";

type Video = {
    videoId: string;
    videoTitle: string;
    thamdilUrl: string;
    autoherName: string;
    videoDescription: string;
};

export default function VideoList({ videos }: { videos: Video[] }) {
    function handleClickVideo(videoId: string) {
        console.log("The video with id:", videoId, "is clicked"); // runs in browser
        redirect(`/videos/${videoId}`)

    }

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
                <div
                    key={index}
                    onClick={() => handleClickVideo(video.videoId)}
                    className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                    {/* Thumbnail */}
                    <div className="w-full h-48 overflow-hidden">
                        <Image
                            src={video.thamdilUrl}
                            alt={video.videoTitle}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Metadata */}
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {video.videoTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{video.autoherName}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {video.videoDescription}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
