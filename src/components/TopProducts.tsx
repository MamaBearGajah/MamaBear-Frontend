import Link from "next/link";
import Image from "next/image";

type BestsellerProduct = {
  badge: string;
  category: string;
  name: string;
  subtitle: string;
  rating: string;
  price: string;
  originalPrice?: string;
  tags: string[];
  imageUrl?: string;
  imageLabel: string;
  imageAccentClass: string;
};

interface TopProductsProps {
  products?: BestsellerProduct[];
}

// Default placeholder cards (will be replaced by BE data via props)
const placeholderProducts: BestsellerProduct[] = Array.from({ length: 4 }).map(
  (_, i) => ({
    badge: "Placeholder",
    category: "Category",
    name: "Product Name",
    subtitle: "Product Subtitle",
    rating: "0 (0)",
    price: "Rp 0",
    tags: [],
    imageLabel: `Product ${i + 1}`,
    imageAccentClass: "from-[#F0E0F0] via-white to-[#E8D8E8]",
  })
);

export default function TopProducts({ products }: TopProductsProps = {}) {
  const displayProducts =
    products && products.length > 0 ? products : placeholderProducts;
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto w-full max-w-[1280px] px-0">
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
                {/* Badge - Top Left Overlay */}
                <span className="absolute top-4 left-4 z-10 rounded-full bg-[#E35F8A] px-3 py-1 text-[11px] font-semibold text-white">
                  {product.badge}
                </span>

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

              {/* Detail Section - Bottom */}
              <div className="flex flex-col px-4 py-4">
                <p className="text-[12px] font-medium text-[#D5557E]">
                  {product.category}
                </p>
                <h3 className="mt-1 text-[18px] leading-tight font-semibold text-[#6C4735]">
                  {product.name}
                </h3>
                <p className="mt-1 text-[12px] leading-5 text-[#8D6B5B]">
                  {product.subtitle}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[13px] text-[#8D6B5B]">
                  <span className="text-[#F4A300]">★★★★★</span>
                  <span>{product.rating}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F6D6DF] px-3 py-1 text-[11px] text-[#8D6B5B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-[18px] font-bold text-[#6C4735]">
                    {product.price}
                  </span>
                  {product.originalPrice ? (
                    <span className="pb-[2px] text-[12px] text-[#A89A90] line-through">
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
    </section>
  );
}
