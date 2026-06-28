import {
  BarChart3,
  Drill,
  FileText,
  LayoutDashboard,
  MonitorCog,
  Newspaper,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/types";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  disabled?: boolean;
};

/** Sidebar menu — filtered by role per API Contract RBAC. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "super_admin"],
  },
  {
    label: "Produk",
    href: "/admin/products",
    icon: Package,
    roles: ["admin", "super_admin"],
  },
  {
    label: "Variants",
    href: "/admin/variants",
    icon: Package,
    roles: ["admin", "super_admin"],
  },
  {
    label: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["admin", "super_admin"],
    disabled: true,
  },
  {
    label: "Pelanggan",
    href: "/admin/customers",
    icon: Users,
    roles: ["admin", "super_admin"],
    disabled: true,
  },
  {
    label: "Kategori",
    href: "/admin/categories",
    icon: Tags,
    roles: ["admin", "super_admin"],
    disabled: true,
  },
  {
    label: "Laporan",
    href: "/admin/reports",
    icon: BarChart3,
    roles: ["admin", "super_admin"],
  },
  {
    label: "Konten",
    href: "/admin/content",
    icon: FileText,
    roles: ["admin", "super_admin"],
    disabled: true,
  },
  {
    label: "Widgets",
    href: "/admin/widget",
    icon: Drill,
    roles: ["super_admin"],
  },
  {
    label: "Banner",
    href: "/admin/HomeBanner",
    icon: MonitorCog,
    roles: ["super_admin"],
    disabled: true,
  },
  {
    label: "Article",
    href: "/admin/articles",
    icon: Newspaper,
    roles: ["admin", "super_admin"],
    disabled: false,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["super_admin"],
    disabled: true,
  },
];

export const SUPER_ADMIN_ROUTE_PREFIXES = [
  "/admin/widget",
  "/admin/HomeBanner",
  "/admin/settings",
] as const;

export function getAdminNavForRole(role: UserRole): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function isSuperAdminRoute(pathname: string): boolean {
  return SUPER_ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isSuperAdminRole(role: UserRole | undefined): boolean {
  return role === "super_admin";
}
