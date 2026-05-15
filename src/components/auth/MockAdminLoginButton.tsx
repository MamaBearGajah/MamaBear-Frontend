"use client";

import { useTransition } from "react";
import { loginAsMockAdmin } from "@/lib/auth/set-mock-session";
import { Button } from "@/components/ui/button";

export default function MockAdminLoginButton() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-6 border-t border-border pt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Development
      </p>
      <Button
        type="button"
        variant="outline"
        className="w-full border-[var(--mamabear-dark-pink)] text-[var(--mamabear-dark-pink)] hover:bg-[var(--mamabear-light-pink)]"
        disabled={pending}
        onClick={() => startTransition(() => loginAsMockAdmin())}
      >
        {pending ? "Memuat…" : "Login sebagai Admin (mock)"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Hanya tersedia di <code className="text-foreground">npm run dev</code>. Tidak aktif di
        production.
      </p>
    </div>
  );
}
