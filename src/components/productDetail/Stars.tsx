export default function Stars({ rating }: { rating: number }){
    const totalStars = 5;
    return(
        <div className="flex gap-1">
            {Array.from({ length: totalStars }).map((_, index) => {
                const starIndex = index + 1;

                return (
                <span key={index} className='text-xs'>
                    {starIndex <= rating ? "⭐" : "☆"}
                </span>
                );
            })}
        <div className='ml-2 font-bold'>{rating}/5</div>
        
        </div>
    )
}