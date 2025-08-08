
import React, { Suspense } from "react";
import SignUpPageComponent from "@/components/pages/signUpPage";

export default function SignUpPage() {

    return (
        <Suspense fallback={null}>
            <SignUpPageComponent />
        </Suspense>
    );
}