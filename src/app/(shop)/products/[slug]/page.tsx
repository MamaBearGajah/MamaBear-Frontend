import ProductSection from "@/components/productDetail/ProductSection";
import ReviewSection from "@/components/productDetail/ReviewSection";
import {fetchProductSlug2, getProductVariantById} from "../../../../lib/api/products"
import { fetchProducts } from "../../../../lib/api/products";
import { fetchProductVariantId } from "../../../../lib/api/products";
import { fetchProductVariantId2 } from "../../../../lib/api/products";
import { ProductVariant } from "@/types";
import FilterSection from "@/components/FilterSection";
import { fetchProductSlug } from "../../../../../services";
// import {getList} from "@/lib/api/reviews";
import AddToCartMobile from "@/components/cart/AddToCartMobile";
import {isTop5Bestseller} from "@/lib/utils";
import { getProductBySlug2, getAllProducts } from "@/lib/api/products";



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

    //fetch all data using old API no mockproduct
    // const fetchedAllData = await fetchProducts();
    // const fetchedAllDataData = await fetchedAllData.data.data;

    //fetch all data using new API with mockproduct
    const fetchedAllDataData = await getAllProducts();
    const slicedData = fetchedAllDataData?.slice(0,3);

    //fetch one data by slug using old API no mockproduct
    // const fetchedDataData = await fetchProductSlug2(slug);

    //fetch one data by slug using new API with mockproduct
    const fetchedDataData = await getProductBySlug2(slug);
    const productId = fetchedDataData.id;

    //fetch product variant by product id using old API no mockproduct
    // const productVariant = await fetchProductVariantId2(productId)

    //fetch product variant by product id using new API with mockproduct
    const productVariant = await getProductVariantById(productId);


    const isTop5BestsellerFlag = isTop5Bestseller(fetchedAllDataData, productId);
    
    return (
        <div className="mx-auto w-full xl:w-[100%] md:flex md:flex-col justify-center gap-2 px-5 lg:px-20 bg-[var(--background)]">
            <div className="w-full block md:flex md:justify-center">
                <div className='w-full md:w-[100%] top-2'><ProductSection productId={productId} product={fetchedDataData}  productVariant={productVariant} isTop5BestsellerFlag={isTop5BestsellerFlag}/></div>
            </div>
            <div className="w-full">
                <ReviewSection productId={productId} product={fetchedDataData} slicedData={slicedData}/>
            </div>
            <div className="block lg:hidden">
                <AddToCartMobile productId={productId} product={fetchedDataData} />
            </div>
        </div>
    );
}
