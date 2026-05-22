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
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/auth/clear-session";

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
  {
    label: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingCart,
    disabled: true,
  },
  { label: "Pelanggan", href: "/admin/customers", icon: Users, disabled: true },
  { label: "Kategori", href: "/admin/categories", icon: Tags, disabled: true },
  { label: "Laporan", href: "/admin/reports", icon: BarChart3, disabled: true },
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

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
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
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
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

  const handleLogout = async () => {
    await clearSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className="flex w-64 shrink-0 flex-col bg-[var(--mamabear-brown)] text-white"
      aria-label="Admin navigation"
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-bold"
          aria-hidden
        >
          MB
        </div>
        <div className="min-w-0">
          <p className="font-heading truncate text-sm leading-tight font-semibold">
            mamabear
          </p>
          <p className="truncate text-xs text-white/75">Admin Panel</p>
        </div>
      </div>

      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-4 pr-0"
        aria-label="Main"
      >
        {mainNav.map((item) => (
          <NavLink key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-white/10 py-3">
        {footerNav.map((item) => (
          <NavLink key={item.label} item={item} pathname={pathname} />
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-white/10 hover:text-red-200"
        >
          <LogOut className="size-5 shrink-0" aria-hidden />
          Logout
        </button>
      </div>
    </aside>
  );
}
