import {
  BarChart3,
  Drill,
  HelpCircle,
  LayoutDashboard,
  MessageCircle,
  MonitorCog,
  Newspaper,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Flower2,
  Tag,
  Users,
  UserCog,
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

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  // Core
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard, roles: ["admin", "super_admin"] },
  { label: "Orders",     href: "/admin/orders",    icon: ShoppingCart,    roles: ["admin", "super_admin"] },
  { label: "Customers",  href: "/admin/customers", icon: Users,           roles: ["admin", "super_admin"] },
  // Catalog
  { label: "Products",   href: "/admin/products",   icon: Package, roles: ["admin", "super_admin"] },
  { label: "Categories", href: "/admin/categories", icon: Tags,    roles: ["admin", "super_admin"] },
  { label: "Bundles",    href: "/admin/bundles",    icon: Flower2, roles: ["admin", "super_admin"] },
  // Marketing
  { label: "Voucher",    href: "/admin/vouchers",   icon: Tag,  roles: ["admin", "super_admin"] },
  { label: "Membership", href: "/admin/membership", icon: Star, roles: ["admin", "super_admin"] },
  // Content
  { label: "Artikel",    href: "/admin/articles",      icon: Newspaper,     roles: ["admin", "super_admin"] },
  { label: "FAQ",        href: "/admin/faq",           icon: HelpCircle,    roles: ["admin", "super_admin"] },
  { label: "Konsultasi", href: "/admin/consultations", icon: MessageCircle, roles: ["admin", "super_admin"] },
  { label: "Promosi",    href: "/admin/promotions",    icon: Tag,           roles: ["admin", "super_admin"] },
  { label: "Banner",     href: "/admin/HomeBanner",    icon: MonitorCog,    roles: ["admin", "super_admin"] },
  // Analytics — FIX: Reports dibatasi super_admin (berisi data keuangan sensitif)
  { label: "Reports",    href: "/admin/reports", icon: BarChart3, roles: ["super_admin"] },
  // Dev
  { label: "Widgets",    href: "/admin/widget",   icon: Drill,    roles: ["admin", "super_admin"] },
  // Super Admin only
  { label: "Admin Users", href: "/admin/users",    icon: UserCog,  roles: ["super_admin"] },
  { label: "Settings",    href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
];

// FIX: tambah /admin/reports ke SUPER_ADMIN_ROUTE_PREFIXES
// agar SuperAdminRouteGuard memblok akses dari role admin biasa
export const SUPER_ADMIN_ROUTE_PREFIXES = [
  "/admin/settings",
  "/admin/users",
  "/admin/reports",
] as const;

export function getAdminNavForRole(role: UserRole): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function isSuperAdminRoute(pathname: string): boolean {
  return SUPER_ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isSuperAdminRole(role: UserRole | undefined): boolean {
  return role === "super_admin";
}