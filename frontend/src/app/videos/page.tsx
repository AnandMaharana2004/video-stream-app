import { GetVideos } from "@/actions/actions";
import Navbar from "@/components/Navbar";
import VideosPage from "@/components/pages/VideosPage";
// import VideoList from "./VideoList"; // client component
export const dynamic = "force-dynamic";

export default async function Page({ }) {
  const videos = await GetVideos(); // fetch on server

  return (
    <>
      <Navbar />
      <VideosPage videos={videos} />
    </>
  );
}
