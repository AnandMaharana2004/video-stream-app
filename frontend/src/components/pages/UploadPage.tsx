"use client";

import React, { useState, useRef } from 'react';
import { Upload, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CancelFileUploadingController, UploadFileController } from '@/utils/actions/awsActions';

const UploadPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
  const [fileKey, setFileKey] = useState<string>('')

  // Popup management states
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Use a ref to store the XMLHttpRequest instance for cancellation
  const xhrRequestRef = useRef<XMLHttpRequest | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (file) {
      setFile(file);
    }
  };

  // Function to handle upload cancellation
  const handleCancelUpload = async () => {
    if (xhrRequestRef.current) {
      xhrRequestRef.current.abort();
      console.log('Upload aborted by user.');
    }
    await CancelFileUploadingController(fileKey)
    setShowProgressModal(false);
    setIsLoading(false);
    setUploadProgress(0);
    setMessage({ text: 'Upload cancelled.', type: 'error' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: null });
    setUploadProgress(0);

    if (!videoFile) {
      setMessage({ text: 'Please select a video file to upload.', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Show the popup immediately after validation
    setShowProgressModal(true);

    try {
      const { presignedUrl, fileKey } = await UploadFileController(
        videoFile.name,
        videoFile.size.toString(),
        videoFile.type,
        videoTitle,
        videoDescription
      );
      setFileKey(fileKey)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRequestRef.current = xhr; // Store the XHR object in a ref

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percentCompleted);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setMessage({ text: 'Video uploaded successfully ✅', type: 'success' });
            resolve();
          } else {
            setMessage({ text: 'An error occurred during the upload. Please try again.', type: 'error' });
            reject(new Error(xhr.statusText));
          }
        };

        xhr.onerror = () => {
          setMessage({ text: 'A network error occurred. Please check your connection.', type: 'error' });
          reject(new Error('Network error'));
        };

        xhr.onabort = () => {
          reject(new Error('Upload aborted'));
        };

        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', videoFile.type);
        xhr.send(videoFile);
      });

    } catch (error) {
      if (error instanceof Error && error.message !== 'Upload aborted') {
        console.error('Upload failed:', error);
        setMessage({ text: 'An error occurred during the upload. Please try again.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
      setShowProgressModal(false);
      xhrRequestRef.current = null; // Clean up the ref
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Upload Your Video
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... All your existing form inputs here ... */}

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

      {/* --- THE POPUP CODE --- */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Uploading...</h2>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCancelUpload}
              >
                Cancel
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              {uploadProgress}% Complete
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { UploadPage };