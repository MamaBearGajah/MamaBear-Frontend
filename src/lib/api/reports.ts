import type {
  ApiResponse,
  ReportQueryParams,
  SalesReportSummary,
  TopCategoryReport,
  TopProductReport,
} from "@/types";
import { apiClient } from "./client";

type ReportsRequestOptions = {
  cookieHeader?: string;
};

function reportsRequestConfig(options?: ReportsRequestOptions) {
  if (!options?.cookieHeader) return {};
  return { headers: { Cookie: options.cookieHeader } };
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * BE contract (src/reports/*):
 *   GET /reports/sales?startDate&endDate&groupBy
 *     -> { totalSales, orderCount, avgOrderValue, groupBy, data: [{period, revenue, orders}] }
 *   GET /reports/top-products?startDate&endDate&limit
 *     -> [{ product: {id, name, slug, sku, mainImage} | null, totalSold, totalRevenue }]
 *   GET /reports/top-categories?startDate&endDate&limit
 *     -> [{ category: {id, name, slug} | null, totalSold, totalRevenue }]
 *
 * All three are only computed from orders with paymentStatus === 'paid' on the BE side.
 * The whole response is wrapped once by TransformInterceptor as { success, data }.
 */

function mapSalesReport(
  raw: unknown,
  params: ReportQueryParams,
): SalesReportSummary {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    // BE doesn't echo the requested range back, so we keep it from the request params.
    from: params.from,
    to: params.to,
    totalSales: toNumber(row.totalSales),
    orderCount: toNumber(row.orderCount),
    avgOrderValue: toNumber(row.avgOrderValue),
  };
}

function mapTopProduct(row: unknown, index: number): TopProductReport {
  const item = (row ?? {}) as Record<string, unknown>;
  const product = (item.product ?? null) as Record<string, unknown> | null;

  return {
    productId: String(product?.id ?? `unknown-product-${index + 1}`),
    name: String(product?.name ?? "Produk tidak ditemukan"),
    qty: toNumber(item.totalSold),
    revenue: toNumber(item.totalRevenue),
  };
}

function mapTopCategory(row: unknown, index: number): TopCategoryReport {
  const item = (row ?? {}) as Record<string, unknown>;
  const category = (item.category ?? null) as Record<string, unknown> | null;

  return {
    categoryId: String(category?.id ?? `unknown-category-${index + 1}`),
    name: String(category?.name ?? "Kategori tidak ditemukan"),
    revenue: toNumber(item.totalRevenue),
  };
}

async function fetchSalesReport(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<unknown> {
  const response = await apiClient.get("/reports/sales", {
    ...reportsRequestConfig(options),
    params: {
      startDate: params.from,
      endDate: params.to,
    },
  });

  // IMPORTANT: don't run this through normalizeApiResponse(). SalesReportDto
  // itself has a `data` field (the day/week/month breakdown array), so the
  // generic "nested list payload" heuristic in normalizeApiResponse would
  // mistake that breakdown array for the whole payload and silently drop
  // totalSales/orderCount/avgOrderValue. Unwrap the envelope manually instead.
  return response.data?.data ?? {};
}

async function fetchTopProducts(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<unknown[]> {
  const response = await apiClient.get("/reports/top-products", {
    ...reportsRequestConfig(options),
    params: {
      startDate: params.from,
      endDate: params.to,
      limit: params.limit ?? 10,
    },
  });

  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
}

async function fetchTopCategories(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<unknown[]> {
  const response = await apiClient.get("/reports/top-categories", {
    ...reportsRequestConfig(options),
    params: {
      startDate: params.from,
      endDate: params.to,
      limit: params.limit ?? 10,
    },
  });

  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
}

export async function getSalesReport(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<SalesReportSummary>> {
  const raw = await fetchSalesReport(params, options);
  return {
    success: true,
    data: mapSalesReport(raw, params),
  };
}

export async function getTopProducts(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<TopProductReport[]>> {
  const rawItems = await fetchTopProducts(params, options);
  return {
    success: true,
    data: rawItems.map((item, index) => mapTopProduct(item, index)),
  };
}

export async function getTopCategories(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<TopCategoryReport[]>> {
  const rawItems = await fetchTopCategories(params, options);
  return {
    success: true,
    data: rawItems.map((item, index) => mapTopCategory(item, index)),
  };
}

export type ReportsBundle = {
  sales: SalesReportSummary;
  topProducts: TopProductReport[];
  topCategories: TopCategoryReport[];
};

/** Parallel fetch for dashboard / reports pages. */
export async function getReportsBundle(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ReportsBundle> {
  const limitedParams = { ...params, limit: params.limit ?? 10 };
  const [salesRes, topProductsRes, topCategoriesRes] = await Promise.all([
    getSalesReport(params, options),
    getTopProducts(limitedParams, options),
    getTopCategories(limitedParams, options),
  ]);

  return {
    sales: salesRes.data,
    topProducts: topProductsRes.data ?? [],
    topCategories: topCategoriesRes.data ?? [],
  };
}