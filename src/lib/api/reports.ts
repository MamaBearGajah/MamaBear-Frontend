import type {
  ApiResponse,
  ReportQueryParams,
  SalesReportSummary,
  TopCategoryReport,
  TopProductReport,
} from "@/types";
import { adminOrdersApi } from "./adminOrders";
import { apiClient } from "./client";
import { mapOrdersFromApi } from "./map-order";
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

type OrderCategoryAggregate = {
  categoryId: string;
  name: string;
  revenue: number;
};

type RawRecord = Record<string, unknown>;

function isWithinRange(dateValue: string, params: ReportQueryParams): boolean {
  const date = dateValue.slice(0, 10);
  return date >= params.from && date <= params.to;
}

function getItemCategory(row: RawRecord): { id: string; name: string } | null {
  const product = row.product as RawRecord | undefined;
  const variant = row.variant as RawRecord | undefined;
  const variantProduct = variant?.product as RawRecord | undefined;
  const category =
    (product?.category as RawRecord | undefined) ??
    (variantProduct?.category as RawRecord | undefined);

  if (!category?.name) return null;

  return {
    id: String(category.id ?? category.slug ?? category.name),
    name: String(category.name),
  };
}

async function getOrdersReportSource(options?: ReportsRequestOptions) {
  const requestConfig = options?.cookieHeader
    ? { headers: { Cookie: options.cookieHeader } }
    : undefined;
  const { data } = await adminOrdersApi.getAll(requestConfig);
  const normalized = normalizeApiResponse<unknown>(data);
  const rawOrders = Array.isArray(normalized.data) ? normalized.data : [];

  return {
    rawOrders,
    orders: mapOrdersFromApi(rawOrders),
  };
}

export async function getSalesReport(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<SalesReportSummary>> {
  const { orders } = await getOrdersReportSource(options);
  const filteredOrders = orders.filter((order) =>
    isWithinRange(order.createdAt, params),
  );
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = filteredOrders.length;
  const avgOrderValue = orderCount > 0 ? Math.round(totalSales / orderCount) : 0;

  return {
    success: true,
    data: {
      from: params.from,
      to: params.to,
      totalSales,
      orderCount,
      avgOrderValue,
    },
  };
}

export async function getTopProducts(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<TopProductReport[]>> {
  const { orders } = await getOrdersReportSource(options);
  const bucket = new Map<string, TopProductReport>();

  for (const order of orders) {
    if (!isWithinRange(order.createdAt, params)) continue;

    for (const item of order.items) {
      const key = item.productId || item.name;
      const current = bucket.get(key) ?? {
        productId: key || `product-${bucket.size + 1}`,
        name: item.name || "Unknown product",
        qty: 0,
        revenue: 0,
      };

      current.qty += item.quantity;
      current.revenue += item.quantity * item.price;
      bucket.set(key, current);
    }
  }

  const products = [...bucket.values()]
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, params.limit ?? 10);

  return {
    success: true,
    data: products,
  };
}

export async function getTopCategories(
  params: ReportQueryParams,
  options?: ReportsRequestOptions,
): Promise<ApiResponse<TopCategoryReport[]>> {
  const { rawOrders, orders } = await getOrdersReportSource(options);
  const bucket = new Map<string, OrderCategoryAggregate>();

  for (let index = 0; index < orders.length; index += 1) {
    const order = orders[index];
    if (!isWithinRange(order.createdAt, params)) continue;

    const rawOrder = (rawOrders[index] ?? {}) as RawRecord;
    const rawItems = Array.isArray(rawOrder.items) ? rawOrder.items : [];

    for (let itemIndex = 0; itemIndex < order.items.length; itemIndex += 1) {
      const item = order.items[itemIndex];
      const rawItem = (rawItems[itemIndex] ?? {}) as RawRecord;
      const category = getItemCategory(rawItem);
      if (!category) continue;

      const key = category.id;
      const current = bucket.get(key) ?? {
        categoryId: key,
        name: category.name,
        revenue: 0,
      };

      current.revenue += item.quantity * item.price;
      bucket.set(key, current);
    }
  }

  const categories = [...bucket.values()]
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, params.limit ?? 10);

  return {
    success: true,
    data: categories,
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
