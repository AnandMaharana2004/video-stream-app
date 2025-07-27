import dotenv from "dotenv"
import pollQueue from "./queues/encription-queue-1"
dotenv.config()

try {
    pollQueue()
    console.log("Queeue setup prperly")
} catch (error) {
    console.log("soeme thing went worong ", error)
}