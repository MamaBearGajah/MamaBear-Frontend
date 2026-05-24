import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import ProductsPageClient from "@/components/admin/ProductsPageClient";
import { getCategoryList } from "@/lib/api/categories";
import { isMockProductsEnabled } from "@/lib/api/mock-data";
import { fetchProductVariantId2, getProductList } from "@/lib/api/products";
import { getServerSession } from "@/lib/auth/session";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";
import type { ProductListParams, ApiResponse } from "@/types";
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

  let mockMode = isMockProductsEnabled();
  const ProductId = "2e316469-8243-49a3-b242-1037d12dd710";

  const variantRes = await fetchProductVariantId2(ProductId);

  const { MOCK_CATEGORIES } = await import("@/lib/api/mock-data");
  const categoriesRes = { success: true, data: MOCK_CATEGORIES };

  const categoryMap = Object.fromEntries(
    (categoriesRes?.data || []).map((c) => [c.id, c.name])
  );

  const meta = variantRes?.meta ?? {
    page: 1,
    limit: 20,
    totalItems: variantRes?.data?.length ?? 0,
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
          variants={variantRes?.data}
          meta={meta}
          categories={categoriesRes.data}
          categoryMap={categoryMap}
          initialFilters={initialFilters}
          accessToken={accessToken}
          mockMode={mockMode}
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
