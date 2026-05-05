import ProductSection from "@/components/ProductSection";
import ReviewSection from "@/components/ReviewSection";
import FilterSection from "@/components/FilterSection";

export default async function ProductDetailPage({params,}: {
  params: Promise<{ id: string }>;}) {
	const { id } = await params;
	const productId = Number(id);

	// const products : Product = await fetchProduct(productId)

	if (isNaN(productId)) {
		return 
		<div>Product Id Not Found</div>
	}
	return (
		<div className="mx-auto w-full xl:w-[1280px] flex flex-col justify-center gap-2 px-10 lg:px-30">
			{/* ^^^ div to be deleted */}

			<div className="w-full flex justify-center border ">
				<div className='w-full md:w-[20%]'><FilterSection productId={productId}/></div>
				<div className='w-full md:w-[70%]'><ProductSection productId={productId}/>
			</div></div>
			<div className="w-full">
				<ReviewSection/>
			</div>
			<div className="block lg:hidden">
				{/* <AddToCartMobile /> */}
			</div>
		</div>
	);
}
