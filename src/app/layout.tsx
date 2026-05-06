import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

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
  title: "MamaBear",
  description: "MamaBear frontend application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        inter.variable,
        quicksand.variable,
        urbanist.variable
      )}
    >
      <body>
        <Header />

        {children}

        <Footer />

        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              toast: "rounded-2xl border border-pink-100 shadow-lg",
              title: "font-bold text-[#6B4637]",
              description: "text-sm text-[#9A7B6D]",
            },
          }}
        />
      </body>
    </html>
  );
}