"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { isSuperAdminRoute, isSuperAdminRole } from "@/config/admin-nav";

export default function SuperAdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (state.isLoading || !state.user) return;
    if (!isSuperAdminRoute(pathname)) return;
    if (isSuperAdminRole(state.user.role)) return;

    router.replace("/admin");
  }, [pathname, router, state.isLoading, state.user]);

  if (state.isLoading) {
    return null;
  }

  if (
    state.user &&
    isSuperAdminRoute(pathname) &&
    !isSuperAdminRole(state.user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}
