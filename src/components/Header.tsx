"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingCart, UserRound } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Products" },
    { href: "/consultation", label: "Consultation" },
    { href: "/about", label: "About Us" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="sticky top-0 z-50 font-[var(--font-quicksand)]">
      {/* Wrapper (total header area target 1536 x 92) - responsive: use full width with max-widths to avoid overflow */}
      <div className="h-[92px] w-full">
        {/* Brown Top Banner (target 1536 x 28) - centered content with horizontal padding */}
        <div className="flex h-[28px] w-full items-center justify-center bg-[#6C4735] px-[16px] py-[6px] text-[10px] font-medium tracking-wide text-white md:text-xs">
          <span className="mr-1">🐻</span>
          <span>
            Free shipping for orders above{" "}
            <span className="font-bold">Rp 200.000</span> | ASI Booster
            specialist since 2020 ✨
          </span>
        </div>

        {/* White header box spans full width; content stays centered inside */}
        <div className="h-[64px] w-full bg-white">
          <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-0">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/Logo Mamabear.png"
                alt="MamaBear logo"
                width={48}
                height={48}
                className="h-[48px] w-[48px] object-contain"
                priority
              />
            </Link>

            {/* Navigation (centered area) */}
            <nav className="mx-4 hidden h-[36px] w-[376.25px] flex-none items-center justify-center gap-[4px] md:flex">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${active ? "bg-[#D5557E] text-white shadow-sm" : "text-[#6C4735] hover:bg-[#FACBD8]/40"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex h-[36px] w-[291.46875px] flex-none items-center justify-end gap-2 lg:gap-3">
              <button className="text-[#6C4735] transition hover:text-[#D4A574]">
                <Search size={20} />
              </button>
              <button className="text-[#6C4735] transition hover:text-[#D4A574]">
                <Heart size={20} />
              </button>
              <button className="text-[#6C4735] transition hover:text-[#D4A574]">
                <ShoppingCart size={20} />
              </button>
              <Link
                href="/auth/Login"
                className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-[#D5557E] px-3.5 text-[13px] font-medium text-white transition hover:opacity-90"
              >
                <UserRound size={14} strokeWidth={2.1} />
                <span>Login</span>
              </Link>
              <Link
                href="/auth/Register"
                className="inline-flex h-[30px] items-center gap-1.5 rounded-full border-2 border-[#D5557E] bg-white px-3.5 text-[13px] font-medium text-[#D5557E] transition hover:bg-[#FACBD8]/20"
              >
                <UserRound size={14} strokeWidth={2.1} />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
