import { getVideoInfo } from "@/actions/actions";
import { Navbar } from "@/components/navbar";
import VideoPlayer from "@/components/videoPlayer";
import Image from "next/image";
import { notFound } from "next/navigation"; // Import the notFound function

interface VideoPageProps {
  params: {
    videoID: string;
  };
}

// Function to validate MongoDB ObjectID
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export default async function VideoPage({ params }: VideoPageProps) {
  // Check if videoID is a valid MongoDB ObjectID
  // const videoid = await params.videoID
  if (!isValidObjectId(params.videoID)) {
    notFound(); // Renders the 404 page
  }

  const result = await getVideoInfo(params.videoID);
  console.log(result);

  return (
    <div>
      <Navbar />
      <div className="p-5 bg-transparent min-h-screen">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            src={`${result.videoUrl}`}
            poster={result.thamdilUrl}
            autoplay={false}
            controls={true}
          />
          <div className="mt-15">
            <h1 className="text-xl font-bold">{result.title}</h1>
            <div className=" flex items-center gap-2 py-2">
              <Image src={result.userprofilePic}
                alt="user profilepic"
                className="rounded-full h-10" />
              <h1 className="text-blue-100">{result.User}</h1>
            </div>
            <p className="pt-2">
              {result.descripton}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}