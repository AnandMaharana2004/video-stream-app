// components/SignInForm.jsx
'use client';

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await signIn("credentials", {
                email,
                password,
                redirect: true,
                redirectTo: "/videos"
            });
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
            console.log(error)
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                >
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300"
                    placeholder="you@example.com"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300"
                    placeholder="••••••••"
                    required
                />
            </div>
            {error && (
                <div className="bg-red-500 text-white p-3 rounded-md text-sm text-center">
                    {error}
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <Link
                        href={'/forget-password'}
                        className="font-medium text-blue-400 hover:underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>
            <button
                type="submit"
                className="w-full py-3 rounded-full text-lg font-medium transition-colors duration-300 bg-white text-black hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {/* Conditional rendering for the button content */}
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-7 w-7 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </div>
                ) : (
                    "Sign In"
                )}
            </button>
        </form>
    );
}