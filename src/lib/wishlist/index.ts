const WISHLIST_KEY = "wishlist";
export const WISHLIST_CHANGED_EVENT = "wishlist:changed";
export const WISHLIST_MAX_ITEMS = 20;

function parseWishlist(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function emitWishlistChange(ids: string[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(WISHLIST_CHANGED_EVENT, { detail: ids })
  );
}

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  return parseWishlist(localStorage.getItem(WISHLIST_KEY));
}

export function setWishlist(ids: string[]) {
  if (typeof window === "undefined") return;
  const unique = Array.from(new Set(ids)).slice(0, WISHLIST_MAX_ITEMS);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(unique));
  emitWishlistChange(unique);
}

export function isWishlisted(productId: string) {
  return getWishlist().includes(productId);
}

export function toggleWishlist(productId: string) {
  const list = getWishlist();
  const updated = list.includes(productId)
    ? list.filter((id) => id !== productId)
    : [...list, productId];

  setWishlist(updated);
  return updated;
}

export function removeFromWishlist(productId: string) {
  const updated = getWishlist().filter((id) => id !== productId);
  setWishlist(updated);
  return updated;
}

export function clearWishlist() {
  setWishlist([]);
  return [] as string[];
}
