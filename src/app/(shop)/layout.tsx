import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { Toaster } from "sonner";
import ChatbotWidget from "@/components/chat/ChatbotWidget";
export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {/* <CheckoutProvider>       */}
        {children}
      {/* </CheckoutProvider> */}

      <Footer />
      <ChatbotWidget />
      <Toaster richColors position="top-right" />
    </>
  );
}
