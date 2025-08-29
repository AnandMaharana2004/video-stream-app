"use client";
import React from "react";
import VideoList from "@/components/Video";
import { IReturnVideoData } from "@/actions/actions";
import Navbar from "@/components/Navbar";

function VideosPage({ videos }: { videos: IReturnVideoData[] }) {
  return (
    <div>
      <Navbar />
      <div className="px-6 py-4">
        <VideoList videos={videos} />
      </div>
    </div>
  );
}

export default VideosPage;