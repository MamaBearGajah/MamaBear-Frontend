import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { readFileSync } from "fs";
import { join } from "path";

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

// Read the IDs saved by the admin widget via the API route.
// Falls back to empty string (= disabled) if the file does not exist yet.
function getAnalyticsSettings(): { gaId: string; gtmId: string } {
  try {
    const file = join(process.cwd(), "data", "analytics-settings.json");
    const raw  = JSON.parse(readFileSync(file, "utf-8"));
    return {
      gaId:  raw.gaId  ?? "",
      gtmId: raw.gtmId ?? "",
    };
  } catch {
    return { gaId: "", gtmId: "" };
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { gaId, gtmId } = getAnalyticsSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(quicksand.variable, urbanist.variable, "font-sans")}
    >
      <body className="min-h-screen">
        {/* GTM noscript — must be first element inside <body> */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <AuthProvider>
          <CartProvider>
            <CheckoutProvider>
              {children}
            </CheckoutProvider>
          </CartProvider>
        </AuthProvider>

        {gtmId && <GoogleTagManager gtmId={gtmId} />}

        {!gtmId && gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}