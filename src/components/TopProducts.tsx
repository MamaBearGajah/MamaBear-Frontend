import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  description: string;
  imageUrls: string[];
};

type BestsellerProduct = {
  category: string;
  name: string;
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

// BE can directly drive these fields later:
// primaryBadgeLabel, secondaryBadgeLabel, category, name,
// variant, rating, price, originalPrice, imageUrl, imageLabel.

function isBestsellerProduct(product: any): product is BestsellerProduct {
  return (
    product &&
    typeof product === "object" &&
    ("primaryBadgeLabel" in product || "secondaryBadgeLabel" in product) &&
    "imageLabel" in product
  );
}

function mapProductsToBestsellers(products: Product[]): BestsellerProduct[] {
  return products.map((product) => ({
    category: product.brand || "Product",
    name: product.name,
    rating: `${product.rating || 0} (0)`,
    price: `Rp ${product.price.toLocaleString("id-ID")}`,
    variant: [],
    imageLabel: product.name,
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
    primaryBadgeLabel: "Best Seller",
    primaryBadgeClassName: "bg-[#E35F8A] text-white",
  }));
}

// Temporary mock cards until BE top-product data is available.
// When BE is ready, restore the `products` prop path in `page.tsx` and remove this mock list.
const placeholderProducts: BestsellerProduct[] = [
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

export default function TopProducts({ products }: TopProductsProps = {}) {
  let displayProducts: BestsellerProduct[] = placeholderProducts;

  if (products && products.length > 0) {
    const allBestsellers = products.map((p) =>
      isBestsellerProduct(p) ? p : mapProductsToBestsellers([p as Product])[0]
    );
    displayProducts = allBestsellers;
  }
  return (
    <section className="w-full bg-white py-10 font-['Quicksand'] md:py-4">
      <div className="hidden w-full px-0 md:block">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-[720px]">
            <span className="inline-flex rounded-full bg-[#F7C4D2] px-4 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#D5557E] uppercase">
              ✨ Best Sellers
            </span>
            <h2 className="mt-3 text-[36px] leading-[1.05] font-black text-[#6C4735] md:text-[42px]">
              Paling Banyak Dicari Mama
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#8D6B5B] md:text-[15px]">
              Pilihan yang paling sering dibeli dan disukai oleh Mama.
            </p>
          </div>

          <Link
            href="/product"
            className="hidden items-center gap-2 text-[14px] font-medium text-[#D5557E] transition hover:opacity-80 md:inline-flex"
          >
            View All
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {displayProducts.map((product) => (
            <article
              key={product.name}
              className="flex flex-col overflow-hidden rounded-[18px] border border-[#F1D0DB] bg-white shadow-[0_8px_24px_rgba(108,67,53,0.08)]"
            >
              {/* Image Section - Full cover */}
              <div
                className={`relative h-[280px] w-full flex-shrink-0 overflow-hidden bg-gradient-to-br ${product.imageAccentClass}`}
              >
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

                {/* Image Area */}
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
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
                        {product.variant.find((t) => t.trim().startsWith("+"))}
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
          ))}
        </div>

        <Link
          href="/product"
          className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#D5557E] md:hidden"
        >
          View All
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Mobile-only version: khusus layar kecil, pakai grid 2x2 biar lebih rapi */}
      <div className="w-full px-0 md:hidden">
        <div className="px-4">
          <span className="inline-flex rounded-full bg-[#F7C4D2] px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#D5557E] uppercase">
            ✨ Best Sellers
          </span>
          <h2 className="mt-3 text-[24px] leading-[1.05] font-black text-[#6C4735]">
            Paling Banyak Dicari Mama
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#8D6B5B]">
            Pilihan yang paling sering dibeli dan disukai oleh Mama.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 px-4">
          {displayProducts.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-[14px] border border-[#F1D0DB] bg-white shadow-[0_6px_18px_rgba(108,67,53,0.08)]"
            >
              <div
                className={`relative h-[126px] w-full overflow-hidden bg-gradient-to-br ${product.imageAccentClass}`}
              >
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

                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
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
                        {product.variant.find((t) => t.trim().startsWith("+"))}
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
          ))}
        </div>

        <div className="px-4">
          <Link
            href="/product"
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
