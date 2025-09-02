"use server"

import { User } from "@/models/userModel";
import { connectTODB } from "@/utils/dbConnection";
import { response } from "@/utils/response";
import bcrypt from "bcryptjs";
import z from "zod";

const SignupSchema = z.object({
    email: z.string().lowercase(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
    username: z.string()
})

const SignInSchema = z.object({
    email: z.string().lowercase(),
    password: z.string()
});

export async function signUpAction(
    email: string,
    password: string,
    confirmPassword: string,
    username: string
) {
    try {
        // 1. Validate input with Zod
        const verify = SignupSchema.safeParse({ email, password, confirmPassword, username })
        if (!verify.success) {
            return response.error("Please provide proper inputs")
        }

        await connectTODB()

        // 2. Check if user already exists
        const existUser = await User.findOne({ email })
        if (existUser) {
            return response.error("User already exists")
        }

        // 3. Create new user
        const newUser = await User.create({
            username,
            email,
            password,
        })

        if (!newUser._id) {
            return response.error("Something went wrong while creating the new user")
        }

        return response.success("User created successfully", {
            username: `${newUser?.username}`,
            _id: `${newUser._id}`,
            email: `${newUser.email}`,
        })
    } catch (error) {
        console.error("Something went wrong while signing up:", error)
        return response.error("Something went wrong while signing up")
    }
}

export async function SignInAction(email: string, password: string) {
    try {
        const { success } = SignInSchema.safeParse({ email, password });
        if (!success) {
            return { status: false, message: "Please provide valid inputs", data: null };
        }
        await connectTODB();

        const existingUser = await User.findOne({ email }).select("password username email");
        if (!existingUser) {
            return { status: false, message: "Invalid email or password !", data: null }
        }

        if (!existingUser.password) return { status: false, message: "Invalid email or password !!", data: null }
        const verifyPassword = await bcrypt.compare(password, existingUser.password);
        if (!verifyPassword) {
            return { status: false, message: "Invalid email or password !!!", data: null }

        }
        return {
            status: true, message: "User signed in successfully", data: {
                username: existingUser.username,
                email: existingUser.email,
                _id: existingUser._id
            }
        }

    } catch (error) {
        console.error("Something went wrong while signing in:", error);
        return { status: true, message: "Something went wrong while signing in", data: null };
    }
}

export async function loginwithgoogleAction(google_id: string, email: string, image?: string, name?: string, fullProfileObject?: object) {
    try {
        await connectTODB();
        const existingUser = await User.findOne({
            $or: [
                { google_id },
                { email }
            ]
        })
        if (existingUser) {
            // update user 
            existingUser.google_id = google_id;
            if (!existingUser.profilePic) {
                existingUser.profilePic = image
            }
            const finalUser = await existingUser.save()
            return response.success("User updated successfully", {
                _id: finalUser._id,
                email: finalUser.email,
                username: finalUser.username
            })
        }
        // create new user
        const newUser = await User.create({
            email,
            google_id,
            username: name,
            profilePic: image
        })
        if (!newUser._id) {
            response.error("Somethig went wrong while createing User")
        }
        return response.success("User created successfully", {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username
        })
    } catch (error) {
        console.log("Error occures while loginwith google action perform", error)
        return response.error("Somethig went wrong updating sign in with google")
    }
}