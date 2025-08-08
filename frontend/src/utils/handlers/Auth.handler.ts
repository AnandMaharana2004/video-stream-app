"use server";

import { signIn } from "@/auth";
import { User } from "@/models/userModel";
import { signUpSchema } from "../validation/userValidation";
import { connectToDatabase } from "../db/dbConnection";
import bcrypt from "bcryptjs";

export async function handleSignUp(formData: FormData) {
    "use server";
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    // Validate all fields are present
    if (!username || !email || !password || !confirmPassword) {
        return { error: "All fields are required" };
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    // Validate input using zod schema
    const parsed = signUpSchema.safeParse({ username, email, password, confirmPassword });
    if (!parsed.success) {
        return { error: parsed.error.errors[0].message || "Invalid signup input" };
    }
    //db connection
    await connectToDatabase();
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { error: "User with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user in the database
    const createdUser = await User.create({
        username,
        email,
        password: hashedPassword
    });
    if (!createdUser) {
        return { error: "Failed to create user" }
    }

    // Success
    return { success: true };
}
export async function handleSignIn(formData: FormData) {
    "use server";
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    await signIn("credentials", {
        email,
        password,
        redirect: true,
        redirectTo: "/feed",
    })
    // redirect("/feed")
    // redirect("/sign-in?error=invalid");
}