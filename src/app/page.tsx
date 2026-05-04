import Image from "next/image";
import Testimonial from "@/components/Testimonial";
import TopProducts from "@/components/TopProducts";
import HomeBanner from "@/components/HomeBanner";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <HomeBanner/>
          Home Page
        <TopProducts/>
        <Testimonial/>
      </main>
    </div>
  );
}
