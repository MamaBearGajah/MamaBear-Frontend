export const PRODUCT_IMAGE_PLACEHOLDER = "/Logo Mamabear.png";

/** BE may return bare filenames — normalize for next/image. */
export function resolveProductImageUrl(raw?: string | null): string {
  if (!raw?.trim()) return PRODUCT_IMAGE_PLACEHOLDER;

  const url = raw.trim();
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  ) {
    return url;
  }

  const assetBase =
    process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "") ??
    `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "") ?? "http://localhost:3000"}/uploads`;

  return `${assetBase}/${encodeURI(url)}`;
}

export function isAbsoluteOrPublicPath(url: string): boolean {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}
