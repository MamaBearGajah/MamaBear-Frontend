import { getFallbackReportsBundle } from "@/lib/admin/fallback-reports";
import { getDefaultReportDateRange } from "@/lib/admin/report-date-range";
import { getReportsBundle, type ReportsBundle } from "@/lib/api/reports";
import type { ReportDateRange } from "@/types";

export type ReportsPageInitialData = {
  initialRange: ReportDateRange;
  initialData: ReportsBundle;
  initialUsingDemoData: boolean;
};

type GetInitialReportsPageDataOptions = {
  cookieHeader?: string;
  limit?: number;
};

export async function getInitialReportsPageData(
  options?: GetInitialReportsPageDataOptions,
): Promise<ReportsPageInitialData> {
  const limit = options?.limit ?? 10;
  const initialRange = getDefaultReportDateRange();

  let initialData = getFallbackReportsBundle(initialRange, limit);
  let initialUsingDemoData = true;

  try {
    initialData = await getReportsBundle(
      { ...initialRange, limit },
      options?.cookieHeader ? { cookieHeader: options.cookieHeader } : undefined,
    );
    initialUsingDemoData = false;
  } catch {
    // Keep dev fallback when BE reports endpoints are unavailable.
  }

  return { initialRange, initialData, initialUsingDemoData };
}
