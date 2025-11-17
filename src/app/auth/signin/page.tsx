import SignInForm from "@/components/auth/SignInForm";
import Loading from "@/components/common/Loading";
import { Suspense } from "react";

export default function SignIn() {
    return (
        <Suspense fallback={<Loading />}>
            <SignInForm />
        </Suspense>
    );
}
