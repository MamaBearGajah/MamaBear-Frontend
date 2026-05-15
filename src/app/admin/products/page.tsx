import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import ProductsPageClient from "@/components/admin/ProductsPageClient";
import { getCategoryList } from "@/lib/api/categories";
import { isMockProductsEnabled } from "@/lib/api/mock-data";
import { getProductList } from "@/lib/api/products";
import { getServerSession } from "@/lib/auth/session";
import type { ProductFilters } from "@/components/admin/ProductFilterDialog";
import type { ProductListParams } from "@/types";

export const metadata: Metadata = {
  title: "Products",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
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
      inStockParam === "true" ? true : inStockParam === "false" ? false : undefined,
    minPrice,
    maxPrice,
  };

  const [productsRes, categoriesRes] = await Promise.all([
    getProductList(listParams, accessToken),
    getCategoryList(accessToken),
  ]);

  const categoryMap = Object.fromEntries(
    categoriesRes.data.map((c) => [c.id, c.name]),
  );

  const meta = productsRes.meta ?? {
    page: 1,
    limit: 20,
    totalItems: productsRes.data.length,
    totalPages: 1,
  };

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Products"
        userName={session?.user.name ?? "Admin"}
      />

      <Suspense fallback={<ProductsListFallback />}>
        <ProductsPageClient
          products={productsRes.data}
          meta={meta}
          categories={categoriesRes.data}
          categoryMap={categoryMap}
          initialFilters={initialFilters}
          accessToken={accessToken}
          mockMode={isMockProductsEnabled()}
        />
      </Suspense>
    </div>
  );
}

function ProductsListFallback() {
  return (
    <div className="space-y-4 py-4">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
