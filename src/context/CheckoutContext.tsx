"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CheckoutItem {
  id: string;
  productId: string;
  variantId?: string;
  categoryName?: string;
  variantName?: string;
  variantValue?: string;
  variantLabel?: string;
  quantity: number;
  name: string;
  basePrice: number;
  discountPrice?: number;
  discount?: number;
  image: string;
  notes?: string;
}

export interface ShippingInfo {
  label: string;
  receiverName: string;
  phone: string;
  provinceId: string;
  cityId: string;
  postalCode: string;
  address: string;
  deliveryNotes?: string | null;
}

export interface ShippingMethod {
  courier: string;
  service: string;
  etd: string;
  cost: number;
}

export interface CheckoutState {
  items: CheckoutItem[];
  shipping: ShippingInfo | null;
  method: ShippingMethod | null;
  discount: number;
  voucherCode: string;  // untuk display kode voucher
  voucherId: string;    // untuk dikirim ke BE saat place order
  step: number;
}

interface CheckoutContextType {
  state: CheckoutState;
  subtotal: number;
  hydrated: boolean;

  postItems: (selected: CheckoutItem[]) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<Omit<CheckoutItem, "id">>) => void;
  clearItems: () => void;

  setShipping: (data: ShippingInfo) => void;
  setMethod: (data: ShippingMethod) => void;

  // simpan code (untuk display), id (untuk BE), dan discountAmount sekaligus
  setVoucher: (code: string, id: string, discountAmount: number) => void;
  clearVoucher: () => void;

  // backward-compat: hanya update nominal discount tanpa sentuh voucher
  setDiscount: (discount: number) => void;

  nextStep: () => void;
  prevStep: () => void;

  clearCheckout: () => void;
}

const LS_KEY = "checkout";

const initialState: CheckoutState = {
  items: [],
  shipping: null,
  method: null,
  discount: 0,
  voucherCode: "",
  voucherId: "",
  step: 1,
};

function readFromStorage(): CheckoutState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const subtotal = state.items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return sum + price * item.quantity;
  }, 0);

  const postItems = (selected: CheckoutItem[]) =>
    setState((prev) => ({ ...prev, items: selected }));

  const deleteItem = (id: string) =>
    setState((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));

  const updateItem = (id: string, patch: Partial<Omit<CheckoutItem, "id">>) =>
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));

  const clearItems = () => setState((prev) => ({ ...prev, items: [] }));

  const setShipping = (data: ShippingInfo) =>
    setState((prev) => ({ ...prev, shipping: data, method: null }));

  const setMethod = (data: ShippingMethod) =>
    setState((prev) => ({ ...prev, method: data }));

  const setVoucher = (code: string, id: string, discountAmount: number) =>
    setState((prev) => ({
      ...prev,
      voucherCode: code,
      voucherId: id,
      discount: discountAmount,
    }));

  const clearVoucher = () =>
    setState((prev) => ({
      ...prev,
      voucherCode: "",
      voucherId: "",
      discount: 0,
    }));

  // backward-compat: hanya update nominal, tidak reset voucher
  const setDiscount = (discount: number) =>
    setState((prev) => ({ ...prev, discount }));

  const nextStep = () =>
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) }));

  const prevStep = () =>
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  const clearCheckout = () => {
    setState(initialState);
    if (typeof window !== "undefined") localStorage.removeItem(LS_KEY);
  };

  return (
    <CheckoutContext.Provider
      value={{
        state,
        subtotal,
        hydrated,
        postItems,
        deleteItem,
        updateItem,
        clearItems,
        setShipping,
        setMethod,
        setVoucher,
        clearVoucher,
        setDiscount,
        nextStep,
        prevStep,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}