
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
  discount?:number;
  image: string;
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
  discount: number,
  step: number;
}

interface CheckoutContextType {
  state: CheckoutState;
  subtotal: number;
  // FIX: terekspos supaya halaman bisa menunda redirect/cek state sampai
  // data dari localStorage selesai dimuat (mencegah hydration mismatch).
  hydrated: boolean;

  postItems: (selected: CheckoutItem[]) => void;
  deleteItem: (id: string) => void;
  updateItem: (
    id: string,
    patch: Partial<Omit<CheckoutItem, "id">>
  ) => void;
  clearItems: () => void;

  setShipping: (data: ShippingInfo) => void;
  setMethod: (data: ShippingMethod) => void;
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
  discount:0,
  step: 1,
};

function readFromStorage(): CheckoutState {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const raw = localStorage.getItem(LS_KEY);

    if (!raw) {
      return initialState;
    }

    return {
      ...initialState,
      ...JSON.parse(raw),
    };
  } catch {
    return initialState;
  }
}

const CheckoutContext = createContext<CheckoutContextType | null>(
  null
);

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  // FIX: jangan baca localStorage di initializer useState — itu dijalankan
  // langsung saat render pertama, dan karena `window` tidak ada di server,
  // hasilnya beda antara render server (initialState) dan render client
  // pertama (isi localStorage). Ini yang menyebabkan
  // "Hydration failed because the server rendered HTML didn't match the client".
  //
  // Solusinya: render pertama selalu pakai initialState (sama persis di
  // server & client), baru di-hydrate dari localStorage setelah mount via
  // useEffect (yang hanya berjalan di client).
  const [state, setState] = useState<CheckoutState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // ── Hydrate dari localStorage setelah mount ─────────────────────────────
  useEffect(() => {
    setState(readFromStorage());
    setHydrated(true);
  }, []);

  // ── Persist ke localStorage setiap state berubah ───────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    // FIX: jangan tulis ke localStorage sebelum hydration selesai, supaya
    // initialState (kosong) tidak menimpa data yang sudah tersimpan
    // sebelum proses hydrate di atas selesai.
    if (!hydrated) return;

    localStorage.setItem(
      LS_KEY,
      JSON.stringify(state)
    );
  }, [state, hydrated]);

  const subtotal = state.items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return sum + price * item.quantity;
  }, 0);

  const postItems = (selected: CheckoutItem[]) => {
    setState((prev) => ({
      ...prev,
      items: selected,
    }));
  };

  const deleteItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (
    id: string,
    patch: Partial<Omit<CheckoutItem, "id">>
  ) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item
      ),
    }));
  };

  const clearItems = () => {
    setState((prev) => ({
      ...prev,
      items: [],
    }));
  };

  const setShipping = (data: ShippingInfo) => {
    setState((prev) => ({
      ...prev,
      shipping: data,
      // Shipping method must be re-selected for the current destination.
      method: null,
    }));
  };

  const setMethod = (data: ShippingMethod) => {
    setState((prev) => ({
      ...prev,
      method: data,
    }));
  };

  const setDiscount = (discount: number) => {
    setState((prev) => ({
      ...prev,
      discount,
    }));
  };

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, 3),
    }));
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 1),
    }));
  };

  const clearCheckout = () => {
    setState(initialState);

    if (typeof window !== "undefined") {
      localStorage.removeItem(LS_KEY);
    }
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

  if (!ctx) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider"
    );
  }

  return ctx;
}