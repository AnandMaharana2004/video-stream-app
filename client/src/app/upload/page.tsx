import { deleteVideo, getUserInfo, GetVideosForUploadPage, RefresshVideo } from "@/actions/actions"
import { Navbar } from "@/components/navbar";
import UploadPage from "@/components/pages/uploadPage"

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
      }} deleteAction={async (videoID: string) => {
        "use server"
        console.log(`The delete button is clicket of video id : ${videoID}`)
        const result = await deleteVideo(videoID)
        console.log("the ressult is : ", result)
        if (result.success) {
          return {
            status: true
          }
        }
        return {
          status: false
        }
      }} />
    </div>
  )
}

export default page