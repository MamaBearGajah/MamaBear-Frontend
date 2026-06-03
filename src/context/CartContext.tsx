"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import type { CartItem } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type CartState = {
  items: CartItem[];
  subtotal: number;
  loading: boolean;
  synced: boolean; // sudah fetch dari backend?
};

type CartAction =
  | { type: "SET_CART"; payload: { items: CartItem[]; subtotal: number } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SYNCED" }
  | { type: "CLEAR" };

type CartContextType = {
  state: CartState;
  itemCount: number;
  addItem: (item: { productId: string; variantId?: string; quantity: number }) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise backend cart item ke CartItem type.
 * Backend returns: { id, productId, variantId, quantity, price, product, variant }
 */
function normalizeCartItem(raw: any): CartItem {
  const product = raw.product ?? {};
  const variant = raw.variant;
  const image =
    variant?.imageUrl ??
    product.images?.[0]?.imageUrl ??
    "";

  return {
    id: raw.id,
    productId: raw.productId,
    variantId: raw.variantId ?? undefined,
    variantName: variant?.name,
    variantValue: variant?.value,
    variantLabel: variant ? `${variant.name}: ${variant.value}` : undefined,
    quantity: raw.quantity,
    name: product.name ?? "",
    basePrice: Number(variant?.basePrice ?? product.basePrice ?? 0),
    discountPrice: variant?.discountPrice != null
      ? Number(variant.discountPrice)
      : product.discountPrice != null
        ? Number(product.discountPrice)
        : undefined,
    image,
  };
}

function parseCart(data: any): { items: CartItem[]; subtotal: number } {
  const raw = data?.data ?? data ?? {};
  const items = (raw.items ?? []).map(normalizeCartItem);
  const subtotal = Number(raw.subtotal ?? 0);
  return { items, subtotal };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items,
        subtotal: action.payload.subtotal,
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SYNCED":
      return { ...state, synced: true };
    case "CLEAR":
      return { items: [], subtotal: 0, loading: false, synced: true };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    loading: false,
    synced: false,
  });

  const { state: authState } = useAuth();
  const { isAuthenticated, user } = authState;

  // ─── Fetch cart dari backend ───────────────────────────────────────────────

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await apiClient.get("/cart");
      const { items, subtotal } = parseCart(res.data);
      dispatch({ type: "SET_CART", payload: { items, subtotal } });
      dispatch({ type: "SET_SYNCED" });
    } catch {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated]);

  // Fetch saat login/logout
  useEffect(() => {
    refreshCart();
  }, [user?.id]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const addItem = useCallback(async (dto: {
    productId: string;
    variantId?: string;
    quantity: number;
  }) => {
    try {
      const res = await apiClient.post("/cart/items", dto);
      const { items, subtotal } = parseCart(res.data);
      dispatch({ type: "SET_CART", payload: { items, subtotal } });
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? "Gagal menambahkan ke keranjang";
      toast.error(msg);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    // Optimistic update
    const prev = state.items;
    const newItems = prev.filter((i) => i.id !== itemId);
    const newSubtotal = newItems.reduce((s, i) => s + (i.discountPrice ?? i.basePrice) * i.quantity, 0);
    dispatch({ type: "SET_CART", payload: { items: newItems, subtotal: newSubtotal } });

    try {
      await apiClient.delete(`/cart/items/${itemId}`);
    } catch {
      // rollback
      dispatch({ type: "SET_CART", payload: { items: prev, subtotal: state.subtotal } });
      toast.error("Gagal menghapus item");
    }
  }, [state.items, state.subtotal]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    // Optimistic update
    const prev = state.items;
    const newItems = prev.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    const newSubtotal = newItems.reduce((s, i) => s + (i.discountPrice ?? i.basePrice) * i.quantity, 0);
    dispatch({ type: "SET_CART", payload: { items: newItems, subtotal: newSubtotal } });

    try {
      const res = await apiClient.put(`/cart/items/${itemId}`, { quantity });
      const { items, subtotal } = parseCart(res.data);
      dispatch({ type: "SET_CART", payload: { items, subtotal } });
    } catch (err: any) {
      // rollback
      dispatch({ type: "SET_CART", payload: { items: prev, subtotal: state.subtotal } });
      const msg = err?.response?.data?.error?.message ?? "Gagal mengupdate jumlah";
      toast.error(msg);
    }
  }, [state.items, state.subtotal, removeItem]);

  const clearCart = useCallback(async () => {
    dispatch({ type: "CLEAR" });
    try {
      await apiClient.delete("/cart");
    } catch {
      await refreshCart();
    }
  }, [refreshCart]);

  // ─── Memoized value ───────────────────────────────────────────────────────

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({ state, itemCount, addItem, removeItem, updateQuantity, clearCart, refreshCart }),
    [state, itemCount, addItem, removeItem, updateQuantity, clearCart, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside <CartProvider>");
  return ctx;
}