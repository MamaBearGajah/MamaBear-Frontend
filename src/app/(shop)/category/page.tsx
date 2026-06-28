import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategoryList } from "@/lib/api/categories";
import { getProductList } from "@/lib/api/products";
import type { ProductListItem } from "@/types";

export const metadata: Metadata = {
  title: "Shop by Category | MamaBear",
  description: "Explore MamaBear categories with soft pink styling and product-inspired images.",
};

export default async function CategoryPage() {
  const [categoriesRes, productListRes] = await Promise.all([
    getCategoryList(),
    getProductList({ page: 1, limit: 12 }),
  ]);

  const categories = categoriesRes.data
    .filter((category) => category.id !== "cat-root" && category.isActive)
    .slice(0, 10);

  const products = productListRes.data;
  const heroImages = products
    .map((product) => product.images?.[0]?.imageUrl)
    .filter(Boolean) as string[];

  const categoryCards = categories.map((category, index) => {
    const fallbackProduct = products[index] as ProductListItem | undefined;
    const productImage = fallbackProduct?.images?.[0]?.imageUrl;

    return {
      ...category,
      imageUrl: category.imageUrl || productImage,
    };
  });

  return (
    <main className="bg-[#fff0f4] min-h-screen py-10 text-[#6c4735]">
      <div className="container-main space-y-10">
        <section className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(255,183,210,0.16)] backdrop-blur-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-pink-700 ring-1 ring-pink-100">
                Good & Gather
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Discover delicious every day</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-[#7f5461]">
                  Browse MamaBear categories in a warm, gentle palette with fresh product imagery sourced from our catalog.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-[#d5557e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b63f67]"
                >
                  Shop all products
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-white px-6 py-3 text-sm font-semibold text-[#6c4735] transition hover:bg-pink-50"
                >
                  Browse categories
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {heroImages.slice(0, 4).map((src, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[2rem] bg-pink-50 shadow-sm ring-1 ring-pink-100"
                >
                  <Image
                    src={src}
                    alt={`Featured product ${index + 1}`}
                    width={600}
                    height={600}
                    className="h-52 w-full object-cover"
                  />
                </div>
              ))}
              {heroImages.length < 4 &&
                Array.from({ length: 4 - heroImages.length }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="flex h-52 items-center justify-center rounded-[2rem] bg-pink-100 text-sm text-pink-600"
                  >
                    MamaBear image
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-700">Shop by category</p>
            <h2 className="text-3xl font-bold">MamaBear category picks</h2>
            <p className="max-w-3xl text-base leading-7 text-[#7f5461]">
              Tap into curated category cards with soft rounded shapes, gentle pink highlights, and images drawn from the MamaBear product feed.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryCards.map((category) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="group overflow-hidden rounded-[2rem] border border-pink-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden bg-pink-50">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-pink-600">
                      Image coming soon
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-5 text-center">
                  <p className="text-sm uppercase tracking-[0.24em] text-pink-600">Category</p>
                  <h3 className="text-xl font-semibold text-[#6c4735]">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
