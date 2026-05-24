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

// Exported mock data so it can be reused elsewhere; used as fallback until BE is ready.
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Almon Mix",
    image: "/Image%20HomePage/almonmix.jpeg",
    count: 5,
  },
  {
    id: 2,
    name: "Kukis Almond Oat",
    image: "/Image%20HomePage/kukis%20almond%20oat.png",
    count: 3,
  },
  {
    id: 3,
    name: "Breastmilk Storage Bag",
    image: "/Image%20HomePage/breastmilk%20bag.png",
    count: 4,
  },
  {
    id: 4,
    name: "Teh Pelancar Asi",
    image: "/Image%20HomePage/teh%20pelancar%20asi.png",
    count: 3,
  },
  {
    id: 5,
    name: "Zoya Mix",
    image: "/Image%20HomePage/zoya%20mix.png",
    count: 4,
  },
  { id: 6, name: "Kapsul", image: "/Image%20HomePage/kapsul.png", count: 3 },
];

/*
    API fetch skeleton (commented out)

    When the backend is ready, you can fetch categories from the BE endpoint
    `get/categories`. Keep this code commented until you want to switch from
    the mock data to the real data.

    Example (Server-side / Next.js - recommended for SSR):

    // export async function fetchCategories(): Promise<Category[]> {
    //   try {
    //     const res = await fetch('/get/categories', { next: { revalidate: 60 } });
    //     if (!res.ok) throw new Error('Failed to fetch categories');
    //     const data = await res.json();
    //     return data as Category[];
    //   } catch (err) {
    //     console.warn('fetchCategories failed, falling back to mock', err);
    //     return MOCK_CATEGORIES;
    //   }
    // }

    Example (Client-side - if you convert this component to a client component):

    // import { useEffect, useState } from 'react';
    // const [fetchedCategories, setFetchedCategories] = useState<Category[] | null>(null);
    // useEffect(() => {
    //   let mounted = true;
    //   fetch('/get/categories')
    //     .then((r) => r.ok ? r.json() : Promise.reject(r))
    //     .then((data) => mounted && setFetchedCategories(data))
    //     .catch(() => mounted && setFetchedCategories(MOCK_CATEGORIES));
    //   return () => { mounted = false; };
    // }, []);

    Note: Current implementation uses `MOCK_CATEGORIES` or the `categories` prop
    passed from the page. Leave that in place until the endpoint is live.

  */

function CategoryCard({
  category,
  gradientClass,
  count,
  shouldScroll,
  mobileSize,
}: CategoryCardProps) {
  const sizeClass = mobileSize
    ? "relative aspect-[9/10] w-full overflow-hidden rounded-[16px] border border-[#D5557E] bg-gray-100"
    : shouldScroll
      ? "relative aspect-[9/10] w-[200px] flex-shrink-0 overflow-hidden rounded-[16px] border border-[#D5557E] bg-gray-100"
      : "relative aspect-[9/10] w-full overflow-hidden rounded-[16px] border border-[#D5557E] bg-gray-100";

  return (
    <div className={sizeClass}>
      {/* image or gradient fallback */}
      {category.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.image})` }}
        />
      ) : (
        <div className={`absolute inset-0 ${gradientClass}`} />
      )}

      {/* Center overlay (optional) */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {/* intentionally left blank to show image */}
      </div>

      {/* Bottom overlay for title and product count */}
      <div className="absolute inset-x-0 bottom-0 flex h-[58%] items-end justify-center">
        <div className="w-full translate-y-[4px] bg-[linear-gradient(0deg,rgba(108,71,53,0.95)_0%,rgba(108,71,53,0.7)_35%,rgba(0,0,0,0)_100%)] px-2 py-3 text-center">
          <div className="translate-y-1 text-center font-['Quicksand'] text-[clamp(9px,0.9vw,10px)] leading-[12px] font-black tracking-[0px] text-white">
            {category.name}
          </div>
          <div className="mt-0.5 text-center font-['Quicksand'] text-[clamp(8px,0.85vw,10px)] leading-[12px] font-normal tracking-[0px] text-white/80">
            {count} products
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategorySection({
  categories: propCategories,
}: CategorySectionProps = {}) {
  const categories =
    propCategories && propCategories.length > 0
      ? propCategories
      : MOCK_CATEGORIES;

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
    <section className="w-full bg-white pt-5 pb-12 md:pt-10 md:pb-5">
      <div className="hidden w-full px-0 md:block">
        <div className="mx-auto max-w-[760px] px-0 text-center">
          <span className="-mt-2 inline-flex h-[24px] items-center justify-center rounded-full bg-[#FACBD8] px-3 py-1 font-['Quicksand'] text-[12px] leading-4 font-bold tracking-[0.6px] text-[#D5557E] uppercase">
            Shop by Category
          </span>
          <h2 className="mx-auto mt-4 max-w-full text-center font-['Quicksand'] text-[24px] leading-[1.05] font-black tracking-[0px] text-[#6C4735] md:text-[36px] md:leading-[36px]">
            Apa Favorit Mama Hari Ini?
          </h2>
          <p className="mx-auto mt-3 max-w-full px-2 text-center font-['Quicksand'] text-[13px] leading-[20px] font-normal tracking-[0px] text-[#8D6B5B] md:max-w-[448px] md:text-[14px]">
            Mulai dari minuman hangat sampai camilan praktis, semua bisa jadi
            teman menyusui Mama.
          </p>
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
          <h2 className="mx-auto mt-4 max-w-full text-center font-['Quicksand'] text-[24px] leading-[1.05] font-black tracking-[0px] text-[#6C4735]">
            Apa Favorit Mama Hari Ini?
          </h2>
          <p className="mx-auto mt-3 max-w-full px-2 text-center font-['Quicksand'] text-[13px] leading-[20px] font-normal tracking-[0px] text-[#8D6B5B]">
            Mulai dari minuman hangat sampai camilan praktis, semua bisa jadi
            teman menyusui Mama.
          </p>
        </div>

        <div className="mt-7 px-4 pb-2">
          <div className="grid grid-cols-2 gap-3">
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
