import { getUserInfo, GetVideosForUploadPage, RefresshVideo } from "@/actions/actions"
import Navbar from "@/components/Navbar";
import UploadPage from "@/components/pages/UploadPage"

export const dynamic = "force-dynamic"

async function page() {
  const videoData = await GetVideosForUploadPage("68947fc053efc9f42bc60a3c")
  const user = await getUserInfo("68947fc053efc9f42bc60a3c");
  return (
    <div className="h-full w-full ">
      <Navbar />
      <UploadPage videoData={videoData} user={user} refresshAction={async (videoID: string) => {
        "use server"
        const result = await RefresshVideo(videoID)
        return result
      }} />
    </div>
  )
}

export default page