// components/GoogleSignInButton.jsx
'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function GoogleSignInButton() {
    return (
        <button
            onClick={() => signIn("google", {
                redirect: true,
                redirectTo: "/videos",
            })}
            className="w-full py-3 rounded-full text-lg font-medium transition-colors duration-300 bg-blue-400 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
        >
            <Image
                src="https://www.google.com/favicon.ico"
                alt="Google"
                width={30}
                height={30}
                className="mr-2"
            />
            Sign in with Google
        </button>
    );
}