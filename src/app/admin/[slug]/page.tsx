import ProductSection from "@/components/productDetail/ProductSection";
import ReviewSection from "@/components/productDetail/ReviewSection";
import { fetchProductSlug } from "@/services";
import { fetchProducts } from "@/services";
import { fetchProductVariantId } from "@/services";
import { ProductVariant } from "@/types";
import FilterSection from "@/components/FilterSection";
import { getProductSlug } from "@/server";
import { PlatziProduct } from "@/types";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
	const { slug } = await params;

	if (!slug) {
		return 
		<div>Product Not Found</div>
	}
	const fetchedAllData = await fetchProducts();
	const fetchedAllDataData = await fetchedAllData.data.data;
	// console.log("fetchedAllDataData", fetchedAllDataData)
	const fetchedData = await fetchProductSlug(slug)
	const fetchedDataData = fetchedData.data;
	const slicedData = fetchedAllDataData?.slice(0,5);
	// console.log("slicedData", slicedData)
	const productId = fetchedDataData.id;
	const productVariant = await fetchProductVariantId(productId)
	
	return (
		<div className="mx-auto w-full xl:w-[100%] md:flex md:flex-col justify-center gap-2 px-5 lg:px-20">
			<div className="w-full block md:flex md:justify-center">
				<div className='w-full md:w-[100%] top-2'><ProductSection productId={productId} product={fetchedDataData}  productVariant={productVariant}/></div>
			</div>
			<div className="w-full">
				<ReviewSection productId={productId} product={fetchedDataData} slicedData={slicedData}/>
			</div>
			<div className="block lg:hidden">
				{/* <AddToCartMobile /> */}
			</div>
		</div>
	);
}
