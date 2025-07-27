"use client";
import React, { useRef, useState } from "react";

function Page() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setError(null);

        if (!selectedFile) {
            setIsUploading(false);
            setError("No file selected");
            return;
        }

        try {
            // 1. Request upload URL from backend
            const metaRes = await fetch("http://localhost:4000/videos/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: selectedFile.name,
                    fileSize: selectedFile.size,
                    fileType: selectedFile.type,
                }),
            });
            if (!metaRes.ok) {
                throw new Error("Failed to get upload URL from backend");
            }
            const response = await metaRes.json();
            const uploadUrl = response?.data?.url || response?.url;
            if (!uploadUrl) throw new Error("No upload URL returned from backend");
            // 2. Upload file to the provided URL (assume S3 signed URL or similar)
            const result = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type,
                },
                body: selectedFile,
            });

            setIsUploading(false);

            if (result.ok) {
                setUploadSuccess(true);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                console.log("✅ Video uploaded successfully!");
            } else {
                setError("❌ Upload failed with status: " + result.status);
            }
        } catch (e: any) {
            setIsUploading(false);
            setUploadSuccess(false);
            setError(e.message || "Unknown error");
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUploadAnother = () => {
        setUploadSuccess(false);
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
            <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-2xl p-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-8 tracking-tight text-center">
                    Upload Your Video
                </h1>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {error && (
                    <div className="w-full mb-4 text-red-400 bg-red-900/60 rounded p-2 text-center border border-red-500">
                        {error}
                    </div>
                )}

                {/* Initial state: Select file */}
                {!selectedFile && !isUploading && !uploadSuccess && (
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="w-full py-3 rounded-lg bg-white text-neutral-900 font-semibold tracking-wide hover:bg-neutral-200 transition"
                    >
                        Select File
                    </button>
                )}

                {/* File selected, show Upload/Cancel */}
                {selectedFile && !isUploading && !uploadSuccess && (
                    <div className="w-full flex flex-col items-center gap-6">
                        <div className="w-full text-neutral-400 text-center border border-neutral-700 rounded p-3">
                            <span className="font-semibold text-white">Selected:</span> {selectedFile.name}
                        </div>
                        <button
                            type="button"
                            onClick={handleUpload}
                            className="w-full py-3 rounded-lg bg-neutral-800 text-white font-semibold tracking-wide hover:bg-neutral-700 transition mb-2"
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-neutral-400 hover:text-red-500 underline text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Uploading state */}
                {isUploading && (
                    <div className="flex flex-col items-center w-full py-8">
                        <div className="loader mb-4"></div>
                        <div className="text-neutral-400 text-center">Uploading...</div>
                    </div>
                )}

                {/* Upload success state */}
                {uploadSuccess && (
                    <div className="flex flex-col items-center w-full gap-6 py-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-green-600 rounded-full p-3 mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-green-400 text-xl font-semibold text-center">
                                File uploaded successfully!
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleUploadAnother}
                            className="w-full py-3 rounded-lg bg-white text-neutral-900 font-semibold tracking-wide hover:bg-neutral-200 transition"
                        >
                            Upload Another File
                        </button>
                    </div>
                )}
            </div>

            {/* Loader CSS */}
            <style>{`
                .loader {
                    border: 4px solid #222;
                    border-top: 4px solid #fff;
                    border-radius: 50%;
                    width: 42px;
                    height: 42px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
            `}</style>
        </div>
    );
}

export default Page;