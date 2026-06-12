import type {
  ApiResponse,
  ReportQueryParams,
  SalesReportSummary,
  TopCategoryReport,
  TopProductReport,
} from "@/types";
import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

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

function mapSalesReport(raw: unknown, params: ReportQueryParams): SalesReportSummary {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    from: String(row.from ?? params.from),
    to: String(row.to ?? params.to),
    totalSales: toNumber(row.totalSales ?? row.total_sales),
    orderCount: toNumber(row.orderCount ?? row.order_count),
    avgOrderValue: toNumber(row.avgOrderValue ?? row.avg_order_value),
  };
}

function mapTopProduct(row: unknown): TopProductReport {
  const item = (row ?? {}) as Record<string, unknown>;
  return {
    productId: String(item.productId ?? item.product_id ?? item.id ?? ""),
    name: String(item.name ?? "Unknown product"),
    qty: toNumber(item.qty ?? item.quantity),
    revenue: toNumber(item.revenue),
  };
}

function mapTopCategory(row: unknown): TopCategoryReport {
  const item = (row ?? {}) as Record<string, unknown>;
  return {
    categoryId: String(item.categoryId ?? item.category_id ?? item.id ?? ""),
    name: String(item.name ?? "Unknown category"),
    revenue: toNumber(item.revenue),
  };
}

function mapTopProducts(raw: unknown): TopProductReport[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapTopProduct);
}

function mapTopCategories(raw: unknown): TopCategoryReport[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapTopCategory);
}

export async function getSalesReport(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<SalesReportSummary>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>("/reports/sales", {
    params: { from: params.from, to: params.to },
    ...reportsRequestConfig(options),
  });
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapSalesReport(normalized.data, params),
  };
}

export async function getTopProducts(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<TopProductReport[]>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(
    "/reports/top-products",
    {
      params: {
        from: params.from,
        to: params.to,
        limit: params.limit,
      },
      ...reportsRequestConfig(options),
    },
  );
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapTopProducts(normalized.data),
  };
}

export async function getTopCategories(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<TopCategoryReport[]>> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(
    "/reports/top-categories",
    {
      params: { from: params.from, to: params.to },
      ...reportsRequestConfig(options),
    },
  );
  const normalized = normalizeApiResponse<unknown>(data);
  return {
    ...normalized,
    data: mapTopCategories(normalized.data),
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
  const productParams = { ...params, limit: params.limit ?? 10 };
  const [salesRes, topProductsRes, topCategoriesRes] = await Promise.all([
    getSalesReport(params, options),
    getTopProducts(productParams, options),
    getTopCategories(params, options),
  ]);

  return {
    sales: salesRes.data,
    topProducts: topProductsRes.data ?? [],
    topCategories: topCategoriesRes.data ?? [],
  };
}
