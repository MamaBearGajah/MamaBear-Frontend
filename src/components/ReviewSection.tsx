import ReviewCard from "./ReviewCard"
import ReviewModal from "./ReviewModal"
import Search from "./Search"
import ProductDetailNav from "./ProductDetailNav"
export default async function ReviewSection() {
    return(
        <div className='border h-[20vh] md:h-[40vh] flex flex-col justify-center items-center'>
            Review Section
            <ProductDetailNav/>
            <ReviewCard/>
            <ReviewModal/>
        </div>
    )
    }