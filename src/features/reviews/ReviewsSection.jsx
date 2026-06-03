import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, PenLine, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import ReviewCard from './ReviewCard';
import { getReviewsByBook, deleteReview } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';

const ReviewsSection = ({ bookId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getReviewsByBook(bookId);
        setReviews(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [bookId]);
  
  const handleDelete = async (review) => {
    if (!window.confirm('Удалить вашу рецензию?')) return;
    setDeleting(review.id);
    try {
      await deleteReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch {} finally { setDeleting(null); }
  };

  const preview = reviews.slice(0, 3);
  const alreadyReviewed = user && reviews.some((r) => r.userId === user.uid);

  return (
    <section className="mt-10 pt-8 border-t">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Рецензии
          {reviews.length > 0 && (
            <span className="text-sm text-muted-foreground font-normal">
              ({reviews.length})
            </span>
          )}
        </h2>
        {/* Hide write button if user already has a review for this book */}
        {!alreadyReviewed && (
          <Button size="sm" variant="outline" asChild className="gap-1.5">
            <Link to={user ? `/book/${bookId}/reviews/new` : '/login'}>
              <PenLine className="w-3.5 h-3.5" /> Написать рецензию
            </Link>
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center py-8 border rounded-xl bg-muted/30">
          <p className="text-muted-foreground text-sm">Пока нет рецензий. Будьте первым!</p>
          <Button className="mt-3" size="sm" asChild>
            <Link to={user ? `/book/${bookId}/reviews/new` : '/login'}>
              Написать рецензию
            </Link>
          </Button>
        </div>
      )}

      {!loading && preview.length > 0 && (
        <>
          <div className="space-y-3">
            {preview.map((review) => {
			const isOwn = user && review.userId === user.uid;
			return (
			<div key={review.id} className="relative group">
              <Link to={`/book/${bookId}/reviews?reviewId=${review.shortId || ''}`} className="block">
                    <ReviewCard review={review} compact />
                  </Link>
                  
                </div>
              );
            })}
          </div>

          {reviews.length > 0 && (
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="gap-1">
                <Link to={`/book/${bookId}/reviews`}>
                  Все рецензии ({reviews.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewsSection;
