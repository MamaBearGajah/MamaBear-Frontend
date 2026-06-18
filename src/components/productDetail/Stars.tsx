export default function Stars({ rating }: { rating: number }) {
  const totalStars = 5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: totalStars }).map((_, index) => {
        const starIndex = index + 1;

        return (
          <span key={index} className="text-xs leading-none">
            {starIndex <= rating ? "⭐" : "☆"}
          </span>
        );
      })}
      <div className="ml-1 font-bold">{rating}/5</div>
    </div>
  );
}
