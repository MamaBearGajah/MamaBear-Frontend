"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Heart, Settings, ShoppingCart, User, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/consultation", label: "Consultation" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About Us" },
] as const;

function NavLink({
  href,
  label,
  pathname,
  size = "md",
}: {
  href: string;
  label: string;
  pathname: string;
  size?: "md" | "sm";
}) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full font-medium transition-colors",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        isActive
          ? "bg-dark-pink text-white"
          : "text-brown hover:text-dark-pink",
        size === "sm" && !isActive && "hover:bg-light-pink/60"
      )}
    >
      {label}
    </Link>
  );
}

function NavbarContent() {
  const pathname = usePathname();

  return (
    <div className="border-border/60 border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-3 px-[2cm] py-3 md:gap-4 md:py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/Logo Mamabear.png"
            alt="MamaBear"
            width={164}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="ml-[3cm] hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
          ))}
        </nav>

        <div className="order-3 w-full min-w-0 md:order-none md:max-w-xl md:flex-1 lg:max-w-2xl">
          <SearchBar />
        </div>

        <nav className="order-4 hidden w-full gap-1 overflow-x-auto pb-1 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} size="sm" />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="#"
            aria-label="Wishlist"
            className="text-brown hover:bg-light-pink/60 hover:text-dark-pink rounded-full p-2 transition-colors"
          >
            <Heart className="size-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-brown hover:bg-light-pink/60 hover:text-dark-pink rounded-full p-2 transition-colors"
          >
            <ShoppingCart className="size-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/login"
            className="bg-dark-pink hover:bg-dark-pink/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <User className="size-4" />
            <span className="hidden sm:inline">Login</span>
          </Link>
          <Link
            href="/admin"
            className="border-brown/30 text-brown hover:bg-light-pink/40 inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-sm font-medium transition-colors"
          >
            <Settings className="size-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ShopNavbar() {
  return (
    <>
      <div className="hidden md:block">
        <Suspense fallback={<div className="h-[72px] border-b bg-white" />}>
          <NavbarContent />
        </Suspense>
      </div>

      {/* MOBILE-ONLY: replicate original mobile header UI here so mobile layout matches previous Header.tsx */}
      <MobileHeaderInline />
    </>
  );
}

function MobileHeaderInline() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full md:hidden">
      <div className="w-full border-b bg-white px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Logo Mamabear.png"
              alt="MamaBear"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
          </Link>

          <div className="min-w-0 flex-1">
            <SearchBar />
          </div>

          <Link
            href="#"
            aria-label="Wishlist"
            className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <Heart className="size-4" strokeWidth={1.75} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <ShoppingCart className="size-4" strokeWidth={1.75} />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-0 left-0 z-40 bg-white shadow-lg">
          <div className="flex flex-col gap-0 px-3 py-3 sm:px-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-[#6C4735] transition hover:bg-[#FACBD8]/40"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-[#D5557E]/30" />

            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#D5557E] px-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <User className="size-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-[#D5557E] bg-white px-4 text-sm font-semibold text-[#D5557E] transition hover:bg-[#D5557E]/10"
              >
                <Settings className="size-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
