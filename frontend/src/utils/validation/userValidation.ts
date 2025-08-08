import { z } from "zod";

export const signInSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email address"),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
    .object({
        username: z
            .string({ required_error: "Username is required" })
            .min(2, "Username must be at least 2 characters"),
        email: z
            .string({ required_error: "Email is required" })
            .email("Please enter a valid email address"),
        password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string({ required_error: "Confirm Password is required" })
            .min(6, "Confirm Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// TypeScript types for usage
export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;