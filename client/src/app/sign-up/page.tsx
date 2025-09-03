import SignUpForm from "@/components/forms/singUpForm";

// This is a Server Component, responsible for rendering the page layout.
// It does not have any client-side state or event handlers.
const page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 font-inter">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Join the Stream-Hub community.
                    </p>
                </div>
                {/* The form logic is encapsulated in this client component */}
                <SignUpForm />
                <p className="text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <a href="/sign-in" className="font-medium text-blue-400 hover:underline">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default page;
