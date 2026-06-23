import type {
  ReportDateRange,
  SalesReportSummary,
  TopCategoryReport,
  TopProductReport,
} from "@/types";

const FALLBACK_TOP_PRODUCTS: Omit<TopProductReport, "productId">[] = [
  { name: "ASI Booster Tea – Thai Milk Tea", qty: 128, revenue: 6_272_000 },
  { name: "Kookie Bites – Chocolate Chip", qty: 96, revenue: 3_744_000 },
  { name: "Almon Mix – Vanilla", qty: 84, revenue: 3_360_000 },
  { name: "ASI Booster Capsules", qty: 72, revenue: 3_240_000 },
  { name: "Zoya Mix – Original", qty: 65, revenue: 2_925_000 },
  { name: "Almond Cookies – Classic", qty: 58, revenue: 2_610_000 },
  { name: "ASI Booster Tea – Matcha", qty: 52, revenue: 2_548_000 },
  { name: "Kookie Bites – Double Choco", qty: 47, revenue: 1_833_000 },
  { name: "Almon Mix – Caramel", qty: 41, revenue: 1_640_000 },
  { name: "Zoya Mix – Honey", qty: 36, revenue: 1_620_000 },
  { name: "ASI Booster Tea – Original", qty: 31, revenue: 1_519_000 },
  { name: "Almond Cookies – Matcha", qty: 28, revenue: 1_260_000 },
];

const FALLBACK_TOP_CATEGORIES: Omit<TopCategoryReport, "categoryId">[] = [
  { name: "ASI Tea", revenue: 7_000_000 },
  { name: "Capsules", revenue: 5_200_000 },
  { name: "Kookie Bites", revenue: 4_100_000 },
  { name: "Almond Cookies", revenue: 3_400_000 },
  { name: "Almon Mix", revenue: 2_800_000 },
  { name: "Zoya Mix", revenue: 2_100_000 },
];

function withRange<T>(range: ReportDateRange, data: T): T & ReportDateRange {
  return { ...data, from: range.from, to: range.to } as T & ReportDateRange;
}

export function getFallbackSalesReport(range: ReportDateRange): SalesReportSummary {
  const topProducts = getFallbackTopProducts(range);
  const totalSales = topProducts.reduce((sum, item) => sum + item.revenue, 0);
  const orderCount = Math.max(1, Math.round(totalSales / 185_000));

  return withRange(range, {
    totalSales,
    orderCount,
    avgOrderValue: Math.round(totalSales / orderCount),
  });
}

export function getFallbackTopProducts(
  range: ReportDateRange,
  limit = 10,
): TopProductReport[] {
  void range;
  return FALLBACK_TOP_PRODUCTS.slice(0, limit).map((item, index) => ({
    productId: `mock-product-${index + 1}`,
    ...item,
  }));
}

export function getFallbackTopCategories(
  _range: ReportDateRange,
  limit = 10,
): TopCategoryReport[] {
  return FALLBACK_TOP_CATEGORIES.slice(0, limit).map((item, index) => ({
    categoryId: `mock-category-${index + 1}`,
    ...item,
  }));
}

export function getFallbackReportsBundle(range: ReportDateRange, limit = 10) {
  return {
    sales: getFallbackSalesReport(range),
    topProducts: getFallbackTopProducts(range, limit),
    topCategories: getFallbackTopCategories(range, limit),
  };
}
