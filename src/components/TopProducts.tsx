import Link from "next/link";
import Image from "next/image";
// removed ShoppingCart import during merge conflict resolution
import { apiClient } from "@/lib/api/client";
import type { ProductBadgeType } from "@/types";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  description: string;
  imageUrls: string[];
};

const BADGE_LABELS: Record<ProductBadgeType, string> = {
  "best-seller": "Best Seller",
  "fan-favorite": "Fan Favorite",
  new: "New",
};

type BestsellerProduct = {
  id?: string | number;
  category: string;
  name: string;
  slug?: string;
  rating: string;
  price: string;
  originalPrice?: string;
  variant: string[];
  imageUrl?: string;
  imageLabel: string;
  imageAccentClass: string;
  primaryBadgeLabel?: string;
  primaryBadgeClassName?: string;
  secondaryBadgeLabel?: string;
  secondaryBadgeClassName?: string;
};

interface TopProductsProps {
  products?: (Product | BestsellerProduct)[];
}

function isBestsellerProduct(product: any): product is BestsellerProduct {
  return product && typeof product === "object" && "imageLabel" in product;
}

const fallbackProducts: BestsellerProduct[] = [
  {
    category: "Almon Mix",
    name: "MamaBear AlmonMix - All Variants",
    rating: "4.8 (284)",
    price: "Rp 65.000",
    originalPrice: "Rp 80.000",
    variant: ["Hazelnut", "Lychee", "Thai", "+2 more"],
    imageUrl: "/Image%20HomePage/almonmix.jpeg",
    imageLabel: "Almon Mix",
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
    primaryBadgeLabel: "Best Seller",
    primaryBadgeClassName: "bg-[#E35F8A] text-white",
    secondaryBadgeLabel: "-19%",
    secondaryBadgeClassName: "bg-[#FF3B30] text-white",
  },
  {
    category: "Cereal",
    name: "Zoyamix - Nutrition Rich Cereal",
    rating: "4.7 (156)",
    price: "Rp 80.000",
    variant: ["Hazelnut", "Lychee", "Thai", "+2 more"],
    imageUrl: "/Image%20HomePage/zoya%20mix.png",
    imageLabel: "Zoya Mix",
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
    primaryBadgeLabel: "New",
    primaryBadgeClassName: "bg-[#F8D9E2] text-[#6C4735]",
  },
  {
    category: "ASI Booster Tea",
    name: "Mamabear Lactation Tea",
    rating: "4.9 (312)",
    price: "Rp 65.000",
    originalPrice: "Rp 75.000",
    variant: ["Hazelnut", "Lychee", "Thai", "+2 more"],
    imageUrl: "/Image%20HomePage/teh%20pelancar%20asi.png",
    imageLabel: "ASI Booster Tea",
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
    primaryBadgeLabel: "-13%",
    primaryBadgeClassName: "bg-[#FF3B30] text-white",
    secondaryBadgeLabel: "Low Stock",
    secondaryBadgeClassName: "bg-[#FFF1C8] text-[#6C4735]",
  },
  {
    category: "Cookies",
    name: "Kukis - Almond Oat",
    rating: "4.6 (423)",
    price: "Rp 80.000",
    variant: ["Regular", "Premium"],
    imageUrl: "/Image%20HomePage/kukis%20almond%20oat.png",
    imageLabel: "Almond Oat Cookies & Cream",
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
    primaryBadgeLabel: "Most Popular",
    primaryBadgeClassName: "bg-[#E35F8A] text-white",
  },
];

type BestSellerApiImage = {
  imageType?: string;
  imageUrl?: string;
  altText?: string;
};

type BestSellerApiCategory = {
  id?: string | number;
  name?: string;
  slug?: string;
};

type BestSellerApiProduct = {
  id?: string | number;
  categoryId?: string | number;
  name?: string;
  slug?: string;
  description?: string;
  basePrice?: number;
  discountPrice?: number | null;
  weight?: number | null;
  sku?: string;
  stock?: number;
  badge?: ProductBadgeType;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  avgRating?: number | null;
  reviewCount?: number | null;
  deletedAt?: string | null;
  images?: BestSellerApiImage[];
  category?: BestSellerApiCategory | null;
};

function formatPrice(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Rp 0";
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
}

