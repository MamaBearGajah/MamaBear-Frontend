import CategorySection from "@/components/CategoryShowcase";
import FeaturedCardsSection from "@/components/FeaturedCardsSection";
import Testimonial from "@/components/Testimonial";
import FAQSection from "@/components/FAQSection";
import PromoSection from "@/components/PromoSection";
import TopProducts from "@/components/TopProducts";
import SubscribeSection from "@/components/NewsletterForm";
import HomeBanner from "@/components/HeroBanner";
import FloatingChatButton from "@/components/FloatingChatButton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";

export const metadata = {
  title: "MamaBear | ASI Booster dan Produk Ibu & Anak",
  description:
    "MamaBear menyediakan produk ASI booster, cemilan sehat, dan kebutuhan ibu dan anak dengan pengalaman belanja yang hangat dan mudah.",
};

/*
// Backend fetch for categories is temporarily disabled while BE is not ready.
// Uncomment and use the function below when backend endpoint is available.
async function fetchCategories(): Promise<Category[]> {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  const candidates = [
    ${BASE}/categories,
    ${BASE}/categories/list,
    ${BASE}/product-categories,
    ${BASE}/products/categories,
  ];

  for (const url of candidates) {
    const data = await tryFetch(url);
    if (!data) continue;

    if (Array.isArray(data)) {
      if (data.length === 0) return [];
      // array of strings -> convert to minimal Category
      if (typeof data[0] === "string") {
        return (data as string[]).map((s) => ({ name: s, image: null, count: 0 }));
      }

      if (data[0] && typeof data[0] === "object") {
        // map common field names to our Category shape
        return (data as any[]).map((c) => {
          const name = c.name ?? c.title ?? c.label ?? c.category ?? String(c.id ?? "");
          const image = c.image ?? c.imageUrl ?? c.thumbnail ?? null;
          const count = c.count ?? c.productCount ?? c.productsCount ?? c.total ?? 0;
          return { id: c.id ?? undefined, name, image, count } as Category;
        });
      }
    }
  }

  console.warn("No categories endpoint returned usable data");
  return [];
}
*/

export default async function Home() {
  return (
    <div
      className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black"
      style={{ backgroundColor: "#FEF2F5" }}
    >
      <Header />
      <main className="flex w-full flex-1 flex-col bg-[#FEF2F5] dark:bg-black">
        <BackToTop />
        <HomeBanner />
        {/* MOBILE-ONLY: page gutters live here; desktop keeps 3cm gutters */}
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <CategorySection />
          </div>
        </section>
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <FeaturedCardsSection />
          </div>
        </section>
        {/* Backend top-products fetch is temporarily disabled.
          When BE data is ready, restore:
          const products = await fetchProducts();
          <TopProducts products={products} />
        */}
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <TopProducts />
          </div>
        </section>
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <PromoSection />
          </div>
        </section>
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <Testimonial />
          </div>
        </section>
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <FAQSection />
          </div>
        </section>
        <section className="px-4 sm:px-[3cm]">
          <div className="mx-auto w-full max-w-[1320px]">
            <SubscribeSection />
          </div>
        </section>
        <FloatingChatButton href="#" />
      </main>
      <Footer />
    </div>
  );
}
