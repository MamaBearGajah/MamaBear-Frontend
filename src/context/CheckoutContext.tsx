"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ShippingInfo {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  deliveryNotes?: string | null;
}

interface ShippingMethod {
  courier: string; // e.g. "JNE"
  service: string; // e.g. "REG"
  estimatedDays: string; // e.g. "2-3 days"
  cost: number;
}

interface CheckoutState {
  shipping: ShippingInfo | null;
  method: ShippingMethod | null;
  step: number;
}

interface CheckoutContextType {
  state: CheckoutState;
  setShipping: (data: ShippingInfo) => void;
  setMethod: (data: ShippingMethod) => void;
  clearCheckout: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialState: CheckoutState = {
  shipping: null,
  method: null,
  step: 1,
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(initialState);

  const setShipping = (data: ShippingInfo) =>
    setState((prev) => ({ ...prev, shipping: data }));

  const setMethod = (data: ShippingMethod) =>
    setState((prev) => ({ ...prev, method: data }));

  const clearCheckout = () => setState(initialState);

  const nextStep = () =>
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) }));
  const prevStep = () =>
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  return (
    <CheckoutContext.Provider
      value={{
        state,
        setShipping,
        setMethod,
        clearCheckout,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

// typed hook — throws if used outside provider
export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}
