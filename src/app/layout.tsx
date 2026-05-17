import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const quicksand = localFont({
  src: [
    {
      path: "../../public/font/Quicksand/Quicksand-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-quicksand",
});

const urbanist = localFont({
  src: [
    {
      path: "../../public/font/Urbanist/Urbanist-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: {
    default: "MamaBear",
    template: "%s | MamaBear",
  },
  description: "MamaBear e-commerce — produk ibu dan anak",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        inter.variable,
        quicksand.className,
        urbanist.className
      )}
    >
      <AuthProvider>
        <body className="min-h-screen antialiased">{children}</body>
      </AuthProvider>
    </html>
  );
}
