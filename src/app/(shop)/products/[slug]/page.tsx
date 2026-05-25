import ProductSection from "@/components/productDetail/ProductSection";
import ReviewSection from "@/components/productDetail/ReviewSection";
import {fetchProductSlug2, getProductVariantById} from "../../../../lib/api/products"
import { fetchProducts } from "../../../../lib/api/products";
import { fetchProductVariantId } from "../../../../lib/api/products";
import { fetchProductVariantId2 } from "../../../../lib/api/products";
import { ProductVariant } from "@/types";
import FilterSection from "@/components/FilterSection";
import { fetchProductSlug } from "../../../../../services";
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
    // const fetchedAllData = await fetchProducts();
    // const fetchedAllDataData = await fetchedAllData.data.data;
    const fetchedAllData = await getAllProducts();
    const fetchedAllDataData = await fetchedAllData;
    const slicedData = fetchedAllDataData?.slice(0,3);
    // console.log("slicedData", slicedData)
    // console.log("fetchedAllDataData", fetchedAllDataData)
    // const fetchedDataData = await fetchProductSlug2(slug);
    const fetchedDataData = await getProductBySlug2(slug);
    // console.log("fetchedDataData", fetchedDataData)

  
    const productId = fetchedDataData.id;
    // const productVariant = await fetchProductVariantId2(productId)
    const productVariant = await getProductVariantById(productId);

    // console.log("productVariant", productVariant)

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
