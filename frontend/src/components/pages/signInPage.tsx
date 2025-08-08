"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    PenTool,
    Sparkles,
    Mail,
    Lock,
    LogIn,
    Loader2,
} from "lucide-react";
import { signInSchema } from "@/utils/validation/userValidation";
import { z } from "zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam === "invalid") {
            setFormError("Invalid email or password. Please try again.");
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.delete("error");
            router.replace(`?${newSearchParams.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);
        try {
            const validated = signInSchema.parse({ email, password });
            const res = await signIn("credentials", {
                redirect: false,
                email: validated.email,
                password: validated.password,
            });
            if (res?.error) {
                let msg = "Something went wrong.";
                switch (res.error) {
                    case "NoUser":
                        msg = "No user found with this email.";
                        break;
                    case "InvalidPassword":
                        msg = "Invalid password.";
                        break;
                    case "ValidationError":
                        msg = "Invalid input format.";
                        break;
                    case "CredentialsSignin":
                        msg = "Invalid email or password.";
                        break;
                }
                setFormError(msg);
            } else if (res?.ok) {
                router.push("/feed");
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                setFormError(err.errors[0]?.message || "Invalid input format.");
            }
            setFormError("Something went wrong while signing in");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        setLoading(true);
        signIn("google", {
            redirect: true,
            redirectTo: "/feed",
        });
        // No need to unset loading, as redirect will happen
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Loader Popup */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-white border shadow-xl rounded-2xl px-8 py-6 flex flex-col items-center pointer-events-auto">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                        <span className="text-base font-semibold text-gray-700">Please wait...</span>
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
                        Sign in to your account
                    </h2>
                </div>

                {/* Sign In Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="on">
                    <div className="space-y-4 rounded-md">
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
                                    disabled={loading}
                                    autoComplete="email"
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
                                    className="pl-10 w-full"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>
                    </div>

                    {formError && (
                        <div className="text-sm text-red-600 text-center font-medium">
                            {formError}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                href="/forgot-password"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:shadow-lg group cursor-pointer"
                            disabled={loading}
                        >
                            <LogIn className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                            Sign in
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-2 hover:bg-gray-50 transition-all flex items-center justify-center cursor-pointer"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <Image
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                width={16}
                                height={16}
                                className="mr-2"
                            />
                            Sign in with Google
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Do not have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignInPage;