import { ProductFilterDrawer } from "@/components/product/ProductFilterDrawer";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPagination } from "@/components/product/ProductPagination";
import { SortBar } from "@/components/product/SortBar";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { ProductSort } from "@/types/product";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    search?: string;
    categories?: string;
    sort?: string;
    page?: string;
    price?: string;
    stock?: string;
  }>;
};

function normalizeSort(sort?: string): ProductSort {
  const allowedSorts: ProductSort[] = [
    "newest",
    "price-asc",
    "price-desc",
    "rating",
    "popular",
  ];

  return allowedSorts.includes(sort as ProductSort)
    ? (sort as ProductSort)
    : "newest";
}

export default async function ProductPage({ searchParams }: ProductsPageProps) {
  const params = searchParams ? await searchParams : {};

  const sort = normalizeSort(params.sort);
  const page = Number(params.page ?? "1");

  const [productResponse, categories] = await Promise.all([
    productsApi.getList({
      search: params.search,
      categories: params.categories,
      price: params.price,
      stock: params.stock,
      sort,
      page,
    }),
    categoriesApi.getList(),
  ]);

  return (
  <main className="min-h-screen overflow-x-hidden bg-[#FFF5F8]">
    <section className="px-4 py-5 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-5 text-sm font-semibold text-[#8B6352]">
          Home <span className="mx-2">›</span>
          <span className="text-[var(--mamabear-dark-pink)]">Products</span>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <ProductFilters categories={categories} />
          </div>

          <section className="min-w-0 space-y-5">
            <div className="space-y-4">
              <div className="lg:hidden">
                <h1 className="font-heading text-4xl font-extrabold leading-tight text-[var(--mamabear-brown)]">
                  All Products
                </h1>

                <p className="mt-2 text-xl font-semibold text-[#8B6352]">
                  {productResponse.total} products found
                </p>
              </div>

              <div className="hidden lg:block">
                <SortBar total={productResponse.total} currentSort={sort} />
              </div>

              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:hidden">
                <ProductFilterDrawer
                  categories={categories}
                  total={productResponse.total}
                />

                <SortBar
                  total={productResponse.total}
                  currentSort={sort}
                  showTitle={false}
                />
              </div>
            </div>

            <ProductGrid products={productResponse.products} />

            <ProductPagination
              page={productResponse.currentPage}
              totalPages={productResponse.totalPages}
            />
          </section>
        </div>
      </div>
    </section>
  </main>
);
}