import SignInPageComponent from "@/components/pages/signInPage";
import { Suspense } from "react";

export default function SignInPage() {

    return (
        <Suspense fallback={null}>
            <SignInPageComponent />
        </Suspense>
    );
}