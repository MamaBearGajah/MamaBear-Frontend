import { getProductById } from "@/lib/api/products";
import type { Product } from "@/types";

import { WISHLIST_MAX_ITEMS } from ".";

export async function fetchWishlistProducts(
  productIds: string[]
): Promise<Product[]> {
  const ids = productIds.slice(0, WISHLIST_MAX_ITEMS);
  if (ids.length === 0) return [];

  const results = await Promise.allSettled(ids.map((id) => getProductById(id)));

  return results
    .filter((result): result is PromiseFulfilledResult<Product> => {
      return result.status === "fulfilled" && Boolean(result.value?.id);
    })
    .map((result) => result.value);
}
