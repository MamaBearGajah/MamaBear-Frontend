"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Heart, Settings, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
// Pastikan path import ini sesuai dengan lokasi kamu menyimpan ProfileDropdown
import ProfileDropdown from "@/components/layout/ProfileDropdown"; 
import { useCart } from "@/hooks/useCart";

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
        isActive ? "bg-dark-pink text-white" : "text-brown hover:text-dark-pink",
        size === "sm" && !isActive && "hover:bg-light-pink/60"
      )}
    >
      {label}
    </Link>
  );
}

function CartButton({ href, className }: { href: string; className?: string }) {
  const { itemCount } = useCart();
  return (
    <Link href={href} aria-label="Cart" className={className}>
      <div className="relative">
        <ShoppingCart className="size-5" strokeWidth={1.75} />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-dark-pink text-[10px] font-bold text-white">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const { state, logout } = useAuth();
  const { user, isAuthenticated, isLoading } = state;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const firstName = user?.name?.split(" ")[0];

  
  // Asumsi state.user memiliki properti name dan email.
  // Jika auth kamu belum menyimpan data user, kita beri nilai fallback sementara.
  const currentUser = state.user || {
    name: "Member MamaBear",
    email: "member@mamabear.co.id"
  };

  return (
    <div className="border-border/60 border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-3 px-[2cm] py-3 md:gap-4 md:py-3.5">
        {/* Logo */}
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

        {/* Desktop nav links */}
        <nav className="ml-[3cm] hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
          ))}
        </nav>

        {/* Search bar */}
        <div className="order-3 w-full min-w-0 md:order-none md:max-w-xl md:flex-1 lg:max-w-2xl">
          <SearchBar />
        </div>

        <CartButton href="/cart" className="order-4 ml-auto md:order-none" />

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {!isLoading && (
            <>
              {isAuthenticated && !isAdmin && (
                <>
                  {/* Nama user — klik ke profile */}
                  <Link href="/account/profile" className="hidden sm:inline text-sm font-medium text-brown hover:text-dark-pink transition-colors">
                    Hi, {firstName}
                  </Link>

                  {/* Wishlist */}
                  <Link
                    href="/wishlist"
                    aria-label="Wishlist"
                    className="text-brown hover:bg-light-pink/60 hover:text-dark-pink rounded-full p-2 transition-colors"
                  >
                    <Heart className="size-5" strokeWidth={1.75} />
                  </Link>

                  {/* Cart dengan badge */}
                  <CartButton
                    href="/cart"
                    className="text-brown hover:bg-light-pink/60 hover:text-dark-pink rounded-full p-2 transition-colors"
                  />

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="bg-dark-pink hover:bg-dark-pink/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}

              {isAuthenticated && isAdmin && (
                <>
                  <ProfileDropdown user={currentUser} onLogout={logout} />
                  {/* <Link href="/account/profile" className="hidden sm:inline text-sm font-medium text-brown hover:text-dark-pink transition-colors">
                    Hi, {firstName}
                  </Link> */}
                  <Link
                    href="/admin"
                    className="border-brown/30 text-brown hover:bg-light-pink/40 inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <Settings className="size-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-dark-pink hover:bg-dark-pink/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/register"
                    className="border border-dark-pink text-dark-pink hover:bg-light-pink/40 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="bg-dark-pink hover:bg-dark-pink/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    <User className="size-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </>
              )}
            </>
          )}
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
      <MobileHeaderInline />
    </>
  );
}

function MobileHeaderInline() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, logout } = useAuth();
  const { user, isAuthenticated, isLoading } = state;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const firstName = user?.name?.split(" ")[0];

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

          {isAuthenticated && isAdmin && (
            <>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              >
                <Heart className="size-4" strokeWidth={1.75} />
              </Link>
              <CartButton
                href="/cart"
                className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              />
            </>
          )}

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

              {isAuthenticated && (
                  <p className="px-4 py-1 text-xs text-brown/60">
                      <Link
                        href="/account/profile"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FACBD8] hover:bg-[#D5557E]/10 px-4 text-sm font-semibold text-[#6C4735] transition hover:opacity-90 min-w-[100px]"
                      >
                        Hi, {firstName} 👋
                    </Link>
                    <br></br>
                      {/* <CartButton
                        href="/cart"
                        className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                      />
                      <Link
                        href="/wishlist"
                        aria-label="Wishlist"
                        className="text-brown hover:bg-light-pink/60 hover:text-dark-pink inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                      >
                        <Heart className="size-4" strokeWidth={1.75} />
                      </Link> */}
                  </p>
                  
                  
                )}

            <div className="my-2 h-px bg-[#D5557E]/30" />

            {!isLoading && (
              <>



                <div className="flex gap-2 mt-2">
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-[#D5557E] bg-white px-4 text-sm font-semibold text-[#D5557E] transition hover:bg-[#D5557E]/10"
                        >
                          <Settings className="size-4" />
                          <span>Admin</span>
                        </Link>
                      )}
                      <button
                        onClick={() => { setMenuOpen(false); logout(); }}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#D5557E] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        <LogOut className="size-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-[#D5557E] bg-white px-4 text-sm font-semibold text-[#D5557E] transition hover:bg-[#D5557E]/10"
                      >
                        Register
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#D5557E] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        <User className="size-4" />
                        <span>Login</span>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}