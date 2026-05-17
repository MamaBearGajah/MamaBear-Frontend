export default function Stars({ rating }: { rating: number }){
    const totalStars = 5;
    return(
        <div className="flex gap-1">
            {Array.from({ length: totalStars }).map((_, index) => {
                const starIndex = index + 1;

                return (
                <span key={index}>
                    {starIndex <= rating ? "⭐" : "☆"}
                </span>
                );
            })}
        <div className='ml-3'>{rating}</div>
        
        </div>
    )
}