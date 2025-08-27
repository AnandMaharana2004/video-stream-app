"use client";
// import { GrCloudUpload } from "react-icons/gr";
import React from "react";
import VideoList from "../Video";
import { IReturnVideoData } from "@/actions/actions";
// import UploadingAnimation from "@/components/UploadingAnimation"; // Import the new component
// import { useRouter } from "next/navigation"; // Import useRouter
import Navbar from "../Navbar";


function VideosPage({ videos }: { videos: IReturnVideoData[] }) {
  

  return (
    <div className="relative">
      <Navbar />

      {/* Video List */}
      <div className="px-6 py-4">
        <VideoList videos={videos} />
      </div>

      {/* Popup Modal */}
      
    </div>
  );
}

export default VideosPage;