// This is a new component for the loading animation.
// Create a new file, e.g., components/UploadingAnimation.tsx
import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const UploadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-600 border-t-blue-500 animate-spin"></div>
        <div className="flex items-center justify-center w-full h-full text-blue-500">
          <AiOutlineCloudUpload className="text-5xl" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-white">Uploading Video...</h2>
      <p className="text-sm text-gray-400 mt-2">
        Your video is being processed. Please wait.
      </p>
    </div>
  );
};

export default UploadingAnimation;