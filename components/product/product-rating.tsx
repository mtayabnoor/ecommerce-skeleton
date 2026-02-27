import { Star } from 'lucide-react';

function Rating({ rating, numReviews }: { rating: number | string; numReviews: number }) {
  const numericRating = Number(rating) || 0;
  const percentage = (numericRating / 5) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-[100px]">
        {/* Empty stars */}
        <div className="flex text-muted-foreground/30">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} className="fill-muted-foreground/20 shrink-0" />
          ))}
        </div>
        {/* Filled stars overlay */}
        <div
          className="flex absolute top-0 left-0 overflow-hidden text-amber-500"
          style={{ width: `${percentage}%` }}
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} className="fill-amber-500 shrink-0" />
          ))}
        </div>
      </div>
      <span className="text-sm text-muted-foreground">
        {numericRating.toFixed(1)} ({numReviews} {numReviews === 1 ? 'review' : 'reviews'}
        )
      </span>
    </div>
  );
}

export { Rating };
