import type { Metadata } from "next";
import Link from "next/link";
import MockAdminLoginButton from "@/components/auth/MockAdminLoginButton";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun MamaBear",
};

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-foreground">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman login akan terhubung ke backend setelah konfirmasi API.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Admin? Setelah login, akses{" "}
          <Link href="/admin" className="text-[var(--mamabear-dark-pink)] underline">
            panel admin
          </Link>
          .
        </p>
        {isDev ? <MockAdminLoginButton /> : null}
      </div>
    </div>
  );
}
