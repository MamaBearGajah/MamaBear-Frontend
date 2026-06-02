import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { getCategoryList } from "@/lib/api/categories";
import { getProductVariantById } from "@/lib/api/products";
import { getServerSession } from "@/lib/auth/session";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";
import type { ProductListParams } from "@/types";
import VariantsPageClient from "../../../components/admin/VariantsPageClient";

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
  const session = await getServerSession();
  const accessToken = session?.accessToken;

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

  const ProductId = "2e316469-8243-49a3-b242-1037d12dd710";

  const [variants, categoriesRes] = await Promise.all([
    getProductVariantById(ProductId),
    getCategoryList(),
  ]);

  const categoryMap = Object.fromEntries(
    (categoriesRes?.data || []).map((c) => [c.id, c.name])
  );

  const meta = {
    page: 1,
    limit: 20,
    totalItems: variants.length,
    totalPages: 1,
  };
  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Variants"
        userName={session?.user.name ?? "Admin"}
      />

      <Suspense fallback={<ProductsListFallback />}>
        <VariantsPageClient
          variants={variants}
          meta={meta}
          categories={categoriesRes.data}
          categoryMap={categoryMap}
          initialFilters={initialFilters}
          accessToken={accessToken}
        />
      </Suspense>
    </div>
  );
}

function ProductsListFallback() {
  return (
    <div className="space-y-4 py-4">
      <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
      <div className="bg-muted h-64 animate-pulse rounded-xl" />
    </div>
  );
}
