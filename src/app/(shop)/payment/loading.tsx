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
      <div className="mx-auto max-w-6xl">
        <CheckoutProvider>
          {/* Page Title */}
          {children}
        </CheckoutProvider>
      </div>
    </div>
  );
}
