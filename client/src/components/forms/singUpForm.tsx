'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/actions/authentication";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// This is a Client Component, responsible for all form logic and state.
export default function SignUpForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[] | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);

    // State for each form input
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission

        // Clear previous state and set loading
        setIsLoading(true);
        setErrors(null);

        try {
            // Pass the state values directly to the server action
            if (!(password === confirmPassword)) {
                setErrors(["Password and Confirm password should be same"])
                return setIsLoading(false)
            }
            const result = await signUpAction(email, password, confirmPassword, username);
            if (!result?.status) {
                setErrors([result.message])
                return setIsLoading(false)
            }
            return router.push("/sign-in")

        } catch (e) {
            console.log("Sign-up failed:", e);
            setErrors(["An unexpected error occurred. Please try again."]);
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300"
                >
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300"
                    placeholder="Enter your username"
                    required
                />
            </div>
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
            <div className="relative">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                >
                    Password
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300 pr-10"
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
            </div>
            <div className="relative">
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300"
                >
                    Confirm Password
                </label>
                <input
                    type={showConformPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300 pr-10"
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConformPassword(!showConformPassword)}
                    className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                    aria-label={confirmPassword ? "Hide password" : "Show password"}
                >
                    {showConformPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
            </div>
            {errors && (
                <div className="bg-red-500 text-white p-3 rounded-md text-sm text-center">
                    <ul className="list-inside list-none">
                        {errors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                type="submit"
                className="w-full py-3 rounded-full text-lg font-medium transition-colors duration-300 bg-white text-black hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="animate-spin -ml-1 mr-3 h-7 w-7 text-black" />
                    </div>
                ) : (
                    "Sign Up"
                )}
            </button>
        </form>
    );
}
