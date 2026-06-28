export default function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Number.isNaN(rating) ? 0 : rating));
  const rounded = Math.round(clamped * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded % 1 !== 0;

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${clamped} out of 5`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => {
          if (index < fullStars) {
            return (
              <span key={`star-${index}`} className="text-xs leading-none text-[#F4A300]">
                ★
              </span>
            );
          }

          if (index === fullStars && hasHalfStar) {
            return (
              <span
                key={`star-${index}`}
                className="text-xs leading-none relative inline-block text-[#E3D7D1]"
              >
                ★
                <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden text-[#F4A300]">
                  ★
                </span>
              </span>
            );
          }

          return (
            <span key={`star-${index}`} className="text-xs leading-none text-[#E3D7D1]">
              ★
            </span>
          );
        })}
      </span>
      <div className="ml-1 font-bold">{clamped}/5</div>
    </div>
  );
}
