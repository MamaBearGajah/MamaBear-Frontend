import {
  getReportsBundle,
  getSalesReport,
  getTopCategories,
  getTopProducts,
} from "@/lib/api/reports";
import { getFallbackReportsBundle } from "@/lib/admin/fallback-reports";
import type { ReportQueryParams, ReportDateRange } from "@/types";

type FetchReportsOptions = {
  cookieHeader?: string;
  limit?: number;
};

function withLimit(
  range: ReportDateRange,
  limit?: number,
): ReportQueryParams {
  return { ...range, limit: limit ?? 10 };
}

/** Fetch all report slices from BE; fall back to dev mock when BE is unavailable. */
export async function fetchReportsWithFallback(
  range: ReportDateRange,
  options?: FetchReportsOptions,
) {
  const params = withLimit(range, options?.limit);
  const requestOptions = options?.cookieHeader
    ? { cookieHeader: options.cookieHeader }
    : undefined;

  try {
    return await getReportsBundle(params, requestOptions);
  } catch {
    return getFallbackReportsBundle(range, params.limit);
  }
}

/** Fetch sales summary with dev fallback. */
export async function fetchSalesReportWithFallback(
  range: ReportDateRange,
  options?: FetchReportsOptions,
) {
  const params = withLimit(range, options?.limit);
  const requestOptions = options?.cookieHeader
    ? { cookieHeader: options.cookieHeader }
    : undefined;

  try {
    const res = await getSalesReport(params, requestOptions);
    if (res.data) return res.data;
  } catch {
    // Fall through to dev fallback below
  }

  return getFallbackReportsBundle(range).sales;
}

/** Fetch top products with dev fallback. */
export async function fetchTopProductsWithFallback(
  range: ReportDateRange,
  options?: FetchReportsOptions,
) {
  const params = withLimit(range, options?.limit);
  const requestOptions = options?.cookieHeader
    ? { cookieHeader: options.cookieHeader }
    : undefined;

  try {
    const res = await getTopProducts(params, requestOptions);
    if (Array.isArray(res.data)) return res.data;
  } catch {
    // Fall through to dev fallback below
  }

  return getFallbackReportsBundle(range, params.limit).topProducts;
}

/** Fetch top categories with dev fallback. */
export async function fetchTopCategoriesWithFallback(
  range: ReportDateRange,
  options?: FetchReportsOptions,
) {
  const params = withLimit(range, options?.limit);
  const requestOptions = options?.cookieHeader
    ? { cookieHeader: options.cookieHeader }
    : undefined;

  try {
    const res = await getTopCategories(params, requestOptions);
    if (Array.isArray(res.data)) return res.data;
  } catch {
    // Fall through to dev fallback below
  }

  return getFallbackReportsBundle(range, params.limit).topCategories;
}
