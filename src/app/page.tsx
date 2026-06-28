import CategorySection from "@/components/CategoryShowcase";
import FeaturedCardsSection from "@/components/FeaturedCardsSection";
import Testimonial from "@/components/Testimonial";
import FAQSection from "@/components/FAQSection";
import PromoSection from "@/components/PromoSection";
import TopProducts from "@/components/TopProducts";
import SubscribeSection from "@/components/NewsletterForm";
import HomeBanner from "@/components/HeroBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";

export const metadata = {
  title: "MamaBear | ASI Booster dan Produk Ibu & Anak",
  description:
    "MamaBear menyediakan produk ASI booster, cemilan sehat, dan kebutuhan ibu dan anak dengan pengalaman belanja yang hangat dan mudah.",
};

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
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <CategorySection />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <FeaturedCardsSection />
          </div>
        </section>
        {/* Backend top-products fetch is temporarily disabled.
          When BE data is ready, restore:
          const products = await fetchProducts();
          <TopProducts products={products} />
        */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <TopProducts />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <PromoSection />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <Testimonial />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <FAQSection />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1320px]">
            <SubscribeSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}