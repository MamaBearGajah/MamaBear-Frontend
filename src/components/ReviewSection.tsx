import ReviewCard from "./ReviewCard"
import ReviewModal from "./ReviewModal"
import Search from "./Search"
export default async function ReviewSection() {
    return(
        <div>
            Review Section
            <Search/>
            <ReviewCard/>
            <ReviewModal/>
        </div>
    )
    }