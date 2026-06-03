import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Trash2, Pencil, Loader2, BookMarked, Bookmark, FlaskConical, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import RatingStars from '../../components/common/RatingStars';
import { useAuth } from '../../hooks/useAuth';
import {
  getUserBooks, updateUserBook, deleteUserBook,
  getUserCollections, removeUserCollection,
  getUserTests, getReviewsByUser, deleteReview,
} from '../../services/firestore';
import { BOOK_STATUSES, STATUS_TABS } from '../../utils/constants';
import { STATIC_COLLECTIONS } from '../../constants/staticCollections';
import { TESTS_LIST } from '../../constants/testsData';

// ─── Book row ───

const BookRow = ({ book, onStatusChange, onRatingChange, onNoteEdit, onDelete }) => (
  <div className="flex gap-3 p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow">
    <Link to={`/book/${book.bookId}`} className="shrink-0">
      {book.thumbnail ? (
        <img src={book.thumbnail} alt={book.title} className="w-12 h-16 object-cover rounded" />
      ) : (
        <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </Link>
    <div className="flex-1 min-w-0">
      <Link to={`/book/${book.bookId}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
        {book.title}
      </Link>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">
        {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Select value={book.status} onValueChange={(v) => onStatusChange(book, v)}>
          <SelectTrigger className="h-7 text-xs w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(BOOK_STATUSES).map(([val, lbl]) => (
              <SelectItem key={val} value={val} className="text-xs">{lbl}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <RatingStars rating={book.userRating || 0} onRate={(r) => onRatingChange(book, r)} size="sm" />
      </div>
      {book.userNote && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">«{book.userNote}»</p>
      )}
    </div>
    <div className="flex flex-col gap-1 shrink-0">
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onNoteEdit(book)}>
        <Pencil className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(book)}>
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  </div>
);

// ─── Main Profile ───

const Profile = () => {
  const { user } = useAuth();
  const [books,       setBooks]       = useState([]);
  const [collections, setCollections] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [reviews,     setReviews]     = useState([]);
  const [deletingReview, setDeletingReview] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  const [editingBook, setEditingBook] = useState(null);
  const [noteValue,   setNoteValue]   = useState('');
  const [savingNote,  setSavingNote]  = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [booksData, collectionsData, testsData, reviewsData] = await Promise.all([
        getUserBooks(user.uid),
        getUserCollections(user.uid),
        getUserTests(user.uid).catch(() => []),
        getReviewsByUser(user.uid).catch(() => []),
      ]);
      setBooks(booksData);
      setCollections(collectionsData);
      setTestResults(testsData);
      setReviews(reviewsData);
    } catch {
      setError('Не удалось загрузить данные профиля');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusChange = async (book, newStatus) => {
    try {
      await updateUserBook(book.id, { status: newStatus });
      setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, status: newStatus } : b));
    } catch { setError('Не удалось обновить статус'); }
  };

  const handleRatingChange = async (book, newRating) => {
    try {
      await updateUserBook(book.id, { userRating: newRating });
      setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, userRating: newRating } : b));
    } catch { setError('Не удалось обновить оценку'); }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Удалить «${book.title}» из коллекции?`)) return;
    try {
      await deleteUserBook(book.id);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
    } catch { setError('Не удалось удалить книгу'); }
  };

  const openNoteEditor = (book) => { setEditingBook(book); setNoteValue(book.userNote || ''); };
  const saveNote = async () => {
    if (!editingBook) return;
    setSavingNote(true);
    try {
      await updateUserBook(editingBook.id, { userNote: noteValue });
      setBooks((prev) => prev.map((b) => b.id === editingBook.id ? { ...b, userNote: noteValue } : b));
      setEditingBook(null);
    } catch { setError('Не удалось сохранить заметку'); }
    finally { setSavingNote(false); }
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm('Удалить рецензию?')) return;
    setDeletingReview(review.id);
    try {
      await deleteReview(review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch {} finally { setDeletingReview(null); }
  };

    const handleRemoveCollection = async (slug) => {
    try {
      await removeUserCollection(user.uid, slug);
      setCollections((prev) => prev.filter((c) => c.collectionSlug !== slug));
    } catch {}
  };

  const booksByStatus = (status) => books.filter((b) => b.status === status);
  const stats = {
    total:    books.length,
    reading:  booksByStatus('reading').length,
    read:     booksByStatus('read').length,
    willRead: booksByStatus('willRead').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
            : <User className="w-8 h-8 text-primary" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.displayName || 'Пользователь'}</h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Всего книг',        value: stats.total    },
          { label: 'Читаю',             value: stats.reading  },
          { label: 'Прочитано',         value: stats.read     },
          { label: 'Хочу прочитать',    value: stats.willRead },
        ].map(({ label, value }) => (
          <div key={label} className="border rounded-lg p-4 bg-card text-center">
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* ── Books Tabs ── */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary" /> Моя библиотека
            </h2>
            {books.length === 0 ? (
              <div className="text-center py-10">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground">Ваша коллекция пуста</p>
                <Button className="mt-4" asChild>
                  <Link to="/genres">Найти книги</Link>
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="reading">
                <TabsList className="mb-4 flex flex-wrap h-auto gap-1">
                  {STATUS_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                      <span className="ml-1.5 text-xs opacity-60">({booksByStatus(tab.value).length})</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {STATUS_TABS.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {booksByStatus(tab.value).length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground text-sm">Нет книг в этой категории</p>
                    ) : (
                      <div className="space-y-3">
                        {booksByStatus(tab.value).map((book) => (
                          <BookRow
                            key={book.id}
                            book={book}
                            onStatusChange={handleStatusChange}
                            onRatingChange={handleRatingChange}
                            onNoteEdit={openNoteEditor}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </section>


          {/* ── My Reviews ── */}
          <section className="mb-10 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Мои рецензии
              {reviews.length > 0 && <span className="text-sm font-normal text-muted-foreground">({reviews.length})</span>}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Вы ещё не написали ни одной рецензии.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 p-4 border rounded-xl bg-card group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/book/${review.bookId}/reviews?reviewId=${review.shortId || ''}`}
                            className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                          >
                            {review.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <RatingStars rating={review.rating} size="sm" />
                            <Link to={`/book/${review.bookId}`} className="text-xs text-primary hover:underline">к книге →</Link>
                            
                          </div>
                          {review.createdAt && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {review.createdAt?.toDate
                                ? format(review.createdAt.toDate(), 'd MMM yyyy', { locale: ru })
                                : review.createdAt?.seconds
                                ? format(new Date(review.createdAt.seconds * 1000), 'd MMM yyyy', { locale: ru })
                                : ''}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteReview(review)}
                          disabled={deletingReview === review.id}
                        >
                          {deletingReview === review.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── My Collections ── */}
          <section className="mb-10 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" /> Мои подборки
            </h2>
            {collections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>Вы пока не добавили ни одной подборки.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/collections">Перейти к подборкам</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collections.map((c) => {
                  const meta = STATIC_COLLECTIONS.find((s) => s.slug === c.collectionSlug);
                  if (!meta) return null;
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                      <span className="text-2xl select-none">{meta.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <Link to={`/collections/${meta.slug}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                          {meta.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">{meta.books.length} книги</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemoveCollection(c.collectionSlug)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── My Tests ── */}
          <section className="pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" /> Пройденные тесты
            </h2>
            {testResults.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Вы ещё не прошли ни одного теста.{' '}
                <Link to="/tests" className="text-primary hover:underline">Попробуйте!</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {testResults.map((r) => {
                  const meta = TESTS_LIST.find((t) => t.id === r.testId);
                  const date = r.completedAt?.toDate
                    ? r.completedAt.toDate()
                    : r.completedAt?.seconds
                    ? new Date(r.completedAt.seconds * 1000)
                    : null;
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                      <span className="text-xl select-none">{meta?.emoji || '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{meta?.title || r.testId}</p>
                        {date && (
                          <p className="text-xs text-muted-foreground">
                            {format(date, 'd MMM yyyy', { locale: ru })}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-primary shrink-0">
                        {r.score}/{r.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* Note Dialog */}
      <Dialog open={!!editingBook} onOpenChange={(open) => !open && setEditingBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать заметку</DialogTitle>
          </DialogHeader>
          {editingBook && <p className="text-sm text-muted-foreground truncate">«{editingBook.title}»</p>}
          <div className="space-y-2">
            <Label>Заметка</Label>
            <Textarea value={noteValue} onChange={(e) => setNoteValue(e.target.value)} placeholder="Ваши мысли о книге..." rows={5} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingBook(null)}>Отмена</Button>
            <Button onClick={saveNote} disabled={savingNote}>
              {savingNote && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
