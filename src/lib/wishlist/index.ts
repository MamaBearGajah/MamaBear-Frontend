const WISHLIST_KEY = "wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
}

export function toggleWishlist(productId: string) {
  const list = getWishlist();

  const exists = list.includes(productId);

  const updated = exists
    ? list.filter((id) => id !== productId)
    : [...list, productId];

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));

  return updated;
}

export function isWishlisted(productId: string) {
  return getWishlist().includes(productId);
}