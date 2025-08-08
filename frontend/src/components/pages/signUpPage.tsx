"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    PenTool,
    Sparkles,
    Mail,
    Lock,
    User,
    LogIn,
    Loader2,
} from "lucide-react";
import { handleSignUp } from "@/utils/handlers/Auth.handler";
import { signUpSchema } from "@/utils/validation/userValidation";
import { z } from "zod";
import { useRouter } from "next/navigation";

function SignUpPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        // Client-side validation first
        try {
            signUpSchema.parse(form);
            if (form.password !== form.confirmPassword) {
                setLoading(false);
                setFormError("Passwords do not match.");
                return;
            }
        } catch (err) {
            setLoading(false);
            if (err instanceof z.ZodError) {
                setFormError(err.errors[0]?.message || "Validation failed.");
                return;
            }
            setFormError("Validation failed.");
            return;
        }

        // Call server action
        const fd = new FormData();
        fd.append("username", form.username);
        fd.append("email", form.email);
        fd.append("password", form.password);
        fd.append("confirmPassword", form.confirmPassword);

        try {
            const response = await handleSignUp(fd);
            if (response.error) {
                setFormError(response.error);
                setLoading(false);
                return;
            }
            if (response.success) {
                setTimeout(() => {
                    router.push("/sign-in");
                }, 1200);
            }
        } catch (err: unknown) { 
            // Fallback error
            if (typeof err === "object" && err && "message" in err) {
                setFormError((err as { message?: string }).message || "Sign-up failed, please try again.");
            } else if (typeof err === "string") {
                setFormError(err);
            } else {
                setFormError("Sign-up failed, please try again.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Loader Popup */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-white border shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center pointer-events-auto">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                        <span className="text-base font-semibold text-gray-700">
                            Signing up...
                        </span>
                    </div>
                </div>
            )}

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {/* Logo Section */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2 group">
                        <div className="relative">
                            <PenTool className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
                            <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1 animate-pulse group-hover:text-purple-600 transition-colors" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            BlogAI
                        </h1>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>

                {/* Error Message */}
                {formError && (
                    <div className="text-sm text-red-600 text-center font-medium mb-2">
                        {formError}
                    </div>
                )}

                {/* Sign Up Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <div className="relative">
                                <User className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="pl-10 w-full"
                                    placeholder="Your username"
                                    value={form.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="pl-10 w-full"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="pl-10 w-full"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="pl-10 w-full"
                                    placeholder="Confirm password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg group cursor-pointer"
                            disabled={loading}
                        >
                            Sign up
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
                            >
                                <LogIn className="mr-1 h-4 w-4" />
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;