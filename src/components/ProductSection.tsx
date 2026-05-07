import ProductCard from "./ProductCard"
import ProductModal from "./ProductModal"

export default async function ProductSection({ productId }: { productId: number }) {
    return(
        <div className='border md:h-[40vh] flex flex-col justify-center'>
            <ProductCard productId={productId}/>
            {/* <ProductModal/> */}
        </div>
    )
}