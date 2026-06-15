import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { Toaster } from "sonner";
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
      <Toaster richColors position="top-right" />
    </>
  );
}
