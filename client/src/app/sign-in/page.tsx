// app/signin/page.jsx (or wherever your page component is located)

import Link from "next/link";
import GoogleSignInButton from "@/components/buttons/GoogleSignInButton";
import SignInForm from "@/components/forms/singInForm"; // Import the new form component

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-inter">
                        Sign In to Your Account
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Welcome back to Stream-Hub.
                    </p>
                </div>
                <div className="space-y-4">
                    <GoogleSignInButton />
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-700"></div>
                        <span className="flex-shrink mx-4 text-gray-500">
                            or
                        </span>
                        <div className="flex-grow border-t border-gray-700"></div>
                    </div>
                </div>
                {/* Render the new client form component here */}
                <SignInForm />

                <p className="text-sm text-center text-gray-400">
                    Do not have an account?
                    <Link href="/sign-up" className="font-medium text-blue-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}