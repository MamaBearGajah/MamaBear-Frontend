import { getFallbackReportsBundle } from "@/lib/admin/fallback-reports";
import { getReportsBundle, type ReportsBundle } from "@/lib/api/reports";
import type { ReportDateRange } from "@/types";

export async function loadReportsBundle(
  range: ReportDateRange,
  limit = 10,
): Promise<{ data: ReportsBundle; usingDemoData: boolean }> {
  try {
    const data = await getReportsBundle({ ...range, limit });
    return { data, usingDemoData: false };
  } catch {
    return {
      data: getFallbackReportsBundle(range, limit),
      usingDemoData: true,
    };
  }
}
