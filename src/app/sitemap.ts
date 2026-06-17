import type { MetadataRoute } from "next";
import { getProductList } from "@/lib/api/products";

const STATIC_PATHS = [
  "/",
  "/about",
  "/category",
  "/products",
  "/consultation",
  "/faq",
  "/newsletter",
  "/policy",
  "/promotion",
  "/terms",
];

function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001");

  return siteUrl.replace(/\/$/, "");
}

async function getAllProductEntries() {
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  const entries: Array<{ slug: string; updatedAt?: string | Date }> = [];

  do {
    const result = await getProductList({ page, limit });
    const products = Array.isArray(result.data) ? result.data : [];

    entries.push(
      ...products
        .filter((product) => Boolean(product?.slug))
        .map((product) => ({
          slug: product.slug,
          updatedAt: (product as { updatedAt?: string | Date }).updatedAt,
        }))
    );

    totalPages =
      result.meta?.totalPages ?? (products.length < limit ? page : page);
    page += 1;
  } while (page <= totalPages);

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await getAllProductEntries();

    productEntries = products.map((product) => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.slug)}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...productEntries];
}
