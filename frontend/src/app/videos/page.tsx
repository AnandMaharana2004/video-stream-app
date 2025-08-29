import { GetVideos } from "@/actions/actions";
import {Navbar} from "@/components/navbar";
import VideosPage from "@/components/pages/videosPage";
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
