import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export default function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = rating >= index + 1 - 0.25;
        return (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              filled
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-amber-200",
            )}
          />
        );
      })}
    </div>
  );
}
