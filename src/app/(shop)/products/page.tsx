// import type { Metadata } from "next";
// import { Suspense } from "react";
// import ActiveFilterBadges from "@/components/product/ActiveFilterBadges";
// import FilterSidebar from "@/components/product/FilterSidebar";
// import ProductsPageHeader from "@/components/product/ProductsPageHeader";
// import ProductListToolbar from "@/components/product/ProductListToolbar";
// import ShopProductGrid from "@/components/product/ShopProductGrid";
// import Pagination from "@/components/shared/Pagination";
// import { getCategoryList } from "@/lib/api/categories";
// import { getProductList } from "@/lib/api/products";
// import { computeCategoryCounts } from "@/lib/shop/category-counts";
// import {
//   DEFAULT_PRICE_BOUNDS,
//   needsStorefrontClientCatalog,
//   parseShopListParamsFromRecord,
//   toStorefrontClientCatalogParams,
//   toStorefrontProductListParams,
// } from "@/lib/shop/product-list-params";
// import {
//   applyStorefrontSort,
//   filterProductsByCategoryScope,
//   filterProductsByEffectivePrice,
//   filterStorefrontProducts,
// } from "@/lib/shop/storefront-products";
// import type { PaginationMeta } from "@/types";


// export const metadata: Metadata = {
//   title: "All Products | MamaBear",
//   description: "Browse all MamaBear superfood products",
// };

// interface ProductsPageProps {
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }

// export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  
//   const params = await searchParams;
//   const filters = parseShopListParamsFromRecord(params);
//   const listParams = toStorefrontProductListParams(filters);
//   const needsClientCatalog = needsStorefrontClientCatalog(filters);
//   const clientCatalogParams = toStorefrontClientCatalogParams(filters);

//   const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
//     getProductList(needsClientCatalog ? clientCatalogParams : listParams),
//     getCategoryList(),
//     getProductList({ page: 1, limit: 100 }),
//   ]);

//   const categories = categoriesRes.data;
//   const storefrontProducts = filterProductsByCategoryScope(
//     filterStorefrontProducts(productsRes.data),
//     filters.categoryId,
//     categories,
//   );
//   const priceFilteredProducts = applyStorefrontSort(
//     filterProductsByEffectivePrice(
//       storefrontProducts,
//       filters.minPrice,
//       filters.maxPrice,
//     ),
//     filters.sortBy,
//     filters.sortOrder,
//   );

//   const page = filters.page ?? 1;
//   const limit = filters.limit ?? 20;
//   const start = (page - 1) * limit;
//   const products = needsClientCatalog
//     ? priceFilteredProducts.slice(start, start + limit)
//     : priceFilteredProducts;
//   const qNeedle = filters.q?.trim().toLowerCase();
//   const countProducts = filterProductsByEffectivePrice(
//     filterStorefrontProducts(allProductsRes.data)
//       .filter((product) =>
//         qNeedle
//           ? product.name.toLowerCase().includes(qNeedle) ||
//             product.slug.toLowerCase().includes(qNeedle)
//           : true,
//       )
//       .filter((product) => (filters.inStock === true ? product.stock > 0 : true)),
//     filters.minPrice,
//     filters.maxPrice,
//   );
//   const categoryCounts = computeCategoryCounts(countProducts);

//   const meta: PaginationMeta = needsClientCatalog
//     ? {
//         page,
//         limit,
//         totalItems: priceFilteredProducts.length,
//         totalPages: Math.max(1, Math.ceil(priceFilteredProducts.length / limit)),
//       }
//     : (productsRes.meta ?? {
//         page,
//         limit,
//         totalItems: products.length,
//         totalPages: 1,
//       });

//   return (
//     <main className="min-h-[60vh] bg-light-pink/25 py-6 md:py-10">
//       <div className="container-main space-y-4">
//         <Suspense fallback={null}>
//           <ProductsPageHeader
//             totalItems={meta.totalItems}
//             categories={categoriesRes.data}
//           />
//         </Suspense>

//         <Suspense fallback={null}>
//           <ActiveFilterBadges categories={categoriesRes.data} />
//         </Suspense>

//         <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
//           <FilterSidebar
//             categories={categoriesRes.data}
//             categoryCounts={categoryCounts}
//             basePath="/products"
//             priceBounds={DEFAULT_PRICE_BOUNDS}
//           />

//           <div className="min-w-0 flex-1 space-y-4">
//             <Suspense fallback={null}>
//               <ProductListToolbar />
//             </Suspense>

//             <ShopProductGrid
//               products={products}
//               categories={categoriesRes.data}
//             />

//             <Suspense fallback={null}>
//               <Pagination meta={meta} />
//             </Suspense>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }





import type { Metadata } from "next";
import { Suspense } from "react";
import ActiveFilterBadges from "@/components/product/ActiveFilterBadges";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductsPageHeader from "@/components/product/ProductsPageHeader";
import ProductListToolbar from "@/components/product/ProductListToolbar";
import ShopProductGrid from "@/components/product/ShopProductGrid";
import Pagination from "@/components/shared/Pagination";
// Import komponen CategoryGrid yang baru
import CategoryGrid from "@/components/product/CategoryGrid"; 
import { getCategoryList } from "@/lib/api/categories";
import { getProductList } from "@/lib/api/products";
import { computeCategoryCounts } from "@/lib/shop/category-counts";
import {
  DEFAULT_PRICE_BOUNDS,
  parseShopListParamsFromRecord,
  toStorefrontProductListParams,
} from "@/lib/shop/product-list-params";
import { isMockProductsEnabled } from "@/lib/api/mock-data";
import { filterStorefrontProducts } from "@/lib/shop/storefront-products";
import type { PaginationMeta } from "@/types";

export const metadata: Metadata = {
  title: "All Products | MamaBear",
  description: "Browse all MamaBear superfood products",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const filters = parseShopListParamsFromRecord(params);
  const listParams = toStorefrontProductListParams(filters);

  const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
    getProductList(listParams),
    getCategoryList(),
    getProductList({ page: 1, limit: 100 }),
  ]);

  const products = filterStorefrontProducts(productsRes.data);
  const categoryCounts = computeCategoryCounts(allProductsRes.data);

  const meta: PaginationMeta = productsRes.meta ?? {
    page: filters.page,
    limit: filters.limit,
    totalItems: products.length,
    totalPages: 1,
  };

  return (
    <main className="min-h-[60vh] bg-light-pink/25 py-6 md:py-10">
      <div className="container-main space-y-4">
        <Suspense fallback={null}>
          <ProductsPageHeader
            totalItems={meta.totalItems}
            categories={categoriesRes.data}
          />
        </Suspense>

       <Suspense fallback={null}>
          <ActiveFilterBadges categories={categoriesRes.data} />
        </Suspense>

        {/* --- POSISI BARU: Di atas Filter dan Produk --- */}
        <Suspense fallback={null}>
          <CategoryGrid categories={categoriesRes.data} />
        </Suspense>
        {/* ---------------------------------------------- */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <FilterSidebar
            categories={categoriesRes.data}
            categoryCounts={categoryCounts}
            basePath="/products"
            priceBounds={DEFAULT_PRICE_BOUNDS}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <Suspense fallback={null}>
              <ProductListToolbar />
            </Suspense>

            <ShopProductGrid
              products={products}
              categories={categoriesRes.data}
            />

            <Suspense fallback={null}>
              <Pagination meta={meta} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )}