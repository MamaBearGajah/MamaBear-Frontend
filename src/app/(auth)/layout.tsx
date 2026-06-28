import { Suspense } from "react";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      <Suspense fallback={null}>{children}</Suspense>
      <Toaster richColors position="top-right" />
    </div>
  );
}