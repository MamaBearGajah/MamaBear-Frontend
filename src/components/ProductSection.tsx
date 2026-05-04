import ProductCard from "./ProductCard"
import ProductModal from "./ProductModal"

export default async function ProductSection({ productId }: { productId: number }) {
    return(
        <div>
            Product Section
            <ProductCard/>

            <ProductModal/>
        </div>
    )
}