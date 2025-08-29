"use client"
import React, { useRef, useEffect, useState } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels'; // Make sure this is installed: npm install videojs-contrib-quality-levels @types/videojs-contrib-quality-levels

// Define the interface for a single quality level from videojs-contrib-quality-levels
interface QualityLevel {
  id: string;
  height: number;
  bitrate: number;
  width: number;
  enabled: boolean;
}

// Define the interface for the qualityLevels return object
interface QualityLevels {
  length: number;
  selectedIndex: number;
  levels: QualityLevel[];
  [key: number]: QualityLevel; // Allow direct indexing
}

// Define a type for Video.js event handler function
type VideoJsEventHandler = (...args: unknown[]) => void;

// Define a base Component interface for Video.js components
interface VideoJsComponent {
  getChild(name: string): VideoJsComponent | undefined;
  children(): VideoJsComponent[];
  addChild(component: string | VideoJsComponent, options?: ComponentOptions, index?: number): VideoJsComponent;
}

// Define interface for control bar component options
interface ComponentOptions {
  [key: string]: unknown;
}
// Extend VideoJsPlayer to include methods/properties added by plugins or that ESLint / TS struggles with
declare module 'video.js' {
  interface VideoJsPlayer {
    qualityLevels(): QualityLevels;
    on(type: string, fn: VideoJsEventHandler): this;
    dispose(): void;
    controlBar: VideoJsControlBar;
  }

  // Use type alias instead of empty interface
  type VideoJsControlBar = VideoJsComponent;

  // Extend Button component's prototype if controlText method isn't recognized
  interface Button {
    controlText(text: string): void;
  }
}

// Interface for the resolution objects stored in our state
interface ResolutionOption {
  id: string;
  label: string;
  height: number | null;
  bitrate: number | null;
}

interface VideoPlayerProps {
  src: string; // The .m3u8 URL
  poster?: string; // Optional poster image
  autoplay?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  width?: number;
  height?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = false,
  controls = true,
  preload = 'auto',
  width,
  height,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  // Use ResolutionOption[] for the resolutions state
  const [resolutions, setResolutions] = useState<ResolutionOption[]>([]);
  const [currentResolution, setCurrentResolution] = useState<string>('auto');

  useEffect(() => {
    if (!playerRef.current) {
      // Initialize the Video.js player
      // Cast the result of videojs() to VideoJsPlayer to assert our extended interface
      const player = videojs(videoRef.current!, {
        autoplay,
        controls,
        preload,
        responsive: true,
        fluid: true,
        html5: {
          hls: {
            withCredentials: false,
          },
        },
        sources: [
          {
            src: src,
            type: 'application/x-mpegURL',
          },
        ],
      }, () => {
        console.log('Video.js Player is ready');
      }) as unknown as VideoJsPlayer; // Double cast to satisfy TypeScript

      playerRef.current = player;

      player.on('loadedmetadata', () => {
        if (player.qualityLevels) {
          const qualityLevels = player.qualityLevels();
          if (qualityLevels && qualityLevels.length > 0) {
            const availableResolutions: ResolutionOption[] = [];
            for (let i = 0; i < qualityLevels.length; i++) {
              const level = qualityLevels[i];
              if (level.height || level.bitrate) {
                availableResolutions.push({
                  id: level.id,
                  label: level.height ? `${level.height}p` : `${(level.bitrate / 1000).toFixed(0)} kbps`,
                  height: level.height,
                  bitrate: level.bitrate,
                });
              }
            }
            availableResolutions.unshift({ id: 'auto', label: 'Auto', height: null, bitrate: null });
            setResolutions(availableResolutions);
          }
        } else {
            console.warn("qualityLevels() not found. Ensure 'videojs-contrib-quality-levels' is installed and imported.");
        }
      });

      setCurrentResolution('auto');
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, autoplay, controls, preload]);

  const handleResolutionChange = (resolutionId: string) => {
    setCurrentResolution(resolutionId);
    if (playerRef.current && playerRef.current.qualityLevels) {
      const qualityLevels = playerRef.current.qualityLevels();
      if (qualityLevels) {
        for (let i = 0; i < qualityLevels.length; i++) {
          const level = qualityLevels[i];
          level.enabled = (resolutionId === 'auto' || level.id === resolutionId);
        }
        console.log(`Switched to resolution: ${resolutionId}`);
      }
    }
  };

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        poster={poster}
        style={{ width: width, height: height }}
      />
      {resolutions.length > 1 && (
        <div style={{ padding: '10px', backgroundColor: '#333', color: 'white' }}>
          <span>Resolution: </span>
          {resolutions.map((res) => (
            <button
              key={res.id}
              onClick={() => handleResolutionChange(res.id)}
              style={{
                margin: '0 5px',
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: currentResolution === res.id ? '#007bff' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              {res.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;