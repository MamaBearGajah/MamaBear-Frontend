"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  endOfQuarter,
  format,
  parse,
  parseISO,
  startOfMonth,
  startOfQuarter,
  subDays,
  subMonths,
  subQuarters,
} from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bell, ChevronDown, Download, Search } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

type ReportOrder = Order & {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
};

type AdminReportsClientProps = {
  orders: ReportOrder[];
  userName: string;
};

type MonthOption = {
  value: string;
  label: string;
};

type YearOption = {
  value: string;
  label: string;
};

type QuarterValue = "all" | "Q1" | "Q2" | "Q3" | "Q4";

type DailyOrderPoint = {
  date: string;
  label: string;
  orders: number;
};

type ProductRow = {
  id: string;
  name: string;
  qty: number;
  revenue: number;
  badge: string;
};

function getMonthKey(dateValue: string): string {
  try {
    return format(parseISO(dateValue), "yyyy-MM");
  } catch {
    return "";
  }
}

function getYearKey(dateValue: string): string {
  try {
    return format(parseISO(dateValue), "yyyy");
  } catch {
    return "";
  }
}

function getQuarterValue(dateValue: string): QuarterValue {
  try {
    const month = parseISO(dateValue).getMonth();
    return (["Q1", "Q2", "Q3", "Q4"] as const)[Math.floor(month / 3)];
  } catch {
    return "Q1";
  }
}

function formatMonthLabel(value: string): string {
  try {
    return format(parse(`${value}-01`, "yyyy-MM-dd", new Date()), "MMM yyyy");
  } catch {
    return value;
  }
}

function getMonthOptions(orders: ReportOrder[]): MonthOption[] {
  const unique = new Set<string>();

  for (const order of orders) {
    const key = getMonthKey(order.createdAt);
    if (key) unique.add(key);
  }

  return [...unique]
    .sort((left, right) => right.localeCompare(left))
    .map((value) => ({ value, label: formatMonthLabel(value) }));
}

function getYearOptions(orders: ReportOrder[]): YearOption[] {
  const unique = new Set<string>();

  for (const order of orders) {
    const year = getYearKey(order.createdAt);
    if (year) unique.add(year);
  }

  return [...unique]
    .sort((left, right) => right.localeCompare(left))
    .map((value) => ({ value, label: value }));
}

function isWithinDateBounds(dateValue: string, from?: string, to?: string): boolean {
  const date = dateValue.slice(0, 10);
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function filterOrdersByRange(orders: ReportOrder[], from: string, to: string): ReportOrder[] {
  return orders.filter((order) => isWithinDateBounds(order.createdAt, from, to));
}

function buildQuarterBounds(year: string, quarter: Exclude<QuarterValue, "all">) {
  const quarterIndex = Number(quarter.slice(1)) - 1;
  const baseDate = new Date(Number(year), quarterIndex * 3, 1);
  return {
    from: format(startOfQuarter(baseDate), "yyyy-MM-dd"),
    to: format(endOfQuarter(baseDate), "yyyy-MM-dd"),
  };
}

function buildPreviousComparisonRange(options: {
  selectedMonth: string;
  selectedYear: string;
  selectedQuarter: QuarterValue;
  dateFrom: string;
  dateTo: string;
}): { from: string; to: string } | null {
  const { selectedMonth, selectedYear, selectedQuarter, dateFrom, dateTo } = options;

  if (dateFrom && dateTo) {
    const fromDate = parseISO(dateFrom);
    const toDate = parseISO(dateTo);
    const span = Math.max(0, differenceInCalendarDays(toDate, fromDate));
    const previousTo = subDays(fromDate, 1);
    const previousFrom = subDays(previousTo, span);
    return {
      from: format(previousFrom, "yyyy-MM-dd"),
      to: format(previousTo, "yyyy-MM-dd"),
    };
  }

  if (selectedMonth !== "all") {
    const currentMonth = parse(`${selectedMonth}-01`, "yyyy-MM-dd", new Date());
    const previousMonth = subMonths(currentMonth, 1);
    return {
      from: format(startOfMonth(previousMonth), "yyyy-MM-dd"),
      to: format(endOfMonth(previousMonth), "yyyy-MM-dd"),
    };
  }

  if (selectedQuarter !== "all") {
    const currentQuarter = buildQuarterBounds(selectedYear, selectedQuarter);
    const currentQuarterStart = parseISO(currentQuarter.from);
    const previousQuarterStart = subQuarters(currentQuarterStart, 1);
    return {
      from: format(startOfQuarter(previousQuarterStart), "yyyy-MM-dd"),
      to: format(endOfQuarter(previousQuarterStart), "yyyy-MM-dd"),
    };
  }

  return null;
}

function percentageChange(current: number, previous: number): string {
  if (previous <= 0) return current > 0 ? "+100%" : "0%";
  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${Math.round(delta)}%`;
}

function buildDailyOrders(orders: ReportOrder[]): DailyOrderPoint[] {
  const bucket = new Map<string, number>();

  for (const order of orders) {
    const key = order.createdAt.slice(0, 10);
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }

  return [...bucket.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([date, count]) => ({
      date,
      label: format(parseISO(date), "MMM d"),
      orders: count,
    }));
}

function buildTopProducts(orders: ReportOrder[]): ProductRow[] {
  const bucket = new Map<string, ProductRow>();

  for (const order of orders) {
    for (const item of order.items) {
      const key = item.productId || item.name;
      const current = bucket.get(key) ?? {
        id: key,
        name: item.name || "Unknown product",
        qty: 0,
        revenue: 0,
        badge: `#${bucket.size + 1}`,
      };

      current.qty += item.quantity;
      current.revenue += item.quantity * item.price;
      bucket.set(key, current);
    }
  }

  return [...bucket.values()]
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 5)
    .map((row, index) => ({ ...row, badge: `#${index + 1}` }));
}

function DailyOrdersTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DailyOrderPoint }>;
}) {
  if (!active || !payload?.[0]?.payload) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-[#F1E9EB] bg-white px-4 py-3 shadow-md">
      <p className="text-sm font-semibold text-foreground">{point.label}</p>
      <p className="mt-1 text-sm text-[#C75483]">{point.orders} orders</p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-3xl border border-[#F1E9EB] bg-white px-5 py-4 shadow-sm">
      <p className="text-[11px] text-[#9A8B90]">{title}</p>
      <p className="mt-1 text-[28px] font-semibold leading-none text-[#533B3E]">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-[#14A44D]">{delta} vs last month</p>
    </div>
  );
}

export default function AdminReportsClient({ orders, userName }: AdminReportsClientProps) {
  const monthOptions = useMemo(() => getMonthOptions(orders), [orders]);
  const yearOptions = useMemo(() => getYearOptions(orders), [orders]);
  const [selectedMonth, setSelectedMonth] = useState(
    monthOptions[0]?.value ?? format(new Date(), "yyyy-MM"),
  );
  const [selectedYear, setSelectedYear] = useState(
    yearOptions[0]?.value ?? format(new Date(), "yyyy"),
  );
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterValue>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedMonth !== "all" && getMonthKey(order.createdAt) !== selectedMonth) {
        return false;
      }

      if (selectedQuarter !== "all") {
        if (getYearKey(order.createdAt) !== selectedYear) return false;
        if (getQuarterValue(order.createdAt) !== selectedQuarter) return false;
      }

      return isWithinDateBounds(order.createdAt, dateFrom || undefined, dateTo || undefined);
    });
  }, [dateFrom, dateTo, orders, selectedMonth, selectedQuarter, selectedYear]);

  const previousOrders = useMemo(() => {
    const previousRange = buildPreviousComparisonRange({
      selectedMonth,
      selectedYear,
      selectedQuarter,
      dateFrom,
      dateTo,
    });

    if (!previousRange) return [];

    return filterOrdersByRange(orders, previousRange.from, previousRange.to);
  }, [dateFrom, dateTo, orders, selectedMonth, selectedQuarter, selectedYear]);

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const newCustomers = new Set(filteredOrders.map((order) => order.userId)).size;

  const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
  const previousCount = previousOrders.length;
  const previousAvgOrderValue =
    previousCount > 0 ? Math.round(previousRevenue / previousCount) : 0;
  const previousCustomers = new Set(previousOrders.map((order) => order.userId)).size;

  const dailyOrders = useMemo(() => buildDailyOrders(filteredOrders), [filteredOrders]);
  const topProducts = useMemo(() => buildTopProducts(filteredOrders), [filteredOrders]);

  const exportCsv = () => {
    const header = ["Order Number", "Customer", "Status", "Total", "Date"];
    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.status,
      String(order.total),
      order.createdAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `sales-report-${selectedMonth}-${selectedQuarter}-${dateFrom || "start"}-${dateTo || "end"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-370 space-y-4">
        <header className="flex flex-col gap-4 border-b border-[#F0E7EA] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xl font-semibold text-[#4C3437]">Reports</p>
            <p className="mt-1 text-xs text-[#B0A2A7]">{format(new Date(), "EEEE, MMM d, yyyy")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#B0A2A7]" />
              <input
                type="search"
                placeholder="Search.."
                className="h-10 w-48 rounded-full border border-[#EFE6EA] bg-white pl-9 pr-4 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#EFE6EA] bg-white text-[#9E9196]"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#D95A87]" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 border border-[#EFE6EA]">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#D95A87] text-xs font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-[#6E5B5E]">{userName}</span>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[28px] font-semibold text-[#4C3437]">Sales Reports</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <label className="relative">
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="h-10 appearance-none rounded-full border border-[#EFE6EA] bg-white px-4 pr-9 text-sm text-[#6E5B5E]"
                >
                  <option value="all">All months</option>
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9E9196]" />
              </label>

              <label className="relative">
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                  className="h-10 appearance-none rounded-full border border-[#EFE6EA] bg-white px-4 pr-9 text-sm text-[#6E5B5E]"
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9E9196]" />
              </label>

              <label className="relative">
                <select
                  value={selectedQuarter}
                  onChange={(event) =>
                    setSelectedQuarter(event.target.value as QuarterValue)
                  }
                  className="h-10 appearance-none rounded-full border border-[#EFE6EA] bg-white px-4 pr-9 text-sm text-[#6E5B5E]"
                >
                  <option value="all">All quarters</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9E9196]" />
              </label>

              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="h-10 rounded-full border border-[#EFE6EA] bg-white px-4 text-sm text-[#6E5B5E] outline-none"
                aria-label="Start date"
              />

              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="h-10 rounded-full border border-[#EFE6EA] bg-white px-4 text-sm text-[#6E5B5E] outline-none"
                aria-label="End date"
              />

              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#F0B7CB] bg-white px-4 text-sm font-medium text-[#D95A87]"
              >
                <Download className="size-4" />
                Export
              </button>
            </div>
          </div>

          <section className="grid gap-3 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value={formatPrice(totalRevenue)}
              delta={percentageChange(totalRevenue, previousRevenue)}
            />
            <MetricCard
              title="Total Orders"
              value={totalOrders.toLocaleString("id-ID")}
              delta={percentageChange(totalOrders, previousCount)}
            />
            <MetricCard
              title="Avg Order Value"
              value={formatPrice(avgOrderValue)}
              delta={percentageChange(avgOrderValue, previousAvgOrderValue)}
            />
            <MetricCard
              title="New Customers"
              value={newCustomers.toLocaleString("id-ID")}
              delta={percentageChange(newCustomers, previousCustomers)}
            />
          </section>

          <section className="rounded-3xl border border-[#F1E9EB] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#4C3437]">Daily Orders</h3>
            <div className="mt-4 h-80">
              {dailyOrders.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[#9E9196]">
                  No orders found for the selected filters.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyOrders} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#F6EDF0" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#A99BA0", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#A99BA0", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<DailyOrdersTooltip />} cursor={{ fill: "rgba(217,90,135,0.08)" }} />
                    <Bar dataKey="orders" fill="#D25482" radius={[4, 4, 0, 0]} maxBarSize={140} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-[#F1E9EB] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#4C3437]">Top Selling Products</h3>
            <div className="mt-5 space-y-4">
              {topProducts.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#9E9196]">
                  No product sales found for the selected filters.
                </div>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-6 shrink-0 text-xs font-semibold text-[#D95A87]">
                        {product.badge}
                      </span>
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F7ECEF] text-[10px] font-semibold text-[#AF7C8D]">
                        {product.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#4C3437]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#B0A2A7]">{product.qty} orders</p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right text-sm font-medium text-[#7A5B63]">
                      {formatPrice(product.revenue)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
