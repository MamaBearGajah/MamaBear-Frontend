"use client";

import { useCallback, useEffect, useState } from "react";

import {
  WISHLIST_CHANGED_EVENT,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "@/lib/wishlist";

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  const syncFromStorage = useCallback(() => {
    setIds(getWishlist());
  }, []);

  useEffect(() => {
    syncFromStorage();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wishlist") {
        syncFromStorage();
      }
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
  }, [syncFromStorage]);

  return {
    ids,
    count: ids.length,
    toggle: toggleWishlist,
    remove: removeFromWishlist,
    clear: clearWishlist,
    refresh: syncFromStorage,
  };
}
