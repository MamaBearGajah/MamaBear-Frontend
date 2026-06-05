import { Suspense } from "react";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      <Toaster richColors position="top-right" />
    </>
  );
}
