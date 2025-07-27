import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import AllRouts from "./routes/index"

const app = express()
const PORT = process.env.PORT || 4000


//middlewares 
app.use(cors({
    origin: [
        "http://localhost:3000"
    ]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use(AllRouts)

app.listen(PORT, () => {
    console.log(`app is listen on port : ${PORT}`)
})