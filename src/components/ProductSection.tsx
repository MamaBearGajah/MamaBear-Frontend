import ProductCard from "./ProductCard"
import ProductModal from "./ProductModal"

export default async function ProductSection({ productId }: { productId: number }) {
    return(
        <div className='border h-[20vh] md:h-[40vh] flex flex-col justify-center'>
            Product Section
            <ProductCard/>

            <ProductModal/>
        </div>
    )
}