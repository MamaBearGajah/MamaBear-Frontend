import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

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
    const gaId =
    typeof window !== "undefined"
      ? localStorage.getItem("ga_id")
      : null;
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(quicksand.variable, urbanist.variable, "font-sans")}
    >
      <AuthProvider>
        <CartProvider>
          <body className="min-h-screen">
            {children}
            {gaId && (
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
            )}
          </body>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}
