"use client"

import React, { useState, useRef } from 'react';
import { Upload, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { UploadFileController } from '@/utils/actions/awsActions';

const UploadPage: React.FC = () => {
  // State variables, now with explicit TypeScript types
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });

  // Refs for file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Helper function to handle file selection
  const handleFileChange = (file: File | null, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (file) {
      setFile(file);
    }
  };

  // Handle the form submission and the entire upload process
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: null });

    if (!videoFile) {
      setMessage({ text: 'Please select a video file to upload.', type: 'error' });
      setIsLoading(false);
      return;
    }

    // In a real app, you would make an API call to your backend
    // to get the pre-signed URL.
    try {

      const { presignedUrl } = await UploadFileController(videoFile.name, videoFile.size.toString(), videoFile.type, videoTitle, videoDescription)
      // then pass the file buffer data on the presigned url 
      const result = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': videoFile.type,
        },
        body: videoFile,
      });

      if (result.ok) {
        setMessage({ text: "Video uploaded successfluy ✅", type: "success" })
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ text: 'An error occurred during the upload. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Upload Your Video
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Video Upload Section */}
          <div>
            <label htmlFor="video-file" className="block text-sm font-medium text-gray-700">
              Video File
            </label>
            <div
              className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors duration-200"
              onClick={() => videoInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    {videoFile ? videoFile.name : 'Select a video file'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  MP4, MOV, AVI up to 1GB
                </p>
              </div>
            </div>
            <input
              id="video-file"
              name="video-file"
              type="file"
              className="sr-only"
              accept="video/*"
              ref={videoInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null, setVideoFile)}
            />
          </div>

          {/* Thumbnail Upload Section */}
          <div>
            <label htmlFor="thumbnail-file" className="block text-sm font-medium text-gray-700">
              Thumbnail
            </label>
            <div
              className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors duration-200"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    {thumbnailFile ? thumbnailFile.name : 'Select a thumbnail'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            <input
              id="thumbnail-file"
              name="thumbnail-file"
              type="file"
              className="sr-only"
              accept="image/*"
              ref={thumbnailInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null, setThumbnailFile)}
            />
          </div>

          {/* Video Title Input */}
          <div>
            <label htmlFor="video-title" className="block text-sm font-medium text-gray-700">
              Video Title
            </label>
            <div className="mt-1">
              <input
                id="video-title"
                name="video-title"
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Enter a title for your video"
              />
            </div>
          </div>

          {/* Video Description Textarea */}
          <div>
            <label htmlFor="video-description" className="block text-sm font-medium text-gray-700">
              Video Description
            </label>
            <div className="mt-1">
              <textarea
                id="video-description"
                name="video-description"
                rows={3}
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Tell us about your video"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !videoFile}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Film className="w-5 h-5 mr-2" />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </form>

        {/* Message Display Area */}
        {message.text && (
          <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { UploadPage };
