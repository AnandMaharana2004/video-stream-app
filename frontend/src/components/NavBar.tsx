"use client"
import React, { useRef, useState } from 'react'
import UploadingAnimation from './UploadingAnimation';
import { GrCloudUpload } from 'react-icons/gr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadFileController } from '@/actions/s3Actions';
import Image from 'next/image';

// interface HandleButtonOnClickEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> { }

function Navbar() {
    const [isPopup, setIsPopup] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

    // This is the corrected function signature.
    const handleButtonOnclick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        setIsPopup((pre) => !pre);
        setSelectedFile(null);
        setThumbnail(null);
        setThumbnailPreview(null);
        setIsUploading(false);
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleThumbnailSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile || !thumbnail) return;

        setIsUploading(true);

        try {
            // Collect metadata
            const formData = new FormData(e.currentTarget);
            const title = formData.get("title") as string;
            const description = formData.get("description") as string;
            // const publish = formData.get("publish") ? true : false;

            // Get presigned URLs from server
            const { videoPresignedUrl, thamadilPresignedUrl } =
                await UploadFileController(
                    selectedFile.name,
                    `${selectedFile.size}`,
                    selectedFile.type,
                    thumbnail.name,
                    `${thumbnail.size}`,
                    thumbnail.type,
                    title,
                    description
                );

            // Upload video to S3
            await fetch(videoPresignedUrl, {
                method: "PUT",
                body: selectedFile,
                headers: { "Content-Type": selectedFile.type },
            });

            // Upload thumbnail to S3
            await fetch(thamadilPresignedUrl, {
                method: "PUT",
                body: thumbnail,
                headers: { "Content-Type": thumbnail.type },
            });

            // Save metadata (optional: call your backend to store DB record)
            // await fetch("/api/save-video-metadata", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         title,
            //         description,
            //         publish,
            //         videoKey: VideoFileKey,
            //         thumbnailKey: thamadilFileKey,
            //     }),
            // });

            // Redirect
            setIsUploading(false);
            setIsPopup(false);
            router.push("/upload");

        } catch (err) {
            console.error("Upload failed ❌", err);
            setIsUploading(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <div className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900 text-white sticky top-0 z-20">
                <Link href={"/videos"} >
                    <h2 className="text-xl font-bold" >Stream-Hub</h2>
                </Link>
                <div className='flex gap-4 items-center'>
                    <Link href={"/upload"}> Uploads</Link>
                    <button
                        onClick={handleButtonOnclick}
                        className="px-4 py-1.5 rounded-xl cursor-pointer bg-blue-500 hover:bg-blue-600 transition"
                    >
                        + Create
                    </button>
                </div>
            </div>

            {/* Popup */}
            {isPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-zinc-800 rounded-lg shadow-lg p-6 w-[650px] relative text-white">
                        <button
                            onClick={handleButtonOnclick}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                        {isUploading ? (
                            <UploadingAnimation />
                        ) : (
                            <>
                                {!selectedFile && (
                                    <div className="flex flex-col items-center">
                                        <h2 className="text-lg font-semibold mb-4 text-center">
                                            Upload Video
                                        </h2>
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 transition cursor-pointer w-full ${dragActive
                                                ? "border-blue-400 bg-blue-500/10"
                                                : "border-gray-500 bg-zinc-900"
                                                }`}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <GrCloudUpload className="text-6xl mb-3" />
                                            <p className="text-sm mb-2">
                                                Drag & drop your video here, or click below
                                            </p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleFileSelect(e.target.files)}
                                                className="hidden"
                                            />
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                                        >
                                            Select File
                                        </button>
                                    </div>
                                )}

                                {selectedFile && (
                                    <form onSubmit={handleSubmitForm} className="space-y-4">
                                        <h2 className="text-lg font-semibold mb-4 text-center">
                                            Video Details
                                        </h2>
                                        <p className="text-sm text-gray-400 mb-2 text-center">
                                            Selected file:{" "}
                                            <span className="font-medium">{selectedFile.name}</span>
                                        </p>

                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm mb-1">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                className="w-full p-2 rounded bg-zinc-700 text-white outline-none"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                rows={3}
                                                className="w-full p-2 rounded bg-zinc-700 text-white outline-none"
                                            />
                                        </div>

                                        {/* Thumbnail Upload */}
                                        <div>
                                            <label className="block text-sm mb-1">Thumbnail (16:9)</label>
                                            <div
                                                className="border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:bg-zinc-700"
                                                style={{ aspectRatio: "16/9" }}
                                                onClick={() => thumbnailInputRef.current?.click()}
                                            >
                                                {thumbnailPreview ? (
                                                    <Image
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        Click to upload thumbnail (16:9)
                                                    </div>
                                                )}
                                                <input
                                                    ref={thumbnailInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleThumbnailSelect(e.target.files)}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>

                                        {/* Publish */}
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="publish" name="publish" />
                                            <label htmlFor="publish">Publish immediately</label>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`w-full py-2 rounded-md font-medium transition ${isUploading
                                                ? "bg-green-700 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-green-600"
                                                }`}
                                        >
                                            {isUploading ? "Uploading..." : "Submit"}
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export  {Navbar};
