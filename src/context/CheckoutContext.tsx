// "use client";
// import { createContext, useContext, useState, ReactNode } from "react";

// interface ShippingInfo {
//   fullName: string;
//   phone: string;
//   province: string;
//   city: string;
//   postalCode: string;
//   streetAddress: string;
//   deliveryNotes?: string | null;
// }

// interface ShippingMethod {
//   courier: string; // e.g. "JNE"
//   service: string; // e.g. "REG"
//   estimatedDays: string; // e.g. "2-3 days"
//   cost: number;
// }

// interface CheckoutState {
//   shipping: ShippingInfo | null;
//   method: ShippingMethod | null;
//   step: number;
// }

// interface CheckoutContextType {
//   state: CheckoutState;
//   setShipping: (data: ShippingInfo) => void;
//   setMethod: (data: ShippingMethod) => void;
//   clearCheckout: () => void;
//   nextStep: () => void;
//   prevStep: () => void;
// }

// const initialState: CheckoutState = {
//   shipping: null,
//   method: null,
//   step: 1,
// };

// const CheckoutContext = createContext<CheckoutContextType | null>(null);

// export function CheckoutProvider({ children }: { children: ReactNode }) {
//   const [state, setState] = useState<CheckoutState>(initialState);

//   const setShipping = (data: ShippingInfo) =>
//     setState((prev) => ({ ...prev, shipping: data }));

//   const setMethod = (data: ShippingMethod) =>
//     setState((prev) => ({ ...prev, method: data }));

//   const clearCheckout = () => setState(initialState);

//   const nextStep = () =>
//     setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) }));
//   const prevStep = () =>
//     setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
//   return (
//     <CheckoutContext.Provider
//       value={{
//         state,
//         setShipping,
//         setMethod,
//         clearCheckout,
//         nextStep,
//         prevStep,
//       }}
//     >
//       {children}
//     </CheckoutContext.Provider>
//   );
// }

// // typed hook — throws if used outside provider
// export function useCheckout() {
//   const ctx = useContext(CheckoutContext);
//   if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
//   return ctx;
// }





"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  image: string; // low extra product fields
}

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
  courier: string;     // e.g. "JNE"
  service: string;     // e.g. "REG"
  estimatedDays: string; // e.g. "2-3 days"
  cost: number;
}

interface CheckoutState {
  items: CheckoutItem[];
  shipping: ShippingInfo | null;
  method: ShippingMethod | null;
  step: number;
}

interface CheckoutContextType {
  state: CheckoutState;

  // ── Item methods ──────────────────────────────────────────────────────────
  /** Append all items from a `selected` array that are not already in the cart.
   *  Items already present have their quantity incremented instead. */
  postItems: (selected: CheckoutItem[]) => void;
  /** Remove a single item from the cart by its `id`. */
  deleteItem: (id: string) => void;
  /** Partially update a single item (e.g. change quantity or price). */
  updateItem: (id: string, patch: Partial<Omit<CheckoutItem, "id">>) => void;
  /** Wipe every item from the cart. */
  clearItems: () => void;

  // ── Shipping / method ─────────────────────────────────────────────────────
  setShipping: (data: ShippingInfo) => void;
  setMethod: (data: ShippingMethod) => void;

  // ── Navigation ────────────────────────────────────────────────────────────
  nextStep: () => void;
  prevStep: () => void;

  // ── Reset ─────────────────────────────────────────────────────────────────
  clearCheckout: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "checkout";

const initialState: CheckoutState = {
  items: [],
  shipping: null,
  method: null,
  step: 1,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readFromStorage(): CheckoutItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CheckoutItem[]) : [];
  } catch {
    return [];
  }
}



function writeToStorage(items: CheckoutItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    console.error("[CheckoutContext] Failed to write to localStorage.");
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CheckoutContext = createContext<CheckoutContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(() => ({
    ...initialState,
    items: readFromStorage(), // hydrate from localStorage on first render
  }));

  // Keep localStorage in sync whenever items change
  useEffect(() => {
    writeToStorage(state.items);
  }, [state.items]);

  // ── Item helpers (operate on items and sync storage) ──────────────────────

  const setItems = (updater: (prev: CheckoutItem[]) => CheckoutItem[]) => {
    setState((prev) => {
      const next = updater(prev.items);
      return { ...prev, items: next };
    });
  };

  /**
   * POST — merge a `selected` array into the cart.
   * - Existing item (same id) → increment quantity.
   * - New item → append.
   */

    function removeFromStorage(): void {
    try {
      localStorage.removeItem(LS_KEY);
      console.log("[CheckoutContext] Cleared localStorage key.");
    } catch {
      console.error("[CheckoutContext] Failed to remove localStorage key.");
    }
  }

  const postItems = (selected: CheckoutItem[]) => {
    setItems((prev) => {
      const map = new Map(prev.map((item) => [item.id, { ...item }]));

      for (const incoming of selected) {
        if (map.has(incoming.id)) {
          const existing = map.get(incoming.id)!;
          map.set(incoming.id, {
            ...existing,
            quantity: existing.quantity + incoming.quantity,
          });
        } else {
          map.set(incoming.id, { ...incoming });
        }
      }

      return Array.from(map.values());
    });
  };

  /** DELETE — remove one item by id. */
  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  /** UPDATE — patch one item's fields (quantity, price, name, …). */
  const updateItem = (
    id: string,
    patch: Partial<Omit<CheckoutItem, "id">>
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  /** Clear all items (and wipe localStorage key). */
  const clearItems = () => {
    setItems(() => []);
  };

  // ── Other setters ─────────────────────────────────────────────────────────

  const setShipping = (data: ShippingInfo) =>
    setState((prev) => ({ ...prev, shipping: data }));

  const setMethod = (data: ShippingMethod) =>
    setState((prev) => ({ ...prev, method: data }));

  const nextStep = () =>
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) }));

  const prevStep = () =>
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  /** Full reset — clears items, shipping, method, step, and localStorage. */
  const clearCheckout = () => {
    setState(initialState);
    localStorage.removeItem(LS_KEY);
    if (typeof window !== "undefined") localStorage.removeItem(LS_KEY);
  };

  return (
    <CheckoutContext.Provider
      value={{
        state,
        postItems,
        deleteItem,
        updateItem,
        clearItems,
        setShipping,
        setMethod,
        nextStep,
        prevStep,
        clearCheckout,

      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/** Typed hook — throws if used outside <CheckoutProvider>. */
export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}
