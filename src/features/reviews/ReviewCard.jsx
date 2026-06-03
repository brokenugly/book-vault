import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import RatingStars from '../../components/common/RatingStars';
import { renderReviewHtml } from '../../utils/sanitize';

/**
 * Renders a single review card.
 * `compact` — shorter version used on the book page (title only, no full text)
 */
const ReviewCard = ({ review, compact = false, id }) => {
  const date = review.createdAt?.toDate
    ? review.createdAt.toDate()
    : review.createdAt?.seconds
    ? new Date(review.createdAt.seconds * 1000)
    : null;

  const formattedDate = date
    ? format(date, 'd MMMM yyyy', { locale: ru })
    : '';

  return (
    <div
      id={id}
      className="relative border rounded-xl bg-card p-5 space-y-3 hover:shadow-sm transition-shadow"
    >
      {/* Short ID badge */}
      {review.shortId && (
        <span className="absolute top-3 right-3 text-[14px] text-muted-foreground font-mono">
          #{review.shortId}
        </span>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 pr-12">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug">{review.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground">{review.userName}</span>
            {formattedDate && (
              <span className="text-xs text-muted-foreground">· {formattedDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      {!compact && review.text && (
        <div
          className="text-sm text-muted-foreground leading-relaxed review-text"
          dangerouslySetInnerHTML={{ __html: renderReviewHtml(review.text) }}
        />
      )}
    </div>
  );
};

export default ReviewCard;
