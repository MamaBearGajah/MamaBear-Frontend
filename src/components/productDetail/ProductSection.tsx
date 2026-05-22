import ProductCard from "./ProductCard"
import { Product } from "@/types"
import { ProductVariant } from "@/types"
// import ProductModal from "./ProductModal"

export default async function ProductSection({ productId, product, productVariant }: { productId: string, product: Product, productVariant: ProductVariant[] }) {
    return(
        <div className='md:h-[150vh] xl:h-[160vh] flex flex-col justify-center'>
            <ProductCard productId={productId} product={product} productVariant={productVariant}/>
            {/* <ProductModal/> */}
        </div>
    )
}