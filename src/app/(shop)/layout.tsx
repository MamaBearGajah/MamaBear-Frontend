import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import ChatbotWidget from "@/components/chat/ChatbotWidget";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <Toaster richColors position="top-right" />
      <ChatbotWidget />
    </>
  );
}
