"use client";

import {
  Gift,
  Package,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const benefits = [
  {
    icon: Gift,
    title: "Special Gift Cards",
    description: "Perfect for new moms",
  },
  {
    icon: Package,
    title: "Bundle Packages",
    description: "Save more with bundles",
  },
  {
    icon: ShoppingBag,
    title: "Easy Shopping",
    description: "Simple checkout process",
  },
  {
    icon: MessageCircle,
    title: "Free Consultation",
    description: "Talk to our experts",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Ships across Indonesia",
  },
];

export default function SubscribeSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="w-full bg-[#FEF2F5] py-10 md:py-14">
      {/* Desktop layout (keep unchanged) */}
      <div className="hidden w-full px-0 md:block">
        <div className="mb-28 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-white">
                  <Icon
                    size={28}
                    strokeWidth={1.8}
                    className="text-[#D5557E]"
                  />
                </div>
                <h3 className="mt-3 text-[16px] font-bold text-[#6C4735]">
                  {benefit.title}
                </h3>
                <p className="mt-1 max-w-[220px] text-[12px] leading-[1.3] whitespace-normal text-[#8D6B5B] md:whitespace-nowrap">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto flex max-w-[1280px] flex-col items-center px-3 pt-10 pb-0 text-center md:px-[3cm] md:pt-12 md:pb-0">
          <h2 className="max-w-[760px] text-[30px] leading-[1.05] font-black text-[#6C4735] md:text-[42px]">
            Subscribe to Our Newsletter to
            <br />
            Get{" "}
            <span className="text-[#D5557E]">Updates on Our Latest Offers</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[720px] text-[16px] leading-[1.6] text-[#8D6B5B] md:max-w-none md:text-[18px] md:leading-8 md:whitespace-nowrap">
            Get <span className="font-bold text-[#D5557E]">25% off</span> on
            your first order just by subscribing to our newsletter
          </p>

          <form
            className="mx-auto mt-10 flex w-full max-w-[660px] flex-col gap-3 px-3 md:flex-row md:items-center md:justify-center md:gap-2 md:px-0"
            suppressHydrationWarning
          >
            <label className="sr-only" htmlFor="subscribe-email">
              Email Address
            </label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="Enter Email Address"
              className="h-[58px] w-full min-w-0 flex-1 rounded-full border-2 border-[#F2D9E0] bg-white px-6 text-[15px] text-[#6C4735] outline-none placeholder:text-[#B49A90] focus:border-[#D5557E] md:h-[64px] md:w-auto md:max-w-[1200px]"
            />
            <button
              type="submit"
              className="inline-flex h-[58px] shrink-0 items-center justify-center rounded-full bg-[#D5557E] px-8 text-[15px] font-semibold whitespace-nowrap text-white transition hover:opacity-90 md:h-[64px] md:min-w-[150px]"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-[12px] text-[#8D6B5B] md:text-[13px]">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[#8D6B5B]"
              strokeWidth={2.2}
            />
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* MOBILE-ONLY: stacked benefits + subscribe form with horizontal padding */}
      <div className="w-full px-0 md:hidden">
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-white">
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    className="text-[#D5557E]"
                  />
                </div>
                <h3 className="mt-3 text-[14px] font-bold text-[#6C4735]">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-[12px] text-[#8D6B5B]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 px-4 text-center">
          <h2 className="mx-auto max-w-[320px] text-[34px] leading-[1.02] font-black text-[#6C4735]">
            <span className="block">Subscribe to Our</span>
            <span className="block">Newsletter to Get</span>
            <span className="block text-[#D5557E]">
              Updates on Our Latest Offers
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14px] leading-[1.6] text-[#8D6B5B]">
            Get <span className="font-bold text-[#D5557E]">25% off</span> on
            your first order just by subscribing to our newsletter
          </p>

          <form
            className="mx-auto mt-6 flex w-full max-w-[360px] flex-col gap-4 px-3"
            suppressHydrationWarning
          >
            <label className="sr-only" htmlFor="subscribe-email-mobile">
              Email Address
            </label>
            <input
              id="subscribe-email-mobile"
              type="email"
              placeholder="Enter Email Address"
              style={{ minHeight: "76px" }}
              className="box-border w-full min-w-0 flex-1 rounded-full border-[3px] border-[#F2D9E0] bg-white px-7 py-4 text-[18px] leading-none font-medium text-[#6C4735] shadow-[0_10px_30px_rgba(213,85,126,0.08)] outline-none placeholder:text-[#B49A90] focus:border-[#D5557E]"
            />
            <button
              type="submit"
              style={{ minHeight: "76px" }}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#D5557E] px-8 text-[18px] leading-none font-semibold text-white transition hover:opacity-90"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-[12px] text-[#8D6B5B]">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[#8D6B5B]"
              strokeWidth={2.2}
            />
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
