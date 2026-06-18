import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import ChatbotWidget from "@/components/chat/ChatbotWidget";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
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

    // const settings = await getSettings();

    
    const settings = {
      googleTagManagerId: "GTM-XXXXXXX",
    };

    const gtmId = settings.googleTagManagerId;

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
          <CheckoutProvider>
          <body className="min-h-screen">
            {children}
            {gaId && (
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
            )}

          {gtmId && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
            >
              {`
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `}
            </Script>

            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{
                  display: "none",
                  visibility: "hidden",
                }}
              />
            </noscript>
          </>
        )}
          </body>
          <ChatbotWidget />
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}
