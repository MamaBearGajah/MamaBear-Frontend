import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import FilterSection from "@/components/FilterSection";
import { getProductSlug } from "../../../../server";
import { PlatziProduct } from "../../../../types";

export default async function ProductDetailPage({params}: {
  params: Promise<{ slug: string }>;}) {
	const { slug } = await params;

	// const products : PlatziProduct = await getProductSlug(slug)
	// if (!products) {
	// 	return 
	// 	<div>Product Not Found</div>
	// }

	if (!slug) {
		return 
		<div>Product Not Found</div>
	}
	return (
		<div className="mx-auto w-full xl:w-[1600px] md:flex md:flex-col justify-center gap-2 px-5 lg:px-20">
			<div className="w-full block md:flex md:justify-center border ">
				{/* products.id */}
				<div className='hidden md:block md:w-[20%]'><FilterSection productId={1}/></div> 
				<div className='w-full md:w-[70%] top-5'><ProductSection productId={1}/></div>
			</div>
			<div className="w-full">
				<ReviewSection/>
			</div>
			<div className="block lg:hidden">
				{/* <AddToCartMobile /> */}
			</div>
		</div>
	);
}
