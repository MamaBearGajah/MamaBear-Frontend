import { formatPrice } from "@/lib/utils";
import type { TopCategoryReport } from "@/types";

const CATEGORY_COLORS = [
  "#D63664",
  "#9B5B2C",
  "#F0AD40",
  "#18B17C",
  "#7263F0",
  "#B97BF5",
];

type CategorySlice = TopCategoryReport & {
  color: string;
  share: number;
};

function buildCategorySlices(categories: TopCategoryReport[]): CategorySlice[] {
  const total = categories.reduce((sum, item) => sum + item.revenue, 0);
  if (total <= 0) return [];

  let offset = 0;
  return categories.map((category, index) => {
    const share = Math.round((category.revenue / total) * 100);
    return {
      ...category,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      share,
    };
  });
}

function buildConicGradient(slices: CategorySlice[]): string {
  if (slices.length === 0) {
    return "conic-gradient(#FBC3D3 0 100%)";
  }

  let offset = 0;
  const stops = slices.map((slice) => {
    const start = offset;
    offset += slice.share;
    return `${slice.color} ${start}% ${offset}%`;
  });

  return `conic-gradient(from 180deg at 50% 50%, ${stops.join(", ")})`;
}

type TopCategoriesPanelProps = {
  categories: TopCategoryReport[];
};

export default function TopCategoriesPanel({
  categories,
}: TopCategoriesPanelProps) {
  const slices = buildCategorySlices(categories);
  const topShare = slices[0]?.share ?? 0;
  const gradient = buildConicGradient(slices);

  return (
    <div className="rounded-[32px] border border-[#F1E9EB] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Revenue by Category
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Category performance for the selected period
          </p>
        </div>
        {topShare > 0 && (
          <span className="text-sm font-semibold text-[#C75483]">{topShare}%</span>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div
          className="relative flex h-48 w-48 items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <div className="h-24 w-24 rounded-full bg-white" />
        </div>

        <div className="w-full space-y-3">
          {slices.length === 0 ? (
            <p className="rounded-3xl bg-[#F9F2F4] px-4 py-3 text-center text-sm text-muted-foreground">
              Belum ada data kategori.
            </p>
          ) : (
            slices.map((item) => (
              <div
                key={item.categoryId}
                className="flex items-center justify-between rounded-3xl bg-[#F9F2F4] px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="inline-flex h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="ml-3 shrink-0 text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {item.share}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.revenue)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
