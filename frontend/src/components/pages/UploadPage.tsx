// UploadPage.tsx
"use client";
import React, { useState } from "react";
// import { Navbar } from "@/components/Navbar";
import { FaTrash, FaEdit, FaSyncAlt, FaEye } from "react-icons/fa";
import EditPopup from "@/components/EditPopup";
import Image from "next/image";
import { redirect } from "next/navigation";

// Define types
type Video = {
  videoID: string;
  videoTitle: string; // Corrected type name for clarity
  thumbnail: string;
  status: string;
  // Add other fields as needed
};

type User = {
  profilePic: string;
  userName: string;
  numberOfVideos: number;
  // Add other fields as needed
};

interface UploadPageProps {
  user: User;
  videoData: Video[];
  refresshAction: (videoID: string) => Promise<{ _id: string; status: string }>;
}

function UploadPage({ user, videoData: initialVideoData, refresshAction }: UploadPageProps) {
  const [videoData, setVideoData] = useState<Video[]>(initialVideoData);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [refreshingVideoId, setRefreshingVideoId] = useState<string | null>(
    null
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Uploading":
        return "bg-yellow-500/20 text-yellow-300";
      case "processing":
        return "bg-blue-500/20 text-blue-300";
      case "completed":
        return "bg-green-500/20 text-green-300";
      default:
        return "bg-gray-400/20 text-gray-300";
    }
  };

  const handleEditClick = (video: Video) => {
    setSelectedVideo(video);
    setIsEditPopupOpen(true);
  };

  const handleRefreshClick = async (videoID: string) => {
    setRefreshingVideoId(videoID);

    try {
      // ✅ Await the server action
      const result = await refresshAction(videoID);

      // Example server action returns { videoID, status }
      console.log("Server returned:", result);

      setVideoData((prevData) =>
        prevData.map((video) =>
          video.videoID === videoID ? { ...video, status: result.status } : video
        )
      );
    } catch (error) {
      console.error("Error refreshing video:", error);

      // fallback to "failed"
      setVideoData((prevData) =>
        prevData.map((video) =>
          video.videoID === videoID ? { ...video, status: "failed" } : video
        )
      );
    } finally {
      setRefreshingVideoId(null);
    }
  };

  const handleViewClick = (videoID: string) => {
    redirect(`videos/${videoID}`)
  }
  return (
    <div className="bg-zinc-900 text-gray-200 min-h-screen">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-lg bg-zinc-800 border border-zinc-700 shadow-md mb-8">
          <Image
            src={user?.profilePic}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user?.userName}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {user?.numberOfVideos} Videos Uploaded
            </p>
          </div>
        </div>

        {/* Videos List Section */}
        <div className="p-6 rounded-lg bg-zinc-800 border border-zinc-700 shadow-md">
          <h3 className="text-xl font-semibold mb-6">Your Uploads</h3>
          <div className="space-y-4">
            {videoData.map((video) => (
              <div
                key={video.videoID}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-700 rounded-lg p-4 transition-transform hover:scale-[1.01]"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                  <Image
                    src={video.thumbnail}
                    alt="video thumbnail"
                    className="w-full sm:w-32 h-auto sm:h-20 object-cover rounded-md border border-zinc-600"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] overflow-hidden">
                      <p className="font-medium text-lg truncate" title={video.videoTitle}>
                        {video.videoTitle}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${getStatusColor(
                        video.status
                      )}`}
                    >
                      {video.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center sm:justify-end gap-4 text-gray-400 w-full sm:w-auto">
                  <button
                    onClick={() => handleEditClick(video)}
                    className="hover:text-blue-500 transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={20} />
                  </button>

                  <button
                    className="hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={20} />
                  </button>

                  {video.status.toLowerCase() === "completed" ? (   // 👈 normalize case
                    <button
                      onClick={() => {
                        handleViewClick(video.videoID)
                      }}
                      className="hover:text-green-500 transition-colors"
                      title="View"
                    >
                      <FaEye size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRefreshClick(video.videoID)}
                      className="hover:text-green-500 transition-colors"
                      title="Refresh"
                      disabled={refreshingVideoId === video.videoID}  // 👈 optional UX
                    >
                      <FaSyncAlt
                        size={20}
                        className={
                          refreshingVideoId === video.videoID ? "animate-spin" : ""
                        }
                      />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {isEditPopupOpen && selectedVideo && (
        <EditPopup
          video={selectedVideo}
          onClose={() => setIsEditPopupOpen(false)}
          onSave={(data) => console.log("Saved data:", data)}
        />
      )}
    </div>
  );
}

export default UploadPage;