function toNumber(value?: number | string | null) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function normalizeImageSrc(src?: string | null) {
  if (!src) return undefined;

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  const prefixed = src.startsWith("/") ? src : `/${src}`;
  return encodeURI(prefixed);
}

function mapBestSellerToCard(product: BestSellerApiProduct): BestsellerProduct {
  const mainImage =
    product.images?.find((image) => image.imageType === "main") ??
    product.images?.[0];
  const basePrice = toNumber(product.basePrice);
  const discountPrice = toNumber(product.discountPrice);
  const avgRating = toNumber(product.avgRating);
  const reviewCount = toNumber(product.reviewCount);
  const hasDiscount =
    typeof discountPrice === "number" &&
    typeof basePrice === "number" &&
    discountPrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - discountPrice) / basePrice) * 100)
    : undefined;

  const badgeLabel = product.badge ? BADGE_LABELS[product.badge] : undefined;
  const badgeClassName = product.badge
    ? "bg-[#E35F8A] text-white"
    : hasDiscount
      ? "bg-[#FF3B30] text-white"
      : "bg-[#E35F8A] text-white";

  return {
    id: product.id,
    category: product.category?.name ?? "Product",
    name: product.name ?? "Untitled product",
    slug: product.slug,
    rating: `${avgRating ?? 0} (${reviewCount ?? 0})`,
    price: formatPrice(discountPrice ?? basePrice ?? 0),
    originalPrice: hasDiscount ? formatPrice(basePrice) : undefined,
    variant: [],
    imageUrl: normalizeImageSrc(mainImage?.imageUrl),
    imageLabel: mainImage?.altText ?? product.name ?? "Product image",
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
    primaryBadgeLabel:
      badgeLabel ?? (hasDiscount ? `-${discountPercent}%` : "Best Seller"),
    primaryBadgeClassName: badgeClassName,
    secondaryBadgeLabel:
      badgeLabel && discountPercent != null
        ? `-${discountPercent}%`
        : undefined,
    secondaryBadgeClassName:
      badgeLabel && discountPercent != null
        ? "bg-[#FF3B30] text-white"
        : undefined,
  };
}

async function fetchBestSellers(limit = 10): Promise<BestsellerProduct[]> {
  const response = await apiClient.get("/products/best-sellers", {
    params: { limit },
  });

  const items = response.data?.data;
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((product) =>
    mapBestSellerToCard(product as BestSellerApiProduct)
  );
}

