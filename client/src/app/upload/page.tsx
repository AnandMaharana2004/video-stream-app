import { deleteVideo, getUserInfo, GetVideosForUploadPage, RefresshVideo } from "@/actions/actions"
import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import UploadPage from "@/components/pages/uploadPage"
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"

async function page() {
  const loginUser = await auth()

  // console.log("the auth result is ", loginUser?.user)
  if (!loginUser?.user?.id) return redirect("/sign-in")
  const videoData = await GetVideosForUploadPage(loginUser?.user?.id)
  const user = await getUserInfo(loginUser.user.id);
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