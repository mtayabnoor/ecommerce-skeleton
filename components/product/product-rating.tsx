import { Star } from 'lucide-react';

// I added 'string' to the rating type just in case your Prisma
// Decimal-to-string conversion from earlier is passing strings here!
function Rating({ rating, numReviews }: { rating: number | string; numReviews: number }) {
  // Ensure it's a number for the math to work safely
  const numericRating = Number(rating) || 0;
  const percentage = (numericRating / 5) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-[100px]">
        {/* Gray background stars */}
        <div className="flex text-gray-300">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              // Added fill so they look like empty stars, and shrink-0 to prevent squishing
              className="fill-gray-300 shrink-0"
            />
          ))}
        </div>

        {/* Yellow overlay stars */}
        <div
          className="flex absolute top-0 left-0 overflow-hidden text-yellow-500"
          style={{ width: `${percentage}%` }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              // shrink-0 is the secret sauce here!
              className="fill-yellow-500 shrink-0"
            />
          ))}
        </div>
      </div>

      <span className="text-sm text-gray-600">
        {numericRating.toFixed(1)} ({numReviews} reviews)
      </span>
    </div>
  );
}

export { Rating };
