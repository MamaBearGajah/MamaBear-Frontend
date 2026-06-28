"use client";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getAdminNavForRole, type AdminNavItem } from "@/config/admin-nav";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: AdminNavItem;
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
    item.disabled && "pointer-events-none cursor-not-allowed opacity-45",
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
  const { state, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const role = (state.user?.role ?? "admin") as UserRole;
  const mainNav = useMemo(() => getAdminNavForRole(role), [role]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout API error:", e);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-md bg-[var(--mamabear-brown)] p-2 text-white shadow-lg md:hidden"
        aria-label="Open admin menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--mamabear-brown)] text-white transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:static md:w-64 md:translate-x-0",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-bold"
              aria-hidden
            >
              MB
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-semibold">
                mamabear
              </p>
              <p className="truncate text-xs text-white/75">Admin Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="md:hidden"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-4"
          aria-label="Main"
        >
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 py-3">
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