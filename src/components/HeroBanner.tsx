"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselBannerItem {
  id: string; // ← string, bukan number (BE return UUID)
  label: string;
  desc: string;
  extraText: string;
  image: string;
  title: string;
  path: string;
}

const HomeBanner = () => {
  const heroHeightClass = "h-[calc(100svh-105px)]";
  const [api, setApi] = React.useState<any>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [bannerData, setBannerData] = React.useState<CarouselBannerItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mobileIndex, setMobileIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const response = await fetch(`${baseUrl}/banners`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.status}`);
        }

        const data = await response.json();
        const banners = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        const mappedBanners = banners.map((item: any, index: number) => ({
          id: String(item.id ?? index), // ← String(), bukan Number() — hindari NaN
          label: item.label ?? "",
          desc: item.desc ?? "",
          extraText: item.extraText ?? "",
          image: item.imageUrl ?? "/Logo Mamabear.png",
          title: item.title ?? "",
          path: item.path ?? "/",
        }));

        setBannerData(mappedBanners);
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
        setBannerData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  React.useEffect(() => {
    if (!api) return;

    const updateActiveIndex = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateActiveIndex();
    api.on("select", updateActiveIndex);
    api.on("reInit", updateActiveIndex);

    return () => {
      api.off("select", updateActiveIndex);
      api.off("reInit", updateActiveIndex);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    const autoplay = window.setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [api]);

  // mobile autoplay
  React.useEffect(() => {
    if (!bannerData || bannerData.length === 0) return;
    const t = window.setInterval(() => {
      setMobileIndex((s) => (s + 1) % bannerData.length);
    }, 5000);
    return () => window.clearInterval(t);
  }, [bannerData]);

  // simple touch handlers for swipe on mobile
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 50; // px
    if (dx > threshold) nextMobile();
    else if (dx < -threshold) prevMobile();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) {
    return <div className="h-[460px] w-full bg-gray-200" />;
  }

  if (!loading && bannerData.length === 0) {
    return (
      <section className="flex h-[calc(100svh-105px)] w-full items-center justify-center bg-[#FCEFF3] px-4 text-center">
        <p className="text-2xl font-bold text-[#6C4735]">
          banner belum tersedia
        </p>
      </section>
    );
  }

  const prevMobile = () => {
    setMobileIndex((s) => (s - 1 + bannerData.length) % bannerData.length);
  };

  const nextMobile = () => {
    setMobileIndex((s) => (s + 1) % bannerData.length);
  };

  return (
    <>
      {/* Desktop carousel (unchanged) - wrapped so it hides on mobile */}
      <div className="hidden md:block">
        <Carousel
          className={`relative mx-auto ${heroHeightClass} w-full max-w-full`}
          opts={{ loop: true }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-0">
            {bannerData.map((item) => (
              <CarouselItem key={item.id} className={`${heroHeightClass} pl-0`}>
                <div className="relative h-full w-full">
                  <Card className="h-full rounded-none border-0 py-0 shadow-none">
                    <CardContent className="flex h-full items-center justify-center p-0">
                      <div className="relative h-full w-full">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(108,71,53,0.85)_0%,rgba(108,71,53,0.5)_50%,rgba(0,0,0,0)_100%)]" />
                        <div className="absolute inset-0 flex items-center justify-start px-6 py-6 sm:px-8 sm:py-8 md:py-12 md:pr-8 md:pl-[120px]">
                          <div className="relative z-10 max-w-full text-left font-sans md:max-w-[560px]">
                            <div className="banner-text-group translate-x-[0.1cm]">
                              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FACBD8] px-4 py-1.5 text-sm font-semibold text-[#6C4735]">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 flex-shrink-0"
                                >
                                  <path
                                    d="M12 2.5l1.902 4.357 4.812.7-3.478 3.135.82 4.79L12 14.77l-4.056 2.712.82-4.79L5.286 7.557l4.812-.7L12 2.5z"
                                    fill="#6C4735"
                                  />
                                </svg>
                                <span>{item.label}</span>
                              </div>
                              <h2 className="text-3xl leading-[1.15] font-bold text-white sm:text-5xl md:text-[4.2rem]">
                                {item.title}
                              </h2>
                              <p className="mt-4 text-base leading-relaxed font-semibold text-[#FACBD8] sm:text-lg md:text-xl">
                                {item.desc}
                              </p>
                              <p className="mt-3 text-sm leading-relaxed text-white/95 sm:text-base md:text-lg">
                                {item.extraText}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 z-30 h-12 w-12 rounded-full border-0 bg-white/25 text-white shadow-none backdrop-blur-sm transition-none hover:bg-white/25 hover:shadow-none focus:bg-white/25 focus:shadow-none focus:ring-0 focus:outline-none active:bg-white/25 active:shadow-none" />
          <CarouselNext className="right-4 z-30 h-12 w-12 rounded-full border-0 bg-white/25 text-white shadow-none backdrop-blur-sm transition-none hover:bg-white/25 hover:shadow-none focus:bg-white/25 focus:shadow-none focus:ring-0 focus:outline-none active:bg-white/25 active:shadow-none" />
          <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
            {bannerData.map((_, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to banner ${index + 1}`}
                  onClick={() => api?.scrollTo(index)}
                  className={[
                    "transition-all duration-300",
                    isActive
                      ? "h-2.5 w-7 rounded-full bg-white/95 shadow-sm"
                      : "h-2.5 w-2.5 rounded-full bg-white/55",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </Carousel>
      </div>

      {/* Mobile-only block (edit here): smaller badge/text, no arrows, swipe + autoplay */}
      <div className="md:hidden">
        <div
          className={`relative mx-auto ${heroHeightClass} w-full max-w-full overflow-hidden bg-gray-100`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {bannerData.length > 0 && (
            <div className="relative h-full w-full">
              <Image
                src={bannerData[mobileIndex].image}
                alt={bannerData[mobileIndex].title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.45)_100%)]" />
              <div className="absolute inset-0 z-10 flex items-center justify-start px-4 text-left">
                <div className="max-w-[88%]">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FACBD8] px-4 py-1.5 text-xs font-semibold text-[#6C4735]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 flex-shrink-0"
                    >
                      <path
                        d="M12 2.5l1.902 4.357 4.812.7-3.478 3.135.82 4.79L12 14.77l-4.056 2.712.82-4.79L5.286 7.557l4.812-.7L12 2.5z"
                        fill="#6C4735"
                      />
                    </svg>
                    <span className="text-xs leading-none">
                      {bannerData[mobileIndex].label}
                    </span>
                  </div>
                  <h3 className="text-3xl leading-[1.05] font-bold text-white sm:text-5xl">
                    {bannerData[mobileIndex].title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed font-semibold text-[#FACBD8] sm:text-lg">
                    {bannerData[mobileIndex].desc}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/95 sm:text-lg">
                    {bannerData[mobileIndex].extraText}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {bannerData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMobileIndex(idx)}
                    aria-label={`Go to mobile banner ${idx + 1}`}
                    className={
                      idx === mobileIndex
                        ? "h-2.5 w-7 rounded-full bg-white/95 shadow-sm"
                        : "h-2.5 w-2.5 rounded-full bg-white/60"
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeBanner;