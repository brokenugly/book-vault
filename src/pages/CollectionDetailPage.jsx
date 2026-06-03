import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import BookCard from '../components/common/BookCard';
import { useAuth } from '../hooks/useAuth';
import { checkUserCollection, addUserCollection, removeUserCollection } from '../services/firestore';
import { getCollectionBySlug } from '../constants/staticCollections';

const CollectionDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const collection = getCollectionBySlug(slug);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !slug) return;
    checkUserCollection(user.uid, slug)
      .then(setSaved)
      .catch(() => {});
  }, [user, slug]);

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Подборка не найдена.</p>
        <Button variant="outline" asChild>
          <Link to="/collections">← Все подборки</Link>
        </Button>
      </div>
    );
  }

  const handleToggle = async () => {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    try {
      if (saved) {
        await removeUserCollection(user.uid, slug);
        setSaved(false);
      } else {
        await addUserCollection(user.uid, slug);
        setSaved(true);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  // Shape books to match BookCard expected format
  const shapedBooks = collection.books.map((b) => ({
    id: b.bookId,
    title: b.title,
    authors: [b.author],
    thumbnail: b.thumbnail,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-5xl select-none shrink-0 mt-1">{collection.emoji}</div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{collection.title}</h1>
            <p className="text-muted-foreground mt-1 max-w-xl">{collection.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <BookOpen className="w-4 h-4.5 inline mr-1" />
              {collection.books.length} книги
            </p>
          </div>
        </div>

        <Button
          variant={saved ? 'secondary' : 'default'}
          className="gap-2 shrink-0"
          onClick={handleToggle}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          {saved ? 'Убрать из профиля' : 'Добавить в профиль'}
        </Button>
      </div>

      {/* Book list — descriptions + cards */}
      <div className="space-y-6 mb-10">
        {collection.books.map((book) => (
          <div key={book.bookId} className="flex gap-4 p-4 border rounded-xl bg-card">
            <Link to={`/book/${book.bookId}`} className="shrink-0">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-md border"
                />
              ) : (
                <div className="w-20 h-28 bg-muted rounded-md flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-muted-foreground opacity-40" />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/book/${book.bookId}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {book.title}
              </Link>
              <p className="text-sm text-muted-foreground mt-0.5">{book.author}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <h2 className="font-semibold text-lg mb-4">Все книги подборки</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shapedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetailPage;
