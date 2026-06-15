"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users,
  Drill,
  MonitorCog,
  Menu,
  X,
  BarChart3,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/auth/clear-session";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
};

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/products", icon: Package },
  { label: "Variants", href: "/admin/variants", icon: Package },
  { label: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { label: "Pelanggan", href: "/admin/customers", icon: Users, disabled: true },
  { label: "Kategori", href: "/admin/categories", icon: Tags, disabled: true },
  { label: "Laporan", href: "/admin/reports", icon: BarChart3, disabled: true },
  { label: "Widgets", href: "/admin/widget", icon: Drill, disabled: false },
  { label: "Articles", href: "/admin/articles", icon: Newspaper, disabled: false },
  { label: "Banner", href: "/admin/HomeBanner", icon: MonitorCog, disabled: true },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    disabled: true,
  },
];

const footerNav: NavItem[] = [
  { label: "View Store", href: "/", icon: ExternalLink, external: true },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive =
    !item.disabled &&
    (item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname.startsWith(`${item.href}/`));

  const className = cn(
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "rounded-l-full bg-[var(--mamabear-dark-pink)] text-white"
      : "text-white/85 hover:bg-white/10 hover:text-white",
    item.disabled && "pointer-events-none cursor-not-allowed opacity-45"
  );

  const content = (
    <>
      <item.icon className="size-5 shrink-0" aria-hidden />
      <span>{item.label}</span>
    </>
  );

  if (item.disabled) {
    return (
      <span className={className} aria-disabled>
        {content}
      </span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await clearSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 rounded-md bg-[var(--mamabear-brown)] p-2 text-white shadow-lg md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--mamabear-brown)] text-white transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:w-64 md:translate-x-0"
        )}
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-bold"
              aria-hidden
            >
              MB
            </div>

            <div className="min-w-0">
              <p className="font-heading truncate text-sm font-semibold">
                mamabear
              </p>
              <p className="truncate text-xs text-white/75">Admin Panel</p>
            </div>
          </div>

          <button onClick={() => setOpen(false)} className="md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-4"
          aria-label="Main"
        >
          {mainNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 py-3">
          {footerNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-white/10 hover:text-red-200"
          >
            <LogOut className="size-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