export default async function TopProducts({ products }: TopProductsProps = {}) {
  let displayProducts: BestsellerProduct[] = [];

  if (products && products.length > 0) {
    displayProducts = products.map((p) =>
      isBestsellerProduct(p)
        ? p
        : mapBestSellerToCard({
            id: (p as Product).id,
            name: (p as Product).name,
            basePrice: (p as Product).price,
            avgRating: (p as Product).rating,
            category: { name: (p as Product).brand || "Product" },
          })
    );
  } else {
    try {
      displayProducts = await fetchBestSellers(10);
    } catch {
      displayProducts = [];
    }
  }

  if (displayProducts.length === 0) {
    displayProducts = fallbackProducts;
  }

  const shownProducts = displayProducts.slice(0, 4);
  return (
    <section className="w-full bg-[#FEF2F5] pt-5 pb-0 font-['Quicksand'] md:pt-8 md:pb-4">
      <div className="hidden w-full px-0 md:block">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-[720px]">
            <span className="inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
              ✨ Best Sellers
            </span>
            <h2 className="mt-3 text-[36px] leading-[1.05] font-black text-[#6C4735] md:text-[42px]">
              Mama's Favorites
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#8D6B5B] md:text-[15px]">
              Products loved by thousands of nursing mama's.
            </p>
          </div>

          <Link
            href="/products?badge=best-seller"
            className="hidden items-center gap-2 text-[14px] font-medium text-[#D5557E] transition hover:opacity-80 md:inline-flex"
          >
            View All
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {shownProducts.map((product, index) => {
            const toggleId = `top-products-cart-toggle-${index}`;
            const productHref = `/product/${product.slug ?? product.id ?? product.name}`;

            return (
              <article
                key={product.name}
                className="group relative flex flex-col overflow-hidden rounded-[18px] border border-[#F1D0DB] bg-white shadow-[0_8px_24px_rgba(108,67,53,0.08)]"
              >
                <input
                  id={toggleId}
                  type="checkbox"
                  className="peer sr-only md:hidden"
                  aria-hidden="true"
                />
                {/* Image Section - Full cover */}
                <div
                  className={`relative h-[280px] w-full flex-shrink-0 overflow-hidden bg-gradient-to-br ${product.imageAccentClass}`}
                >
                  <label
                    htmlFor={toggleId}
                    className="absolute inset-0 z-10 cursor-pointer md:pointer-events-none md:cursor-default"
                    aria-label={`Show add to cart for ${product.name}`}
                  />
                  {/* Badge - Top Left Overlay (only primary/secondary labels) */}
                  {product.primaryBadgeLabel || product.secondaryBadgeLabel ? (
                    <div className="absolute top-4 left-4 z-10 inline-grid w-fit grid-rows-2 gap-1">
                      {product.primaryBadgeLabel ? (
                        <span
                          className={`block w-full rounded-full px-3 py-1 text-left text-[10px] font-bold whitespace-normal ${product.primaryBadgeClassName ?? "bg-[#E35F8A] text-white"}`}
                          style={{ textAlign: "left" }}
                        >
                          {product.primaryBadgeLabel}
                        </span>
                      ) : null}
                      {product.secondaryBadgeLabel ? (
                        <span
                          className={`block w-full rounded-full px-3 py-1 text-left text-[10px] font-bold whitespace-normal ${product.secondaryBadgeClassName ?? "bg-[#FF3B30] text-white"}`}
                          style={{ textAlign: "left" }}
                        >
                          {product.secondaryBadgeLabel}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#6C4735]/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 peer-checked:opacity-100" />

                  {/* Image Area */}
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-[#6C4735]">
                      <div>
                        <div className="text-[12px] font-semibold tracking-[0.1em] uppercase">
                          {product.imageLabel}
                        </div>
                        <div className="mt-1 text-[10px] text-[#8D6B5B]">
                          Image placeholder
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href={productHref}
                    className="absolute inset-x-3 bottom-3 z-20 flex translate-y-3 items-center justify-center gap-2 rounded-xl bg-[#D5557E] px-4 py-2.5 text-sm font-semibold text-white opacity-0 shadow-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 peer-checked:translate-y-0 peer-checked:opacity-100 hover:bg-[#C84E77]"
                  >
                    Shop Now
                  </Link>
                </div>

                {/* Detail Section - Bottom: category, name; rating, variant, price */}
                <div className="flex flex-col px-4 py-4">
                  <p className="text-[12px] font-semibold text-[#D5557E]">
                    {product.category}
                  </p>
                  <h3 className="mt-1 truncate text-[14px] leading-tight font-bold text-[#6C4735]">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-[12px] font-normal text-[#8D6B5B]">
                    <span className="text-[#F4A300]">★★★★★</span>
                    <span>{product.rating}</span>
                  </div>

                  {product.variant && product.variant.length > 0 ? (
                    <div className="mt-2 flex flex-wrap items-center gap-[3px]">
                      {product.variant
                        .filter((t) => !t.trim().startsWith("+"))
                        .map((variant) => (
                          <span
                            key={variant}
                            className="rounded-full bg-[#F6D6DF] px-2 py-[2px] text-[10px] leading-none text-[#6C4735]"
                          >
                            {variant}
                          </span>
                        ))}

                      {/* render +n more as plain brown text, not a pill */}
                      {product.variant.some((t) => t.trim().startsWith("+")) ? (
                        <span className="text-[10px] leading-none whitespace-nowrap text-[#6C4735]">
                          {product.variant.find((t) =>
                            t.trim().startsWith("+")
                          )}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-[16px] font-black text-[#6C4735]">
                      {product.price}
                    </span>
                    {product.originalPrice ? (
                      <span className="pb-[2px] text-[12px] font-normal text-[#A89A90] line-through">
                        {product.originalPrice}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href="/products?badge=best-seller"
          className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#D5557E] md:hidden"
        >
          View All
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Mobile-only version: khusus layar kecil, pakai grid 2x2 biar lebih rapi */}
      <div className="w-full px-0 md:hidden">
        <div className="px-4">
          <span className="inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            ✨ Best Sellers
          </span>
          <h2 className="mt-3 text-[24px] leading-[1.05] font-black text-[#6C4735]">
            Mama's Favorites
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#8D6B5B]">
            Products loved by thousands of nursing mama's.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 px-4">
          {shownProducts.map((product, index) => {
            const toggleId = `top-products-mobile-cart-toggle-${index}`;
            const productHref = `/product/${product.slug ?? product.id ?? product.name}`;

            return (
              <article
                key={product.name}
                className="group relative overflow-hidden rounded-[14px] border border-[#F1D0DB] bg-white shadow-[0_6px_18px_rgba(108,67,53,0.08)]"
              >
                <input
                  id={toggleId}
                  type="checkbox"
                  className="peer sr-only md:hidden"
                  aria-hidden="true"
                />
                <div
                  className={`relative h-[138px] w-full overflow-hidden bg-gradient-to-br ${product.imageAccentClass}`}
                >
                  <label
                    htmlFor={toggleId}
                    className="absolute inset-0 z-10 cursor-pointer md:pointer-events-none md:cursor-default"
                    aria-label={`Show add to cart for ${product.name}`}
                  />
                  {product.primaryBadgeLabel || product.secondaryBadgeLabel ? (
                    <div className="absolute top-2 left-2 z-10 inline-grid w-fit grid-rows-2 gap-1">
                      {product.primaryBadgeLabel ? (
                        <span
                          className={`block w-full rounded-full px-2 py-[2px] text-left text-[8px] font-bold whitespace-normal ${product.primaryBadgeClassName ?? "bg-[#E35F8A] text-white"}`}
                          style={{ textAlign: "left" }}
                        >
                          {product.primaryBadgeLabel}
                        </span>
                      ) : null}
                      {product.secondaryBadgeLabel ? (
                        <span
                          className={`block w-full rounded-full px-2 py-[2px] text-left text-[8px] font-bold whitespace-normal ${product.secondaryBadgeClassName ?? "bg-[#FF3B30] text-white"}`}
                          style={{ textAlign: "left" }}
                        >
                          {product.secondaryBadgeLabel}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#6C4735]/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 peer-checked:opacity-100" />

                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-3 text-center text-[#6C4735]">
                      <div>
                        <div className="text-[10px] font-semibold tracking-[0.08em] uppercase">
                          {product.imageLabel}
                        </div>
                        <div className="mt-1 text-[9px] text-[#8D6B5B]">
                          Image placeholder
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    href={productHref}
                    className="absolute inset-x-2 bottom-2 z-20 flex translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-[#D5557E] px-3 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 peer-checked:translate-y-0 peer-checked:opacity-100 hover:bg-[#C84E77]"
                  >
                    Shop Now
                  </Link>
                </div>

                <div className="px-2.5 py-2.5">
                  <p className="text-[10px] font-semibold text-[#D5557E]">
                    {product.category}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 text-[11px] leading-[1.15] font-bold text-[#6C4735]">
                    {product.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-normal text-[#8D6B5B]">
                    <span className="text-[#F4A300]">★★★★★</span>
                    <span>{product.rating}</span>
                  </div>

                  {product.variant && product.variant.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap items-center gap-[3px]">
                      {product.variant
                        .filter((t) => !t.trim().startsWith("+"))
                        .slice(0, 2)
                        .map((variant) => (
                          <span
                            key={variant}
                            className="rounded-full bg-[#F6D6DF] px-1.5 py-[1px] text-[8px] leading-none text-[#6C4735]"
                          >
                            {variant}
                          </span>
                        ))}

                      {product.variant.some((t) => t.trim().startsWith("+")) ? (
                        <span className="text-[8px] leading-none whitespace-nowrap text-[#6C4735]">
                          {product.variant.find((t) =>
                            t.trim().startsWith("+")
                          )}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-1.5 flex items-end gap-1.5">
                    <span className="text-[12px] font-black text-[#6C4735]">
                      {product.price}
                    </span>
                    {product.originalPrice ? (
                      <span className="pb-[1px] text-[9px] font-normal text-[#A89A90] line-through">
                        {product.originalPrice}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="px-4">
          <Link
            href="/products?badge=best-seller"
            className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#D5557E]"
          >
            View All
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
