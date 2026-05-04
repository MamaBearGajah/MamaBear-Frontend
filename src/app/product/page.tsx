// import ProductCard from "@/components/ProductCard";
// import  { fetchProducts } from "@/services/index";
import Link from "next/link";

export default async function ProductsPage() {
//   const products = await fetchProducts();
//   if(!products || products.length === 0) {
//     return (<div>No Product Found</div>)
//   }
  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 sm:py-8">
      <p className="font-bold font-size-1 text-center pb-5">All Products</p>
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Link href={`/products/1`}>
            Product Detail page
        </Link>
      </div>
    </main>
  );
}
