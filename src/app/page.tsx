import CategorySection from "@/components/CategorySection";
import FeaturedCardsSection from "@/components/FeaturedCardsSection";
import Testimonial from "@/components/Testimonial";
import FAQSection from "@/components/FAQSection";
import PromoSection from "@/components/PromoSection";
import TopProducts from "@/components/TopProducts";
import SubscribeSection from "@/components/SubscribeSection";
import HomeBanner from "@/components/HomeBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-1 flex-col bg-white dark:bg-black">
        <HomeBanner />
        <CategorySection />
        <FeaturedCardsSection />
        <TopProducts />
        <PromoSection />
        <Testimonial />
        <FAQSection />
        <SubscribeSection />
      </main>
    </div>
  );
}
