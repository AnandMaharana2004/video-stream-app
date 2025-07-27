import { Router } from "express"
import VideoRouter from "./videoRoute"

const router = Router()

router.use("/videos", VideoRouter)

export default router