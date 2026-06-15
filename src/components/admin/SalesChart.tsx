"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatPrice } from "@/lib/utils";
import type { TopProductReport } from "@/types";

type SalesChartProps = {
  products: TopProductReport[];
  rangeLabel: string;
};

type ChartRow = {
  productId: string;
  name: string;
  shortName: string;
  revenue: number;
  qty: number;
};

function truncateName(name: string, maxLength = 26): string {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength - 1)}…`;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) {
  if (!active || !payload?.[0]?.payload) return null;

  const item = payload[0].payload;
  return (
    <div className="rounded-2xl border border-[#F1E9EB] bg-white px-4 py-3 shadow-md">
      <p className="max-w-[220px] text-sm font-semibold text-foreground">
        {item.name}
      </p>
      <p className="mt-1 text-sm text-[#C75483]">{formatPrice(item.revenue)}</p>
      <p className="text-xs text-muted-foreground">Qty {item.qty.toLocaleString("id-ID")}</p>
    </div>
  );
}

export default function SalesChart({ products, rangeLabel }: SalesChartProps) {
  const chartData = useMemo<ChartRow[]>(
    () =>
      [...products]
        .sort((left, right) => right.revenue - left.revenue)
        .slice(0, 10)
        .map((product) => ({
          productId: product.productId,
          name: product.name,
          shortName: truncateName(product.name),
          revenue: product.revenue,
          qty: product.qty,
        })),
    [products],
  );

  const chartHeight = Math.max(320, chartData.length * 36);

  return (
    <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Revenue by Product (selected period)
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on top-products report — not a daily timeline
          </p>
        </div>
        <div className="inline-flex rounded-full bg-[#F9F2F6] px-4 py-2 text-sm font-semibold text-[#7C4F9A]">
          {rangeLabel}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#F4E8EC] bg-[#FBF4F6] p-4 sm:p-5">
        {chartData.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Belum ada data penjualan produk.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#E9D5DF"
                strokeDasharray="4 4"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#8B7355", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#E9D5DF" }}
                tickFormatter={(value) => formatPrice(Number(value))}
              />
              <YAxis
                type="category"
                dataKey="shortName"
                width={132}
                tick={{ fill: "#4B2F2F", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#E9D5DF" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(251, 195, 211, 0.25)" }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="revenue"
                fill="#FBC3D3"
                radius={[0, 8, 8, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
