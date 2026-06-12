"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useAuth();

  if (state.isLoading) {
    return null;
  }

  if (!state.isAuthenticated || !state.user) {
    redirect("/login");
  }

  if (state.user.role !== "super_admin") {
    redirect("/admin");
  }

  return children;
}
