import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageSquare, PenLine, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import ReviewCard from './ReviewCard';
import { getReviewsByBook, deleteReview } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';

const AllReviews = () => {
  const { bookId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const targetShortId = searchParams.get('reviewId');
  const cardRefs = useRef({});

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getReviewsByBook(bookId);
        setReviews(data);
      } catch {
        setError('Не удалось загрузить рецензии');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [bookId]);

  // Scroll to target review after data loads
  useEffect(() => {
    if (!targetShortId || loading) return;
    const el = cardRefs.current[targetShortId];
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
  }, [targetShortId, loading]);
  
  const handleDelete = async (review) => {
    if (!window.confirm('Удалить вашу рецензию?')) return;
    setDeleting(review.id);
    try {
      await deleteReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch {} finally { setDeleting(null); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-4 gap-1">
        <Link to={`/book/${bookId}`}>
          <ArrowLeft className="w-4 h-4" /> К книге
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Рецензии
        </h1>
        <Button asChild size="sm" className="gap-1.5">
          <Link to={user ? `/book/${bookId}/reviews/new` : '/login'}>
            <PenLine className="w-4 h-4" />
            Написать рецензию
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-4" />
          <p className="text-muted-foreground">Пока нет рецензий.</p>
          <Button className="mt-4" asChild>
            <Link to={user ? `/book/${bookId}/reviews/new` : '/login'}>
              Написать первую рецензию
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => {
		const isOwn = user && review.userId === user.uid;
		return (
            <div
              key={review.id}
              ref={(el) => { if (review.shortId) cardRefs.current[review.shortId] = el; }}
              className={`relative group ${targetShortId && review.shortId === targetShortId ? 'ring-2 ring-primary rounded-xl' : ''}`}
            >
              <ReviewCard review={review} compact={false} />
              {isOwn && (
                <button
                  onClick={() => handleDelete(review)}
                  disabled={deleting === review.id}
                  className="absolute top-20 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded"
                  title="Удалить рецензию"
                >
                  {deleting === review.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllReviews;
