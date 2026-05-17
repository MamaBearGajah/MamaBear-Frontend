"use client";

import { useEffect, useState, use } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthBanner from "@/components/AuthBanner";
import { authApi } from "@/lib/api/auth";

export default function VerifyEmail({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // In a real application, you would call your API here
        // const response = await fetch(`/api/auth/verify-email?token=${token}`);
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || "Verification failed");

        // Simulate API call delay
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await authApi.verifyEmail(token);
        console.log(response);
        if (token === "invalid") {
          throw new Error("This verification link is invalid or has expired.");
        }

        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now sign in to your Mamabear account."
        );
      } catch (error: unknown) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while verifying your email."
        );
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="my-auto flex h-screen w-full flex-col items-center justify-center bg-[#FFF5F8] lg:flex-row">
      <AuthBanner />
      <div className="form flex w-full flex-col items-center justify-center px-4 py-10 text-[#6C4735] sm:px-8 lg:w-[50%]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            {status === "loading" && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100/50">
                  <Loader2 className="h-10 w-10 animate-spin text-[#D5557E]" />
                </div>
                <h1 className="mb-2 text-2xl font-black">Verifying... 🐻</h1>
                <p className="text-sm leading-relaxed">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100/50">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="mb-2 text-2xl font-black">Email Verified! 🎉</h1>
                <p className="text-sm leading-relaxed">{message}</p>
                <Button
                  asChild
                  className="mt-8 w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                >
                  <Link href="/login">Sign In to Your Account</Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="mb-2 text-2xl font-black">
                  Verification Failed ❌
                </h1>
                <p className="text-sm leading-relaxed">{message}</p>
                <div className="mt-8 flex w-full flex-col gap-3">
                  <Button
                    asChild
                    className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                  >
                    <Link href="/register">Create New Account</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#D5557E] text-[#D5557E] hover:bg-[#D5557E]/10"
                  >
                    <Link href="/login">Back to Login</Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="mt-12 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Mamabear. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
