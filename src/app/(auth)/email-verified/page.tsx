import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthBanner from "@/components/AuthBanner";
// import { useSearchParams } from "next/navigation";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ status: string }>;
}) {
  // const searchParams = useSearchParams();
  // const statusParam = searchParams.get("status");
  const { status } = await searchParams;

  console.log(status);

  return (
    <div className="my-auto flex h-screen w-full flex-col items-center justify-center bg-[#FFF5F8] lg:flex-row">
      <AuthBanner />
      <div className="form flex w-full flex-col items-center justify-center px-4 py-10 text-[#6C4735] sm:px-8 lg:w-[50%]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            {status !== "success" && status !== "failed" && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="mb-2 text-2xl font-black">
                  Verification Failed ❌
                </h1>
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

            {status === "success" && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100/50">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="mb-2 text-2xl font-black">Email Verified! 🎉</h1>
                <p className="text-sm leading-relaxed">
                  You can login to your account now
                </p>
                <Button
                  asChild
                  className="mt-8 w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                >
                  <Link href="/login">Sign In to Your Account</Link>
                </Button>
              </>
            )}

            {status === "failed" && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="mb-2 text-2xl font-black">
                  Verification Failed ❌
                </h1>
                <p className="text-sm leading-relaxed">
                  Your verification link has expired or is invalid. Please
                  create a new account or log in to your existing account.
                </p>
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
