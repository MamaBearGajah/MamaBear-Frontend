import ProductCard from "./ProductCard"
import ProductModal from "./ProductModal"

export default async function ProductSection({ productId }: { productId: number }) {
    return(
        <div className='md:h-[100vh] flex flex-col justify-center'>
            <ProductCard productId={productId}/>
            {/* <ProductModal/> */}
        </div>
    )
}