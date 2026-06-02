"use client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemeProvider } from "next-themes";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "../../context/AuthContext";

// export const metadata: Metadata = {
//   title: "Admin",
//   robots: { index: false, follow: false },
// };

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { state } = useAuth();

  // if (state.isLoading) {
  //   return null;
  // }

  // if (!state.isAuthenticated || !state.user || state.user.role !== "admin") {
  //   redirect("/login");
  // }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="bg-background flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="bg-background flex min-w-0 flex-1 flex-col overflow-auto">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
