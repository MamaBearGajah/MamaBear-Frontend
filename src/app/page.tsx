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
// import { fetchProducts } from "../../services/index";

export default async function Home() {
  return (
    <div
      className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black"
      style={{ backgroundColor: "#FEF2F5" }}
    >
      <Header />
      <main className="flex w-full flex-1 flex-col bg-[#FEF2F5] dark:bg-black">
        <HomeBanner />
        {/* MOBILE-ONLY: page gutters live here; desktop keeps 3cm gutters */}
        <section className="px-4 sm:px-[3cm]">
          <CategorySection />
        </section>
        <section className="px-4 sm:px-[3cm]">
          <FeaturedCardsSection />
        </section>
        {/* Backend top-products fetch is temporarily disabled.
          When BE data is ready, restore:
          const products = await fetchProducts();
          <TopProducts products={products} />
        */}
        <section className="px-0 sm:px-[3cm]">
          <TopProducts />
        </section>
        <section className="px-4 sm:px-[3cm]">
          <PromoSection />
        </section>
        <section className="px-4 sm:px-[3cm]">
          <Testimonial />
        </section>
        <section className="px-4 sm:px-[3cm]">
          <FAQSection />
        </section>
        <section className="px-4 sm:px-[3cm]">
          <SubscribeSection />
        </section>
        <FloatingChatButton href="#" />
      </main>
      <Footer />
    </div>
  );
}
