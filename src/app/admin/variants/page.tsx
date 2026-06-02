import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";
import type { Category, ProductListParams } from "@/types";
import VariantsPageClient from "../../../components/admin/VariantsPageClient";
import { variantApi } from "@/lib/api/variants";

export const metadata: Metadata = {
  title: "Variants",
};

interface VariantsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export default async function AdminVariantsPage({
  searchParams,
}: VariantsPageProps) {
  const params = await searchParams;

  const page = parseNumber(parseParam(params.page)) ?? 1;
  const limit = parseNumber(parseParam(params.limit)) ?? 20;
  const q = parseParam(params.q);
  const categoryId = parseParam(params.categoryId);
  const inStockParam = parseParam(params.inStock);
  const minPrice = parseNumber(parseParam(params.minPrice));
  const maxPrice = parseNumber(parseParam(params.maxPrice));

  const listParams: ProductListParams = {
    page,
    limit,
    q,
    categoryId,
    minPrice,
    maxPrice,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  if (inStockParam === "true") listParams.inStock = true;
  if (inStockParam === "false") listParams.inStock = false;

  const initialFilters: ProductFilters = {
    categoryId,
    inStock:
      inStockParam === "true"
        ? true
        : inStockParam === "false"
          ? false
          : undefined,
    minPrice,
    maxPrice,
  };

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data: variantRes } = await variantApi.getAll({
    headers: { Cookie: cookieHeader },
    params: listParams,
  });

  const { data: categoriesRes } = await variantApi.getCategory({
    headers: { Cookie: cookieHeader },
  });

  const categoryMap = Object.fromEntries(
    (categoriesRes?.data || []).map((c: Category) => [c.id, c.name])
  );

  const meta = variantRes?.meta ?? {
    page: 1,
    limit: 20,
    totalItems: variantRes?.data?.length ?? 0,
    totalPages: 1,
  };
  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader title="Variants" userName="Admin" />

      <Suspense fallback={<VariantsListFallback />}>
        <VariantsPageClient
          variants={variantRes?.data}
          meta={meta}
          categories={categoriesRes.data}
          categoryMap={categoryMap}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  );
}

function VariantsListFallback() {
  return (
    <div className="space-y-4 py-4">
      <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
      <div className="bg-muted h-64 animate-pulse rounded-xl" />
    </div>
  );
}
