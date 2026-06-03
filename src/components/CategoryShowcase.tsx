import Link from "next/link";
import { getCategoryListNoFlatten } from "@/lib/api/categories";

export interface Category {
  id?: string | number;
  name: string;
  image?: string | null;
  count?: number;
}

interface CategorySectionProps {
  categories?: Category[];
}

interface CategoryCardProps {
  category: Category;
  gradientClass: string;
  count: number;
  shouldScroll?: boolean;
  mobileSize?: boolean;
}


function CategoryCard({
  category,
  gradientClass,
  count,
  shouldScroll,
  mobileSize,
}: CategoryCardProps) {
  const sizeClass = mobileSize
    ? "relative aspect-[9/10] min-w-[160px] max-w-[180px] overflow-hidden rounded-[16px] bg-gray-100 snap-start"
    : shouldScroll
      ? "relative aspect-[9/10] w-[200px] flex-shrink-0 overflow-hidden rounded-[16px] bg-gray-100"
      : "relative aspect-[9/10] w-full overflow-hidden rounded-[16px] bg-gray-100";

  return (
    <Link
      href={
        category.id != null
          ? `/products?categoryId=${encodeURIComponent(String(category.id))}`
          : "/products"
      }
      className={`${sizeClass} group block`}
      aria-label={`View products in ${category.name}`}
    >
      {/* image or gradient fallback */}
      {category.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105 group-hover:blur-[1px]"
          style={{ backgroundImage: `url(${category.image})` }}
        />
      ) : (
        <div className={`absolute inset-0 ${gradientClass}`} />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/0 opacity-0 transition duration-300 group-hover:bg-white/10 group-hover:opacity-100">
        <span className="inline-flex items-center rounded-full bg-[#6C4735] px-2 py-0.5 text-[11px] font-semibold tracking-[0.15em] text-white uppercase shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
          shop now
        </span>
      </div>

      {/* Center overlay (optional) */}
      <div className="relative z-10 flex h-full w-full items-center justify-center"></div>

      {/* Bottom overlay for title and product count */}
      <div className="absolute inset-x-0 bottom-0 flex h-[58%] items-end justify-center">
        <div className="w-full translate-y-[4px] bg-gradient-to-t from-white via-white/80 to-transparent px-2 py-3 text-center">
          <div className="translate-y-1 text-center font-['Quicksand'] text-[clamp(9px,0.9vw,10px)] leading-[12px] font-black tracking-[0px] text-[#6C4735]">
            {category.name}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CategorySection({
  categories: propCategories,
}: CategorySectionProps = {}) {
  const normalizeCategory = (item: Record<string, unknown>): Category => ({
    id: (item.id as string | number | undefined) ?? undefined,
    name: String(item.name ?? item.title ?? item.label ?? ""),
    image:
      (item.imageUrl as string | undefined) ??
      (item.image as string | undefined) ??
      (item.thumbnail as string | undefined) ??
      null,
    count: Number(item.count ?? item.productCount ?? item.productsCount ?? 0),
  });

  let fetchedCategories: Category[] = [];

  try {
    const categoriesRes = await getCategoryListNoFlatten();

    fetchedCategories = categoriesRes.data
      .filter((item) => Boolean(item?.name))
      .map((item) =>
        normalizeCategory(item as unknown as Record<string, unknown>)
      );

    if (fetchedCategories.length === 0) {
      throw new Error("No categories returned from backend");
    }
  } catch {
    fetchedCategories = [];
  }

  console.log("fetchedcategories", fetchedCategories)
  const categories =
    fetchedCategories.length > 0
      ? fetchedCategories
      : propCategories && propCategories.length > 0
        ? propCategories
        : [];


    //   const categories =
    // fetchedCategories.length > 0
    //   ? fetchedCategories
    //   : null;

  // gradient variants per card (deterministic for SSR)
  const gradientClasses = [
    "bg-gradient-to-r from-[#FACBD8] to-[#D86D88]",
    "bg-gradient-to-l from-[#D86D88] to-white",
    "bg-gradient-to-br from-[#D86D88] to-white",
    "bg-gradient-to-tl from-[#FACBD8] to-[#D86D88]",
    "bg-gradient-to-tr from-[#D86D88] to-[#FACBD8]",
    "bg-gradient-to-bl from-[#FACBD8] to-white",
  ];

  const productCounts = [5, 3, 4, 3, 4, 3];
  const shouldScroll = categories.length > 6;
  const cardRowClasses = shouldScroll
    ? "mx-auto flex w-fit items-stretch justify-start gap-4"
    : "grid w-full grid-cols-6 items-stretch gap-4";

  return (
    <section className="w-full bg-[#FEF2F5] pt-5 md:pt-10">
      <div className="hidden w-full px-0 md:block">
        <div className="mx-auto max-w-[760px] px-0 text-center">
          <span className="-mt-2 inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 font-['Quicksand'] text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            Shop by Category
          </span>
          {/* <h2 className="mx-auto mt-4 max-w-full text-center font-['Quicksand'] text-[24px] leading-[1.05] font-black tracking-[0px] text-[#6C4735] md:text-[36px] md:leading-[36px]">
            Find Your Perfect Match
          </h2>
          <p className="mx-auto mt-3 max-w-full px-2 text-center font-['Quicksand'] text-[13px] leading-[20px] font-normal tracking-[0px] text-[#8D6B5B] md:max-w-[448px] md:text-[14px]">
            Whether you love tea, prefer capsules, or snack on cookies — we have
            something for every mama.
          </p> */}
        </div>
        <div className="mt-10 px-0">
          <div className={shouldScroll ? "overflow-x-auto" : "overflow-hidden"}>
            <div className={cardRowClasses}>
              {categories.map((category, index) => {
                const gradient =
                  gradientClasses[index % gradientClasses.length];
                const count = category.count ?? productCounts[index] ?? 0;
                const key = category.id ?? category.name + index;

                return (
                  <CategoryCard
                    key={key}
                    category={category}
                    gradientClass={gradient}
                    count={count}
                    shouldScroll={shouldScroll}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only block: wider cards with horizontal swipe, showing 2-3 at a time */}
      <div className="w-full px-0 md:hidden">
        <div className="mx-auto max-w-[760px] px-0 text-center">
          <span className="-mt-2 inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 font-['Quicksand'] text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            Shop by Category
          </span>
          {/* <h2 className="mx-auto mt-4 max-w-full text-center font-['Quicksand'] text-[24px] leading-[1.05] font-black tracking-[0px] text-[#6C4735']">
            Apa Favorit Mama Hari Ini?
          </h2>
          <p className="mx-auto mt-3 max-w-full px-2 text-center font-['Quicksand'] text-[13px] leading-[20px] font-normal tracking-[0px] text-[#8D6B5B]">
            Mulai dari minuman hangat sampai camilan praktis, semua bisa jadi
            teman menyusui Mama.
          </p> */}
        </div>

        <div className="mt-7 overflow-x-auto">
          <div className="flex w-max snap-x snap-mandatory scroll-px-4 gap-3">
            {categories.map((category, index) => {
              const gradient = gradientClasses[index % gradientClasses.length];
              const count = category.count ?? productCounts[index] ?? 0;
              const key = category.id ?? category.name + index;

              return (
                <CategoryCard
                  key={key}
                  category={category}
                  gradientClass={gradient}
                  count={count}
                  mobileSize
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
