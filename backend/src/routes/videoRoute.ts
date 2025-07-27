import { Router } from "express"
import { getVideos, uploadVideo } from "../controller/videoController"

const router = Router()

router.route('/upload').post(uploadVideo)
router.route("/get").get(getVideos)

export default router