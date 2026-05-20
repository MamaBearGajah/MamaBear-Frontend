"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Heart, Settings, ShoppingCart, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/consultation", label: "Consultation" },
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
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full font-medium transition-colors",
        size === "sm"
          ? "px-3 py-1.5 text-xs"
          : "px-4 py-2 text-sm",
        isActive
          ? "bg-dark-pink text-white"
          : "text-brown hover:text-dark-pink",
        size === "sm" && !isActive && "hover:bg-light-pink/60",
      )}
    >
      {label}
    </Link>
  );
}

function NavbarContent() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border/60 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="container-main flex flex-wrap items-center gap-3 py-3 md:gap-4 md:py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-dark-pink text-sm font-bold text-white">
            MB
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-heading text-lg font-bold text-brown">
              mamabear
            </span>
            <span className="text-xs text-dark-pink">
              superfood for mamas 🌿
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              pathname={pathname}
            />
          ))}
        </nav>

        <div className="order-3 w-full min-w-0 md:order-none md:max-w-xl md:flex-1 lg:max-w-2xl">
          <SearchBar />
        </div>

        <nav className="order-4 flex w-full gap-1 overflow-x-auto pb-1 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              pathname={pathname}
              size="sm"
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="#"
            aria-label="Wishlist"
            className="rounded-full p-2 text-brown transition-colors hover:bg-light-pink/60 hover:text-dark-pink"
          >
            <Heart className="size-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="rounded-full p-2 text-brown transition-colors hover:bg-light-pink/60 hover:text-dark-pink"
          >
            <ShoppingCart className="size-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-dark-pink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dark-pink/90"
          >
            <User className="size-4" />
            <span className="hidden sm:inline">Login</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-brown/30 bg-white px-4 py-2 text-sm font-medium text-brown transition-colors hover:bg-light-pink/40"
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
    <Suspense fallback={<div className="h-[72px] border-b bg-white" />}>
      <NavbarContent />
    </Suspense>
  );
}
