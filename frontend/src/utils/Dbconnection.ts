//write code for db conneciton 
"use server"
import mongoose from "mongoose";
export async function connectTODB() {
    try {
        if (mongoose.connection.readyState) {
            console.log("Mongodb alredy connected ✅")
        } else {

            const MONGO_URI = process.env.MONGO_URI
            if (!MONGO_URI) throw Error("please provide mongo Uri in .env file")
            await mongoose.connect(MONGO_URI)
            if (mongoose.connection.readyState) {
                console.log("Mongodb connectedy successfuly ✅")
            }
        }
    } catch (error) {
        console.log("Database connecton error : ", error)
        throw Error("Something went wrong while connect with Database ❌")
    }

}