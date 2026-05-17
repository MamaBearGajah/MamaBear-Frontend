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
const HomeBanner = ({ images }: { images?: string[] } = {}) => {
  const [api, setApi] = React.useState<any>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

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

  return (
    <Carousel
      className="relative mx-auto h-[520px] w-[1536px] max-w-full"
      opts={{ loop: true }}
      setApi={setApi}
    >
      <CarouselContent className="-ml-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="h-[520px] pl-0">
            <div className="h-full w-full">
              {/* TODO: backend will provide image URLs; pass them via `images` prop */}
              <Card className="h-full rounded-none border-0 py-0 shadow-none">
                <CardContent className="flex h-full items-center justify-center p-0">
                  {images && images[index] ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={images[index]}
                        alt={`HomeBanner ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#6C4735]/80 text-center">
                      <div className="mx-auto max-w-[720px] px-6 py-10 text-white">
                        <div className="mb-3 inline-block rounded-md bg-white/10 px-3 py-1 text-xs text-white">
                          IMAGE PLACEHOLDER
                        </div>
                        <div className="text-3xl font-semibold">
                          HomeBanner{index + 1}
                        </div>
                        <p className="mt-4 text-sm">
                          This area will display the hero image served by the
                          backend.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 z-30 h-10 w-10 bg-white/20 text-white shadow-sm backdrop-blur-sm" />
      <CarouselNext className="right-4 z-30 h-10 w-10 bg-white/20 text-white shadow-sm backdrop-blur-sm" />
      <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        {Array.from({ length: 3 }).map((_, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to HomeBanner ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={[
                "transition-all duration-300",
                isActive
                  ? "h-2.5 w-6 rounded-full bg-white/95 shadow-sm"
                  : "h-2.5 w-2.5 rounded-full bg-white/55",
              ].join(" ")}
            />
          );
        })}
      </div>
    </Carousel>
  );
};

export default HomeBanner;
