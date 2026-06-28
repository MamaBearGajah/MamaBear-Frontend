import { fetchReportsWithFallback } from "../src/lib/admin/fetch-reports";
import { getDefaultReportDateRange } from "../src/lib/admin/report-date-range";

async function main() {
  const range = getDefaultReportDateRange();
  console.log("=== Date range ===");
  console.log(JSON.stringify(range, null, 2));

  console.log("\n=== fetchReportsWithFallback ===");
  const data = await fetchReportsWithFallback(range);
  console.log(JSON.stringify(data, null, 2));

  console.log("\n=== Shape checks ===");
  const checks = {
    salesKeys: Object.keys(data.sales).sort(),
    topProductsCount: data.topProducts.length,
    topCategoriesCount: data.topCategories.length,
    firstProductKeys: data.topProducts[0]
      ? Object.keys(data.topProducts[0]).sort()
      : [],
    firstCategoryKeys: data.topCategories[0]
      ? Object.keys(data.topCategories[0]).sort()
      : [],
    salesNumbersValid: ["totalSales", "orderCount", "avgOrderValue"].every(
      (key) => typeof data.sales[key as keyof typeof data.sales] === "number",
    ),
    pass:
      data.topProducts.length === 10 &&
      data.topCategories.length === 6 &&
      data.sales.totalSales > 0,
  };
  console.log(JSON.stringify(checks, null, 2));
  process.exit(checks.pass ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
