import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

const RatingStars = ({ rating = 0, onRate = null, size = 'md', className }) => {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const isInteractive = typeof onRate === 'function';
  const displayRating = isInteractive ? (hovered || rating) : rating;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={() => isInteractive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          className={cn(
            'transition-transform',
            isInteractive && 'cursor-pointer hover:scale-110',
            !isInteractive && 'cursor-default'
          )}
          onClick={() => isInteractive && onRate(star)}
          onMouseEnter={() => isInteractive && setHovered(star)}
          aria-label={`Оценка ${star} из 5`}
        >
          <Star
            className={cn(
              sizes[size],
              displayRating >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
