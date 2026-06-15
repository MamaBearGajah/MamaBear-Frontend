import { format, startOfMonth } from "date-fns";

import type { ReportDateRange } from "@/types";

/** Default report window: first day of current month through today. */
export function getDefaultReportDateRange(referenceDate = new Date()): ReportDateRange {
  return {
    from: format(startOfMonth(referenceDate), "yyyy-MM-dd"),
    to: format(referenceDate, "yyyy-MM-dd"),
  };
}

/** Upper bound for date inputs (today, local timezone). */
export function getMaxReportDate(referenceDate = new Date()): string {
  return format(referenceDate, "yyyy-MM-dd");
}

export function isValidReportDateRange(range: ReportDateRange): boolean {
  if (!range.from || !range.to) return false;
  return range.from <= range.to;
}
