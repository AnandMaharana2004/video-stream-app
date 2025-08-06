import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const resolutions = [
    { name: "720p", width: 1280, height: 720, bandwidth: 3000000 },
    { name: "480p", width: 854, height: 480, bandwidth: 1600000 },
    { name: "360p", width: 640, height: 360, bandwidth: 800000 },
    { name: "144p", width: 256, height: 144, bandwidth: 400000 },
];

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

            const jobs = resolutions.map((resolution) => {
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
                        .on("error", (err) => {
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

            resolutions.forEach((res) => {
                const resolutionFolder = res.name;
                masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${res.bandwidth},RESOLUTION=${res.width}x${res.height}\n`;
                masterContent += `${resolutionFolder}/index.m3u8\n`;
            });

            fs.writeFileSync(masterPlaylistPath, masterContent, "utf-8");
            console.log("🎉 master.m3u8 created successfully");

            resolve();
        } catch (error: any) {
            console.error("🔥 Error during HLS conversion:", error.message);
            reject(error);
        }
    });
}
