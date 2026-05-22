import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const quicksand = localFont({
  src: [
    {
      path: "../../public/font/Quicksand/Quicksand-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-quicksand",
  display: "swap",
});

const urbanist = localFont({
  src: [
    {
      path: "../../public/font/Urbanist/Urbanist-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-urbanist",
  display: "swap",
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
      lang="en"
      suppressHydrationWarning
      className={cn(quicksand.variable, urbanist.variable, "font-sans")}
    >
      <AuthProvider>
        <body className="min-h-screen">{children}</body>
      </AuthProvider>
    </html>
  );
}
