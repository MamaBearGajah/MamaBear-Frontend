import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemeProvider } from "next-themes";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession, isAdminRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session || !isAdminRole(session.user.role)) {
    redirect("/login");
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-background">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}