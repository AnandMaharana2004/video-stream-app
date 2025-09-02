
const page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-inter">
                        Forgot Your Password?
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Enter your email address below to receive a password reset link.
                    </p>
                </div>
                <form className="space-y-4">
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
                            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-full text-lg font-medium transition-colors duration-300 bg-white text-black hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Send Reset Link
                    </button>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Remember your password?{' '}
                    <a href="/sign-in" className="font-medium text-blue-400 hover:underline">
                        Sign In
                    </a>
                </p>
                <h1 className="text-red-600 text-center">❌ This feature Under constraction ❌</h1>

            </div>
        </div>
    );
};

export default page