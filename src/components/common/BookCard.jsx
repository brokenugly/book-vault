import { Link } from 'react-router-dom';
import { BookOpen, BookText } from 'lucide-react';
import RatingStars from './RatingStars';
import { cn } from '../../lib/utils';

const BookCard = ({ book, className }) => {
  const { id, title, authors, thumbnail, userRating, ia_id, has_fulltext } = book;
  const canRead = !!(ia_id && has_fulltext);

  return (
    <Link
      to={`/book/${id}`}
	  state={{ ia_id: ia_id || null }}
      className={cn(
        'group flex flex-col rounded-lg border bg-card text-card-foreground overflow-hidden',
        'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground px-4 text-center">
            <BookOpen className="w-10 h-10 opacity-40" />
            <span className="text-xs line-clamp-3 font-medium">{title}</span>
          </div>
        )}
		
		{/* "Read online" badge */}
        {canRead && (
          <div className="absolute top-2 right-2 bg-green-600/90 text-white text-[10px] font-semibold
                          rounded-full px-1.5 py-0.5 flex items-center gap-1 backdrop-blur-sm">
            <BookText className="w-2.5 h-2.5" />
            Читать
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {Array.isArray(authors) ? authors.join(', ') : authors}
        </p>
        {userRating != null && userRating > 0 && (
          <div className="mt-auto pt-1">
            <RatingStars rating={userRating} size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
