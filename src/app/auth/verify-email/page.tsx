import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";

function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[#111111]">
      <div className="text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-neutral-400 mt-4">Loading...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
