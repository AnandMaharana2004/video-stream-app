"use client";
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// Removed incorrect player ref at the top level; handled inside the component.


// Sample public HLS (m3u8) video sources
const sampleVideos = [
    {
        title: "Big Buck Bunny (HLS Demo)",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    },
    {
        title: "Sintel (HLS Demo)",
        url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
    },
    {
        title: "Tears of Steel (HLS Demo)",
        url: "https://test-streams.mux.dev/tears-of-steel/playlist.m3u8"
    }
];

function Page() {
    const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const videoNode = useRef<HTMLVideoElement | null>(null);
    const player = useRef<videojs.Player | null>(null);

    useEffect(() => {
        if (videoNode.current) {
            if (!player.current) {
                player.current = videojs(videoNode.current, {
                    controls: true,
                    responsive: true,
                    fluid: true,
                    sources: [{
                        src: selectedVideo.url,
                        type: "application/x-mpegURL"
                    }]
                });
            } else {
                player.current.src({ src: selectedVideo.url, type: "application/x-mpegURL" });
                player.current.poster(""); // Clear poster if any
            }
        }
        return () => {
            // Clean up player on component unmount
            if (player.current) {
                player.current.dispose();
                player.current = null;
            }
        };
        // eslint-disable-next-line
    }, [selectedVideo]);

    return (
        <div className="flex min-h-screen bg-neutral-950 text-white flex-col sm:flex-row">
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
                <button
                    aria-label="Open video menu"
                    className="focus:outline-none"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    {/* Hamburger Icon */}
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                    </svg>
                </button>
                <span className="text-lg font-bold">HLS Streaming Player</span>
            </div>

            {/* Left Side: Video List */}
            <div
                className={`
                    leftside bg-neutral-900 border-r border-neutral-800 flex-col p-4 z-20
                    fixed top-0 left-0 h-full w-4/5 max-w-xs transition-transform duration-300
                    sm:relative sm:top-auto sm:left-auto sm:h-auto sm:w-1/4 sm:max-w-xs sm:translate-x-0
                    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                    sm:translate-x-0 sm:flex
                `}
                style={{ minWidth: "200px" }}
            >
                {/* Mobile close button */}
                <div className="sm:hidden flex justify-between items-center mb-6">
                    <span className="text-xl font-bold">Videos</span>
                    <button
                        aria-label="Close menu"
                        className="focus:outline-none"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {/* Close Icon */}
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <h2 className="hidden sm:block text-xl font-bold mb-4">Video List</h2>
                <ul className="space-y-2">
                    {sampleVideos.map((video) => (
                        <li key={video.title}>
                            <button
                                className={`
                                    w-full text-left px-4 py-2 rounded-lg transition font-medium
                                    ${selectedVideo.title === video.title
                                        ? "bg-neutral-800 text-green-400"
                                        : "hover:bg-neutral-800"}
                                `}
                                onClick={() => {
                                    setSelectedVideo(video);
                                    setMobileMenuOpen(false); // Close on mobile after selection
                                }}
                            >
                                {video.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Overlay for mobile menu */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-10 sm:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Right Side: Video Player */}
            <div className="rightside flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">{selectedVideo.title}</h2>
                    <div data-vjs-player>
                        <video
                            ref={videoNode}
                            className="video-js vjs-big-play-centered vjs-theme-forest w-full aspect-video rounded-lg shadow-lg bg-black"
                            controls
                            playsInline
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;