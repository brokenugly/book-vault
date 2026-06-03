import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Calendar, Hash, Globe, Loader2,
  Plus, Check, ExternalLink, BookMarked, BookText, X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import RatingStars from '../../components/common/RatingStars';
import BookStatusManager from '../userLibrary/BookStatusManager';
import ReviewsSection from '../reviews/ReviewsSection';
import { getBookById, getBookReaderUrl } from '../../services/openLibrary';
import { addUserBook, checkBookExists } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';

// ─── BookReader Modal ───

const BookReaderModal = ({ iaId, title, onClose }) => {
	return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base font-semibold truncate pr-8">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={getBookReaderUrl(iaId)}
            title={`Читать: ${title}`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="px-4 py-2 border-t text-xs text-muted-foreground">
          Книга предоставлена{' '}
          <a
            href={`https://archive.org/details/${iaId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Internet Archive
          </a>
          . Доступность зависит от авторских прав.
        </div>
      </DialogContent>
    </Dialog>
	);
};

const MetaItem = ({ icon: Icon, label, value, truncate = false }) => (
  <div className="flex items-start gap-2 text-sm">
    <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`font-medium ${truncate ? 'line-clamp-1' : ''}`}>{value}</p>
    </div>
  </div>
);

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [userBook, setUserBook] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  
  // Reader
  const [readerOpen, setReaderOpen]     = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  
  // ── Also keep track of the ia_id that may come via navigation state
  // (passed from BookCard via search results which carry ia_id)
  const locationState = window.history.state?.usr || {};
  
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBookById(id);
		// If search result had ia_id (passed via router state), merge it
        if (locationState.ia_id && !data.ia_id) {
          data.ia_id = locationState.ia_id;
          data.has_fulltext = true;
        }
        setBook(data);
      } catch {
        setError('Книга не найдена или произошла ошибка загрузки.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkExists = async () => {
      if (!user || !id) return;
      const existing = await checkBookExists(user.uid, id);
      setUserBook(existing);
    };
    checkExists();
  }, [user, id]);

  const handleAddToCollection = async () => {
    if (!user) { navigate('/login'); return; }
    if (!book) return;
    setAdding(true);
    setAddError('');
    try {
      const docId = await addUserBook(user.uid, {
        bookId: book.id,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
        status: 'willRead',
        userRating: null,
        userNote: '',
      });
      setUserBook({
        id: docId,
        bookId: book.id,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
        status: 'willRead',
        userRating: null,
        userNote: '',
      });
    } catch {
      setAddError('Не удалось добавить книгу. Попробуйте снова.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
        <p className="text-muted-foreground mb-4">{error || 'Книга не найдена'}</p>
      </div>
    );
  }

  const desc = book.description?.replace(/<[^>]*>/g, '') || '';
  const shortDesc = desc.slice(0, 250);
  const hasMore = desc.length > 250;
  // Effective ia_id: from book object or location state
  const iaId = book.ia_id || locationState.ia_id || null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Cover & Actions */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="w-48 md:w-full max-w-[280px] rounded-lg overflow-hidden border shadow-md">
            {book.thumbnail ? (
              <img src={book.thumbnail} alt={book.title} className="w-full object-cover" />
            ) : (
              <div className="aspect-[2/3] bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground p-6 text-center">
                <BookOpen className="w-12 h-12 opacity-40" />
                <span className="text-sm">{book.title}</span>
              </div>
            )}
          </div>

          {/* Add to Collection */}
          {userBook ? (
            <div className="w-full">
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-3 font-medium">
                <Check className="w-4 h-4" />
                В вашей коллекции
              </div>
              <BookStatusManager
                userBook={userBook}
                onUpdate={setUserBook}
              />
            </div>
          ) : (
            <div className="w-full space-y-2">
              <Button
                className="w-full gap-2"
                onClick={handleAddToCollection}
                disabled={adding}
              >
                {adding
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Plus className="w-4 h-4" />}
                {user ? 'Добавить в коллекцию' : 'Войдите, чтобы добавить'}
              </Button>
              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">Войдите</Link>
                  {' '}или{' '}
                  <Link to="/register" className="text-primary hover:underline">зарегистрируйтесь</Link>
                </p>
              )}
              {addError && (
                <p className="text-xs text-destructive">{addError}</p>
              )}
            </div>
          )}
		  
		  {/* ── Read button (Internet Archive) ── */}
          {iaId && (
            <Button
              variant="default"
              className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setReaderOpen(true)}
            >
              <BookText className="w-4 h-4" />
              Читать онлайн
            </Button>
          )}

          {/* Open Library link */}
          <a
            href={book.previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Library
            </Button>
          </a>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{book.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">
              {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
            </p>
          </div>

          {/* Read badge */}
          {iaId && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                <BookMarked className="w-3 h-3" />
                Доступна для чтения
              </Badge>
            </div>
          )}

          {/* Categories */}
          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {book.publishedDate && (
              <MetaItem icon={Calendar} label="Год" value={book.publishedDate.slice(0, 4)} />
            )}
            {book.pageCount && (
              <MetaItem icon={BookOpen} label="Страниц" value={book.pageCount} />
            )}
            {book.publisher && (
              <MetaItem icon={Hash} label="Издатель" value={book.publisher} truncate />
            )}
            {book.language?.length > 0 && (
              <MetaItem
                icon={Globe}
                label="Язык"
                value={book.language.join(', ').toUpperCase()}
              />
            )}
            {book.isbn && (
              <MetaItem icon={Hash} label="ISBN" value={book.isbn} />
            )}
          </div>

          {/* Description */}
          {desc && (
            <div>
              <h2 className="font-semibold mb-2">Описание</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {descExpanded ? desc : shortDesc}
                {!descExpanded && hasMore && '...'}
              </p>
              {hasMore && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-primary text-sm mt-2 hover:underline"
                >
                  {descExpanded ? 'Свернуть' : 'Читать полностью'}
                </button>
              )}
            </div>
          )}
		  {/* Reviews section */}
          <ReviewsSection bookId={id} />
        </div>
      </div>
	  {/* BookReader Modal */}
      {readerOpen && iaId && (
        <BookReaderModal
          iaId={iaId}
          title={book.title}
          onClose={() => setReaderOpen(false)}
        />
      )}
    </div>
  );
};

export default BookDetails;
