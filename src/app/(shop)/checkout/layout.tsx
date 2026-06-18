import { CheckoutProvider } from "@/context/CheckoutContext";
import StepperHeader from "@/components/checkout/StepperHeader";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-pink-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <CheckoutProvider>
          {/* Page Title */}
          <h1 className="mb-6 pt-1 text-2xl font-bold sm:pt-5">Checkout</h1>
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <Link href="/" className="hover:text-pink-600">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href="/cart" className="hover:text-pink-600">
              <span>Shopping Cart</span>
            </Link>
            <ChevronRight size={12} />
            <span className="text-pink-600">Checkout</span>
          </div>
          {/* <StepperHeader /> your stepper UI */}
          {children}
        </CheckoutProvider>
      </div>
    </div>
  );
}
