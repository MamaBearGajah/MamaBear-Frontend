"use client";

/**
 * WishlistContext
 *
 * Strategy:
 * - Guest (tidak login): simpan di localStorage saja (pakai lib/wishlist)
 * - User (login): sync ke BE via /wishlist API
 * - Saat login: merge localStorage wishlist ke BE, lalu clear localStorage
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { wishlistApi, WishlistItem } from "@/lib/api/wishlist";

// ─── localStorage helpers ────────────────────────────────────────────────────

const WISHLIST_KEY = "wishlist";

function getLocalWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalWishlist(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

// ─── Context types ────────────────────────────────────────────────────────────

interface WishlistContextType {
  items: WishlistItem[];
  productIds: Set<string>;
  isLoading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string, productName?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { state: authState } = useAuth();
  const isLoggedIn = Boolean(authState.user);

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [localIds, setLocalIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Derived set for O(1) lookup
  const productIds = isLoggedIn
    ? new Set(items.map((i) => i.productId))
    : new Set(localIds);

  // ── Fetch from BE (logged-in) ──────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const res = await wishlistApi.getAll();
      setItems(res.data?.data?.items ?? []);
    } catch {
      // Fail silently
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // ── On mount: load localStorage wishlist for guest ─────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      setLocalIds(getLocalWishlist());
    }
  }, [isLoggedIn]);

  // ── On login: fetch from BE + merge localStorage → BE ─────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;

    const mergeAndFetch = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil wishlist dari localStorage (sebelum login)
        const guestIds = getLocalWishlist();

        // 2. Fetch wishlist BE yang sudah ada
        const res = await wishlistApi.getAll();
        const beItems = res.data?.data?.items ?? [];
        const beIds = new Set(beItems.map((i) => i.productId));

        // 3. Merge: tambahkan guestIds yang belum ada di BE
        const toAdd = guestIds.filter((id) => !beIds.has(id));
        await Promise.allSettled(toAdd.map((id) => wishlistApi.add(id)));

        // 4. Clear localStorage
        saveLocalWishlist([]);
        setLocalIds([]);

        // 5. Refresh final
        const finalRes = await wishlistApi.getAll();
        setItems(finalRes.data?.data?.items ?? []);
      } catch {
        // Fallback: setidaknya tampilkan yang sudah ada di BE
        await refresh();
      } finally {
        setIsLoading(false);
      }
    };

    mergeAndFetch();
  }, [authState.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle ──────────────────────────────────────────────────────────────────
  const toggle = useCallback(
    async (productId: string, productName?: string) => {
      const name = productName ?? "Produk";

      if (isLoggedIn) {
        // Authenticated: sync ke BE
        const alreadyIn = items.some((i) => i.productId === productId);

        // Optimistic update
        if (alreadyIn) {
          setItems((prev) => prev.filter((i) => i.productId !== productId));
        }

        try {
          if (alreadyIn) {
            await wishlistApi.remove(productId);
            toast.success(`${name} dihapus dari wishlist`);
          } else {
            const res = await wishlistApi.add(productId);
            const newItem = res.data?.data;
            if (newItem) {
              setItems((prev) => [newItem, ...prev]);
            } else {
              await refresh();
            }
            toast.success(`${name} ditambahkan ke wishlist ❤️`);
          }
        } catch (err: any) {
          // Rollback on error
          await refresh();
          const msg =
            err?.response?.data?.message ?? "Gagal update wishlist";
          toast.error(msg);
        }
      } else {
        // Guest: localStorage only
        const current = getLocalWishlist();
        const alreadyIn = current.includes(productId);
        const updated = alreadyIn
          ? current.filter((id) => id !== productId)
          : [...current, productId];

        saveLocalWishlist(updated);
        setLocalIds(updated);

        toast.success(
          alreadyIn
            ? `${name} dihapus dari wishlist`
            : `${name} ditambahkan ke wishlist ❤️`
        );
      }
    },
    [isLoggedIn, items, refresh]
  );

  const isWishlisted = useCallback(
    (productId: string) => productIds.has(productId),
    [productIds]
  );

  return (
    <WishlistContext.Provider
      value={{ items, productIds, isLoading, isWishlisted, toggle, refresh }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}