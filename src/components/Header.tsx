"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Heart, ShoppingCart, UserRound, X } from "lucide-react";
import { useState, useEffect } from "react";

interface BannerMessage {
  text: string;
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<BannerMessage>({
    text: "Free shipping for orders above Rp 200.000 | ASI Booster specialist since 2020 ✨",
  });

  useEffect(() => {
    // TODO: Replace with API call when backend is ready
    // const fetchBannerMessage = async () => {
    //   try {
    //     const response = await fetch('/api/banner-message');
    //     const data = await response.json();
    //     setBannerMessage(data);
    //   } catch (error) {
    //     console.error('Failed to fetch banner message:', error);
    //   }
    // };
    // fetchBannerMessage();
    // For now, using hardcoded data above
  }, []);

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
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-text {
          animation: marquee 30s linear infinite;
        }
      `}</style>
      {/* Desktop Header */}
      <div className="hidden h-[92px] w-full md:block">
        {/* Brown Top Banner (desktop only) */}
        <div className="relative h-[28px] w-full overflow-hidden bg-[#6C4735] py-[6px] text-[10px] font-medium tracking-wide text-white md:text-xs">
          <div className="marquee-text flex items-center whitespace-nowrap">
            <span className="mx-2">🐻</span>
            <span>{bannerMessage.text}</span>
          </div>
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

      {/* Mobile Header */}
      <div className="w-full md:hidden">
        {/* Catatan mobile: bagian ini khusus layout smartphone supaya header lebih ringkas dan tidak overflow */}
        <div className="flex h-[64px] w-full items-center justify-between bg-white px-3 sm:px-4">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Logo Mamabear.png"
              alt="MamaBear logo"
              width={38}
              height={38}
              className="h-9 w-9 object-contain"
              priority
            />
          </Link>

          {/* Right: Search, Cart, and Menu Icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6C4735] transition hover:bg-[#FACBD8]/25"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              aria-label="Shopping cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6C4735] transition hover:bg-[#FACBD8]/25"
            >
              <ShoppingCart size={20} />
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6C4735] transition hover:bg-[#FACBD8]/25"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-[64px] right-0 left-0 z-40 bg-white shadow-lg">
            <div className="flex flex-col gap-0 px-3 py-3 sm:px-4">
              {/* Navigation Items */}
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-full px-4 py-2.5 text-sm font-medium text-[#6C4735] transition ${
                      active
                        ? "bg-[#FACBD8] text-[#6C4735]"
                        : "hover:bg-[#FACBD8]/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-2 h-px bg-[#D5557E]/30" />

              {/* Login and Register Buttons */}
              <div className="flex gap-2">
                <Link
                  href="/auth/Login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#D5557E] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <UserRound size={14} strokeWidth={2.1} />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/Register"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-[#D5557E] bg-white px-4 text-sm font-semibold text-[#D5557E] transition hover:bg-[#D5557E]/10"
                >
                  <UserRound size={14} strokeWidth={2.1} />
                  <span>Register</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
