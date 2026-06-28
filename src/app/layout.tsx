import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Script from "next/script";
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

        {/* Google Tag Manager */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');
              `.trim(),
            }}
          />
        )}

        {/* Google Analytics 4 — only injected when GTM is not set */}
        {!gtmId && gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
                `.trim(),
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}