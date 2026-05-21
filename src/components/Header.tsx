"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/product" },
  { label: "Consultation", href: "/consultation" },
  { label: "Articles", href: "/newsletter" },
  { label: "About Us", href: "/about" },
];

export default function Header() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F6CEDA] bg-white">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:h-20 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-base font-extrabold text-white">
            MB
          </span>

          <span className="leading-none">
            <span className="block font-heading text-2xl font-extrabold text-[var(--mamabear-brown)]">
              mama<span className="text-[var(--mamabear-dark-pink)]">bear</span>
            </span>
            <span className="block text-sm font-semibold text-[var(--mamabear-dark-pink)]">
              superfood for mamas 🌿
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-[var(--font-quicksand)] text-base font-semibold text-[var(--mamabear-brown)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[var(--mamabear-dark-pink)]"
            >
              {item.label}
            </Link>
          ))}

          <Link href="/auth/Login">Login</Link>
          <Link href="/auth/Register">Register</Link>
          <Link href="/auth/admin">Admin</Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/order/cart"
            aria-label="Cart"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--mamabear-brown)]"
          >
            <ShoppingCart className="h-6 w-6" />
          </Link>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F6F6] text-[var(--mamabear-brown)]"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-20 z-40 bg-black/20 lg:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 top-full z-50 w-full border-b border-[#F6CEDA] bg-[#FFF5F8] px-6 py-8 shadow-[0_20px_40px_rgba(108,71,53,0.12)] lg:hidden">
            <nav className="space-y-4 font-[var(--font-quicksand)] text-xl font-extrabold text-[var(--mamabear-brown)]">
              {navItems.map((item) => {
                const isActive = item.href === "/product";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "block rounded-3xl px-7 py-5 transition",
                      isActive
                        ? "bg-[var(--mamabear-light-pink)]"
                        : "hover:bg-white"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#F6CEDA] pt-6">
              <Link
                href="/auth/Login"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-lg font-extrabold text-white"
              >
                Login
              </Link>

              <Link
                href="/auth/Register"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center rounded-full border-2 border-[var(--mamabear-dark-pink)] bg-white text-lg font-extrabold text-[var(--mamabear-dark-pink)]"
              >
                Register
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}