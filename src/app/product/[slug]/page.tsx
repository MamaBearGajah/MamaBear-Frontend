import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import { fetchProductSlug } from "../../../../services";
import { fetchProducts } from "../../../../services";
import FilterSection from "@/components/FilterSection";
import { getProductSlug } from "../../../../server";
import { PlatziProduct } from "../../../../types";

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
	const slicedData = fetchedAllDataData?.slice(0,3);
	// console.log("slicedData", slicedData)
	const productId = fetchedDataData.id;
	
	return (
		<div className="mx-auto w-full xl:w-[95%] md:flex md:flex-col justify-center gap-2 px-5 lg:px-20">
			<div className="w-full block md:flex md:justify-center">
				<div className='w-full md:w-[95%] top-5'><ProductSection productId={productId} product={fetchedDataData}/></div>
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
