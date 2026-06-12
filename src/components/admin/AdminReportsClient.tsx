"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import DashboardStatCards from "@/components/admin/DashboardStatCards";
import DateRangePicker from "@/components/admin/DateRangePicker";
import TopCategoriesTable from "@/components/admin/TopCategoriesTable";
import TopProductsTable from "@/components/admin/TopProductsTable";
import { loadReportsBundle } from "@/lib/admin/load-reports-bundle";
import { isValidReportDateRange } from "@/lib/admin/report-date-range";
import type { ReportsBundle } from "@/lib/api/reports";
import type { ReportDateRange } from "@/types";

type AdminReportsClientProps = {
  initialRange: ReportDateRange;
  initialData: ReportsBundle;
  initialUsingDemoData: boolean;
};

function formatRangeLabel(range: ReportDateRange): string {
  try {
    const from = format(parseISO(range.from), "d MMM yyyy", { locale: localeId });
    const to = format(parseISO(range.to), "d MMM yyyy", { locale: localeId });
    return `${from} – ${to}`;
  } catch {
    return `${range.from} – ${range.to}`;
  }
}

export default function AdminReportsClient({
  initialRange,
  initialData,
  initialUsingDemoData,
}: AdminReportsClientProps) {
  const [range, setRange] = useState<ReportDateRange>(initialRange);
  const [bundle, setBundle] = useState<ReportsBundle>(initialData);
  const [usingDemoData, setUsingDemoData] = useState(initialUsingDemoData);
  const [isPending, startTransition] = useTransition();

  const rangeLabel = useMemo(() => formatRangeLabel(range), [range]);
  const topCategory = bundle.topCategories[0];

  const handleRefresh = useCallback(() => {
    if (!isValidReportDateRange(range)) {
      toast.error("Periode laporan tidak valid.");
      return;
    }

    startTransition(async () => {
      const result = await loadReportsBundle(range, 10);
      setBundle(result.data);
      setUsingDemoData(result.usingDemoData);

      if (result.usingDemoData) {
        toast.info("Backend belum siap — menampilkan data demo.");
      } else {
        toast.success("Laporan diperbarui.");
      }
    });
  }, [range]);

  return (
    <div className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 rounded-[32px] border border-[#F1E9EB] bg-white/80 p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Sales Reports
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
              Laporan Penjualan
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{rangeLabel}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <DateRangePicker
              value={range}
              onChange={setRange}
              disabled={isPending}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isPending || !isValidReportDateRange(range)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#E9D9DF] bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-[#F7F0F2] disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <RefreshCw className="h-4 w-4" aria-hidden />
                )}
                Refresh
              </button>
              <button
                type="button"
                disabled
                title="Export coming soon"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#E9D9DF] bg-white px-5 text-sm font-semibold text-muted-foreground opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden />
                Export
              </button>
            </div>
          </div>
        </header>

        {usingDemoData && (
          <div className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Menampilkan data demo — endpoint reports BE belum tersedia.
          </div>
        )}

        <DashboardStatCards sales={bundle.sales} topCategory={topCategory} />

        <section className="mt-6 space-y-6">
          <TopProductsTable products={bundle.topProducts} />
          <TopCategoriesTable categories={bundle.topCategories} />
        </section>
      </div>
    </div>
  );
}
