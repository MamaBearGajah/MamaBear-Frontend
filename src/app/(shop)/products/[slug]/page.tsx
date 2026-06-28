import ProductSection from "@/components/productDetail/ProductSection";
import ReviewSection from "@/components/productDetail/ReviewSection";
import { Metadata } from "next";
import { Product } from "@/types";
import AddToCartMobile from "@/components/cart/AddToCartMobile";
import { isTop5Bestseller } from "@/lib/utils";
import { getProductBySlug2, getAllProducts, getProductVariantById } from "@/lib/api/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params; // ← await params (Next.js 15)
    const product = await getProductBySlug2(decodeURIComponent(slug));

    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.name} | MamaBear`,
      description: product.description || `Buy ${product.name} at MamaBear.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.images?.[0]?.imageUrl || "/default-og-image.jpg", width: 1200, height: 630, alt: product.name }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: [product.images?.[0]?.imageUrl || "/default-og-image.jpg"],
      },
    };
  } catch {
    return { title: "MamaBear | Product", description: "Explore our products at MamaBear." };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params; // ← await params

  if (!slug) {
    return <div>Product Not Found</div>;
  }

  const [fetchedAllDataData, fetchedDataData] = await Promise.all([
    getAllProducts(),
    getProductBySlug2(decodeURIComponent(slug)),
  ]);

  const productId = fetchedDataData.id;

  const remainingItems = fetchedAllDataData
    .filter((item: Product) => item.id !== productId)
    .sort((a: Product, b: Product) =>
      parseFloat(b.avgRating?.toString() ?? "0") - parseFloat(a.avgRating?.toString() ?? "0")
    )
    .slice(0, 5);

  const productVariant = await getProductVariantById(productId);
  const isTop5BestsellerFlag = isTop5Bestseller(fetchedAllDataData, productId);

  return (
    <div className="mx-auto w-full xl:w-[100%] md:flex md:flex-col justify-center gap-2 px-5 lg:px-20 bg-light-pink/25">
      <div className="w-full block md:flex md:justify-center items-start">
        <div className="w-full md:w-[100%] top-2">
          <ProductSection
            productId={productId}
            product={fetchedDataData}
            productVariant={productVariant}
            isTop5BestsellerFlag={isTop5BestsellerFlag}
          />
        </div>
      </div>
      <div className="w-full">
        <ReviewSection productId={productId} product={fetchedDataData} slicedData={remainingItems} />
      </div>
      <div className="block lg:hidden">
        <AddToCartMobile productId={productId} product={fetchedDataData} />
      </div>
    </div>
  );
}