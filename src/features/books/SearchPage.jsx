import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import BookCard from '../../components/common/BookCard';
import { searchBooks } from '../../services/openLibrary';

const BOOKS_PER_PAGE = 20;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [inputValue, setInputValue] = useState(queryParam);
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentPage = pageParam;
  const totalPages = Math.ceil(Math.min(totalItems, 600) / BOOKS_PER_PAGE);

  const doSearch = useCallback(async () => {
    if (!queryParam) return;
    setLoading(true);
    setError('');
    try {
      const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
      const result = await searchBooks(queryParam, startIndex);
      setBooks(result.books);
      setTotalItems(result.totalItems);
    } catch (err) {
      setError('Не удалось выполнить поиск. Проверьте соединение и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  }, [queryParam, currentPage]);

  useEffect(() => {
    setInputValue(queryParam);
    doSearch();
  }, [queryParam, currentPage, doSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const goToPage = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/search?q=${encodeURIComponent(queryParam)}&page=${page}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Найти книгу или автора..."
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading}>Найти</Button>
      </form>

      {/* Title */}
      {queryParam && (
        <div className="mb-4 flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">
            Результаты для: <span className="text-primary">«{queryParam}»</span>
          </h1>
          {!loading && totalItems > 0 && (
            <span className="text-sm text-muted-foreground">
              ~{totalItems.toLocaleString()} кн.
            </span>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && books.length === 0 && queryParam && (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground">Ничего не найдено по запросу «{queryParam}»</p>
          <p className="text-sm text-muted-foreground mt-1">Попробуйте другой запрос</p>
        </div>
      )}

      {/* No query */}
      {!queryParam && !loading && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground">Введите запрос для поиска книг</p>
        </div>
      )}

      {/* Grid */}
      {!loading && books.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </Button>
              <span className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="gap-1"
              >
                Вперёд <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
