import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const allResolutions = [
    { name: "2K", width: 2560, height: 1440, bandwidth: 8000000 },
    { name: "1080p", width: 1920, height: 1080, bandwidth: 5000000 },
    { name: "720p", width: 1280, height: 720, bandwidth: 3000000 },
    { name: "480p", width: 854, height: 480, bandwidth: 1600000 },
    { name: "360p", width: 640, height: 360, bandwidth: 800000 },
    { name: "240p", width: 426, height: 240, bandwidth: 600000 },
    { name: "144p", width: 256, height: 144, bandwidth: 400000 },
];

function getVideoStreamDimensions(inputFilePath: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
            if (videoStream && typeof videoStream.width === 'number' && typeof videoStream.height === 'number') {
                resolve({ width: videoStream.width, height: videoStream.height });
            } else {
                reject(new Error("Could not find video stream dimensions."));
            }
        });
    });
}

export function convertToHLSFormat(inputFilePath: string, outputDirectory: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(inputFilePath)) {
                throw new Error(`🎥 Input video not found at: ${inputFilePath}`);
            }

            const ext = path.extname(inputFilePath).toLowerCase();
            if (ext !== ".mp4") {
                throw new Error(`❌ The input file must be an MP4. Found: ${ext}`);
            }

            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory, { recursive: true });
            }

            // Get input video resolution
            const inputDimensions = await getVideoStreamDimensions(inputFilePath);
            console.log(`Input video resolution: ${inputDimensions.width}x${inputDimensions.height}`);

            // Determine target resolutions based on input
            let targetResolutions = [];
            for (const res of allResolutions) {
                // Only include resolutions that are less than or equal to the input video's height
                if (inputDimensions.height >= res.height) {
                    targetResolutions.push(res);
                }
            }

            // If no suitable resolutions were found (e.g., very low resolution input),
            // default to the lowest available resolution (144p) to ensure something is generated.
            if (targetResolutions.length === 0 && inputDimensions.height > 0) {
                console.warn("Input video resolution is lower than all predefined resolutions. Converting to the smallest available resolution (144p).");
                targetResolutions.push(allResolutions[allResolutions.length - 1]); // Add 144p as a fallback
            }

            if (targetResolutions.length === 0) {
                throw new Error("Could not determine any suitable target resolutions for the input video.");
            }

            console.log("Target resolutions for HLS conversion:", targetResolutions.map(r => r.name).join(', '));

            const jobs = targetResolutions.map((resolution) => {
                return new Promise<void>((res, rej) => {
                    const resolutionFolder = path.join(outputDirectory, resolution.name);
                    if (!fs.existsSync(resolutionFolder)) {
                        fs.mkdirSync(resolutionFolder, { recursive: true });
                    }

                    const outputPath = path.join(resolutionFolder, "index.m3u8");

                    ffmpeg(inputFilePath)
                        .videoCodec("libx264")
                        .audioCodec("aac")
                        .addOptions([
                            "-preset veryfast",
                            "-g 48",
                            "-sc_threshold 0",
                            `-s ${resolution.width}x${resolution.height}`,
                            "-hls_time 10",
                            "-hls_list_size 0",
                            "-hls_segment_filename",
                            path.join(resolutionFolder, "segment_%03d.ts"),
                        ])
                        .output(outputPath)
                        .on("end", () => {
                            console.log(`✅ HLS created for: ${resolution.name}`);
                            res();
                        })
                        .on("error", (err: Error) => { // Type 'Error' for 'err'
                            console.error(`❌ Error with ${resolution.name}:`, err.message);
                            rej(err);
                        })
                        .run();
                });
            });

            await Promise.all(jobs);

            // 🔧 Create master.m3u8
            const masterPlaylistPath = path.join(outputDirectory, "master.m3u8");
            let masterContent = "#EXTM3U\n";

            targetResolutions.forEach((res) => {
                const resolutionFolder = res.name;
                masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${res.bandwidth},RESOLUTION=${res.width}x${res.height}\n`;
                masterContent += `${resolutionFolder}/index.m3u8\n`;
            });

            fs.writeFileSync(masterPlaylistPath, masterContent, "utf-8");
            console.log("🎉 master.m3u8 created successfully");

            resolve();
        } catch (error: any) { // Explicitly type error as 'any' for broader compatibility
            console.error("🔥 Error during HLS conversion:", error.message);
            reject(error);
        }
    });
}