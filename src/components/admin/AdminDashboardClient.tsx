"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Bell, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import DashboardStatCards from "@/components/admin/DashboardStatCards";
import DateRangePicker from "@/components/admin/DateRangePicker";
import SalesChartSkeleton from "@/components/admin/SalesChartSkeleton";
import TopCategoriesPanel from "@/components/admin/TopCategoriesPanel";
import TopProductsTable from "@/components/admin/TopProductsTable";
import { useAuth } from "@/context/AuthContext";
import { loadReportsBundle } from "@/lib/admin/load-reports-bundle";
import { isValidReportDateRange } from "@/lib/admin/report-date-range";
import type { ReportsBundle } from "@/lib/api/reports";
import type { ReportDateRange } from "@/types";

const SalesChart = dynamic(() => import("@/components/admin/SalesChart"), {
  loading: () => <SalesChartSkeleton />,
  ssr: false,
});

type AdminDashboardClientProps = {
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

function formatHeaderDate(referenceDate = new Date()): string {
  return format(referenceDate, "EEEE, d MMMM yyyy", { locale: localeId });
}

export default function AdminDashboardClient({
  initialRange,
  initialData,
  initialUsingDemoData,
}: AdminDashboardClientProps) {
  const { state } = useAuth();
  const [range, setRange] = useState<ReportDateRange>(initialRange);
  const [bundle, setBundle] = useState<ReportsBundle>(initialData);
  const [usingDemoData, setUsingDemoData] = useState(initialUsingDemoData);
  const [isPending, startTransition] = useTransition();

  const userName = state.user?.name ?? "Admin";
  const userInitial = userName.charAt(0).toUpperCase();
  const rangeLabel = useMemo(() => formatRangeLabel(range), [range]);
  const topCategory = bundle.topCategories[0];

  const handleRefresh = useCallback(() => {
    if (!isValidReportDateRange(range)) {
      toast.error("Periode laporan tidak valid.");
      return;
    }

    startTransition(async () => {
      const result = await loadReportsBundle(range);
      setBundle(result.data);
      setUsingDemoData(result.usingDemoData);

      if (result.usingDemoData) {
        toast.info("Backend belum siap — menampilkan data demo.");
      } else {
        toast.success("Dashboard diperbarui.");
      }
    });
  }, [range]);

  return (
    <div className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 rounded-[32px] border border-[#F1E9EB] bg-white/80 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard Overview
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatHeaderDate()}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <DateRangePicker value={range} onChange={setRange} disabled={isPending} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="h-12 w-full rounded-full border border-[#E9D9DF] bg-white pl-12 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:border-dark-pink"
                />
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isPending || !isValidReportDateRange(range)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#E9D9DF] bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-[#F7F0F2] disabled:opacity-50"
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
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-brown shadow-sm transition hover:bg-[#F7F0F2]"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>
              <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-bold text-white">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {usingDemoData && (
          <div className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Menampilkan data demo — endpoint reports BE belum tersedia.
          </div>
        )}

        <DashboardStatCards sales={bundle.sales} topCategory={topCategory} />

        <section className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <SalesChart
            products={bundle.topProducts}
            rangeLabel={rangeLabel}
          />
          <TopCategoriesPanel categories={bundle.topCategories} />
        </section>

        <section className="mt-6">
          <TopProductsTable products={bundle.topProducts} />
        </section>
      </div>
    </div>
  );
}
