"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  products: "Products",
  variants: "Variants",
  orders: "Orders",
  customers: "Customers",
  categories: "Categories",
  reports: "Reports",
  content: "Content",
  widget: "Widgets",
  HomeBanner: "Banner",
  settings: "Settings",
  new: "New",
  create: "Create",
  edit: "Edit",
  view: "View",
  "google-analytics": "Google Analytics",
  "google-tag-manager": "Google Tag Manager",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Crumb = {
  label: string;
  href: string;
  isLast: boolean;
};

function isIdSegment(segment: string): boolean {
  return UUID_PATTERN.test(segment) || /^\d+$/.test(segment);
}

function formatSegmentLabel(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];

  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildAdminBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "admin") return [];

  if (segments.length === 1) {
    return [{ label: "Dashboard", href: "/admin", isLast: true }];
  }

  const crumbs: Crumb[] = [];
  const tail = segments.slice(1);

  for (let index = 0; index < tail.length; index += 1) {
    const segment = tail[index];
    const previous = tail[index - 1];
    const next = tail[index + 1];
    const href = `/${segments.slice(0, index + 2).join("/")}`;

    if (isIdSegment(segment)) {
      const actionSegment = tail.find((part) =>
        ["edit", "view", "create"].includes(part),
      );

      if (previous === "products") {
        crumbs.push({ label: "Edit", href, isLast: index === tail.length - 1 });
        continue;
      }

      if (actionSegment && index === tail.length - 1) {
        crumbs.push({
          label: formatSegmentLabel(actionSegment),
          href,
          isLast: true,
        });
        continue;
      }

      if (index === tail.length - 1) {
        crumbs.push({ label: "View", href, isLast: true });
      }
      continue;
    }

    if (
      (segment === "edit" || segment === "view" || segment === "create") &&
      next &&
      isIdSegment(next)
    ) {
      crumbs.push({
        label: formatSegmentLabel(segment),
        href,
        isLast: false,
      });
      continue;
    }

    crumbs.push({
      label: formatSegmentLabel(segment),
      href,
      isLast: index === tail.length - 1,
    });
  }

  if (crumbs.length === 0) {
    return [{ label: "Dashboard", href: "/admin", isLast: true }];
  }

  return crumbs.map((crumb, index) => ({
    ...crumb,
    isLast: index === crumbs.length - 1,
  }));
}

export default function AdminBreadcrumb() {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildAdminBreadcrumbs(pathname), [pathname]);

  if (crumbs.length === 1 && crumbs[0]?.href === "/admin") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              Dashboard
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb) => (
          <span key={crumb.href} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="font-medium text-foreground">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
