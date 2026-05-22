import ProductSection from "@/components/productDetail/ProductSection";
import ReviewSection from "@/components/productDetail/ReviewSection";
import FilterSection from "@/components/FilterSection";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  // const products : Product = await fetchProduct(productId)

  if (isNaN(productId)) {
    return;
    <div>Product Id Not Found</div>;
  }
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-2 px-10 lg:px-30 xl:w-[1280px]">
      {/* ^^^ div to be deleted */}

      <div className="flex w-full justify-center border">
        <div className="w-full md:w-[20%]">
          <FilterSection productId={productId} />
        </div>
        <div className="w-full md:w-[70%]">
          <ProductSection productId={productId} />
        </div>
      </div>
      <div className="w-full">
        <ReviewSection />
      </div>
      <div className="block lg:hidden">{/* <AddToCartMobile /> */}</div>
    </div>
  );
}
