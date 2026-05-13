import ProductCard from "./ProductCard"
import { Product } from "../../types"
import ProductModal from "./ProductModal"

export default async function ProductSection({ productId, product }: { productId: string, product: Product }) {
    return(
        <div className='md:h-[160vh] flex flex-col justify-center'>
            <ProductCard productId={productId} product={product}/>
            {/* <ProductModal/> */}
        </div>
    )
}