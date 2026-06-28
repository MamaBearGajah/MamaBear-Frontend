import { DollarSign, ShoppingBag, Tags, TrendingUp } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import type { SalesReportSummary, TopCategoryReport } from "@/types";

type DashboardStatCardsProps = {
  sales: SalesReportSummary;
  topCategory?: TopCategoryReport;
};

const CARD_CLASS =
  "rounded-[30px] border border-[#F1E9EB] bg-white p-6 shadow-sm";

export default function DashboardStatCards({
  sales,
  topCategory,
}: DashboardStatCardsProps) {
  const topCategoryShare =
    topCategory && sales.totalSales > 0
      ? Math.round((topCategory.revenue / sales.totalSales) * 100)
      : null;

  return (
    <section className="grid gap-4 xl:grid-cols-4">
      <div className={CARD_CLASS}>
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDE7ED] text-[#C75483]">
            <DollarSign className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Total Sales
        </p>
        <p className="mt-3 text-3xl font-semibold text-foreground">
          {formatPrice(sales.totalSales)}
        </p>
      </div>

      <div className={CARD_CLASS}>
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EBE7] text-[#A66A3A]">
            <ShoppingBag className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Order Count
        </p>
        <p className="mt-3 text-3xl font-semibold text-foreground">
          {sales.orderCount.toLocaleString("id-ID")}
        </p>
      </div>

      <div className={CARD_CLASS}>
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E6F6EE] text-[#1D8A5D]">
            <TrendingUp className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Avg Order Value
        </p>
        <p className="mt-3 text-3xl font-semibold text-foreground">
          {formatPrice(sales.avgOrderValue)}
        </p>
      </div>

      <div className={CARD_CLASS}>
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F6EEF4] text-[#7C4F9A]">
            <Tags className="h-5 w-5" />
          </span>
          {topCategoryShare !== null && (
            <span className="text-sm font-semibold text-[#C75483]">
              {topCategoryShare}%
            </span>
          )}
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Top Category
        </p>
        <p className="mt-3 text-2xl font-semibold leading-tight text-foreground">
          {topCategory?.name ?? "—"}
        </p>
        {topCategory && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPrice(topCategory.revenue)}
          </p>
        )}
      </div>
    </section>
  );
}
