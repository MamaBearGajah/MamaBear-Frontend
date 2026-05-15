// import ProductCard from "@/components/ProductCard";
// import  { fetchProducts } from "@/services/index";
import Link from "next/link";

export default async function ProductsPage() {
//   const products = await fetchProducts();
//   if(!products || products.length === 0) {
//     return (<div>No Product Found</div>)
//   }


  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 sm:py-8 border h-[20vh] md:h-[40vh] flex flex-col justify-center">
      <p className="font-bold font-size-1 text-center pb-5">All Products</p>
      <div className="border mx-auto p-5">
        <Link href={`/product/1`}>
            Go To Product Detail Page
        </Link>
      </div>
    </main>
  );
}
