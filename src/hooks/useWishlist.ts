"use client";

import { useCallback, useEffect, useState } from "react";

import {
  WISHLIST_CHANGED_EVENT,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
  setWishlist,
  toggleWishlist,
} from "@/lib/wishlist";
import {
  extractWishlistProductIds,
  wishlistApi,
} from "@/lib/api/wishlist";

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  const syncFromStorage = useCallback(() => {
    setIds(getWishlist());
  }, []);

  const syncFromApi = useCallback(async () => {
    const [ids, setIds] = useState<string[]>(() => getWishlist());
      const { data } = await wishlistApi.getAll();
      const productIds = extractWishlistProductIds(data);
      setWishlist(productIds);
      setIds(productIds);
    } catch {
      syncFromStorage();
    }
  }, [syncFromStorage]);

    type UseWishlistReturn = {
      ids: string[];
      count: number;
      toggle: (productId: string) => void;
      remove: (productId: string) => void;
      clear: () => void;
      refresh: () => Promise<void>;
    };

    export function useWishlist(): UseWishlistReturn {
      const [ids, setIds] = useState<string[]>(() => getWishlist());

        if (mergedIds.length > 0) {
          setWishlist(mergedIds);
        }

        setIds(mergedIds.length > 0 ? mergedIds : localIds);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wishlist") {
          const localIds = getWishlist();
          const mergedIds = Array.from(new Set([...localIds, ...productIds]));

          if (mergedIds.length > 0) {
            setWishlist(mergedIds);
            setIds(mergedIds);
            return;
          }

          setIds(localIds);
    };

    const handleCustom = () => {
      syncFromStorage();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(WISHLIST_CHANGED_EVENT, handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(WISHLIST_CHANGED_EVENT, handleCustom);
    };
  }, [syncFromApi]);

  return {
    ids,
    count: ids.length,
    toggle: (productId: string) => {
      void (async () => {
        const alreadyExists = ids.includes(productId);

        try {
          if (alreadyExists) {
            await wishlistApi.remove(productId);
          } else {
            await wishlistApi.create({ productId });
          }

          await syncFromApi();
        } catch {
          const updated = toggleWishlist(productId);
          setIds(updated);
        }
      })();
    },
    remove: (productId: string) => {
      void (async () => {
        try {
          await wishlistApi.remove(productId);
          await syncFromApi();
        } catch {
          const updated = removeFromWishlist(productId);
          setIds(updated);
        }
      })();
    },
    clear: () => {
      void (async () => {
        try {
          await Promise.all(ids.map((productId) => wishlistApi.remove(productId)));
          await syncFromApi();
        } catch {
          clearWishlist();
          syncFromStorage();
        }
      })();
    },
    refresh: syncFromApi,
  };
}
