"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    PenTool,
    Sparkles,
    Mail,
    ArrowLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle forgot password logic inside the utils/handlers "server actions"
        console.log("Email submitted for password reset:", email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Enter your email and we’ll send you a link to reset your password.
                    </p>
                </div>

                {/* Forgot Password Form / Success Message */}
                {submitted ? (
                    <div className="mt-8 space-y-6">
                        <div className="text-center">
                            <p className="text-green-600 font-medium">
                                If an account with that email exists, a password reset link was sent.
                            </p>
                        </div>
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                            <Link href="/sign-in">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg"
                        >
                            Send reset link
                        </Button>
                        <div className="text-center">
                            <Link
                                href="/sign-in"
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium inline-flex items-center"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}