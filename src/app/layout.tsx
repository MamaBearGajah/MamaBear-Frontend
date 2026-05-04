import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

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
    <html lang="id" suppressHydrationWarning>

      <body>
        <Header/>
        {children}      
        <Footer/></body>

    </html>
  );
}