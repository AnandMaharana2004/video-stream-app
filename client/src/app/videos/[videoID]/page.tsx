import { getVideoInfo } from "@/actions/actions";
import {Navbar} from "@/components/navbar";
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
            src={'http://d2ovrq2g0trwce.cloudfront.net/68b08cccbe4e28ced7c5a868-video-480p/master.m3u8'}
            poster={'https://d11wd0j17w56pr.cloudfront.net/68b08cccbe4e28ced7c5a868-Digital%20Collaboration%20in%20Action.png'}
            autoplay={false}
            controls={true}
          />
          <div className="mt-15">
            <h1 className="text-xl font-bold">Design Notifications System Design</h1>
            <div className=" flex items-center gap-2 py-2">
              <Image src="https://lh3.googleusercontent.com/ogw/AF2bZyjSDEA0RHfwdkGiSl0SBlfWZI0yHFeQPmLKJ3YVw0q-Xj0=s64-c-mo"
                alt="user profilepic"
                className="rounded-full h-10" />
              <h1 className="text-blue-100">Anand Maharana</h1>
            </div>
            <p className="pt-2">
              Hey everyone, In this video, we are going to discuss System Design of a Notification System. We will have a look at how notification systems work and how you can use Fan-Out and Queue architecture to scale notifications with multiple channels.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}