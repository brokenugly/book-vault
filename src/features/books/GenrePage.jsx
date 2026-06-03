import { useState, useEffect, useCallback} from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, BookOpen, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import BookCard from '../../components/common/BookCard';
import FlagIcon from '../../components/common/FlagIcon';
import { searchByGenre, searchBooks } from '../../services/openLibrary';
import {
  ALL_GENRES,
  SHORT_GENRES,
  EXTENDED_GENRES,
  SUBJECT_TO_LABEL,
  LANGUAGE_OPTIONS,
  urlCodeToOlCode,
} from '../../constants/genreMap';
import { cn } from '../../lib/utils';

const BOOKS_PER_PAGE = 20;

// ─── Sidebar ───

const GenreList = ({ selected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? ALL_GENRES : SHORT_GENRES;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Жанр
      </p>

      {/* None option */}
      <button
        onClick={() => onSelect('')}
        className={cn(
          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
          !selected
            ? 'bg-primary text-primary-foreground font-medium'
            : 'hover:bg-accent'
        )}
      >
        Все книги
      </button>

      {visible.map((g) => (
        <button
          key={g.subject}
          onClick={() => onSelect(g.subject)}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
            selected === g.subject
              ? 'bg-primary text-primary-foreground font-medium'
              : 'hover:bg-accent'
          )}
        >
          {g.label}
        </button>
      ))}

      {/* Expand/collapse */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="mt-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-primary
                   border border-primary/30 hover:bg-primary/10 transition-colors"
      >
        {expanded ? 'Скрыть' : 'Показать больше'}
      </button>
    </div>
  );
};

const LangFilter = ({ selected, onToggle }) => (
  <div className="mt-6">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
      Язык
    </p>
    <div className="flex flex-col gap-1">
      {LANGUAGE_OPTIONS.map((lang) => {
        const checked = selected.includes(lang.code);
        return (
          <label
            key={lang.code}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
              checked ? 'bg-primary/10 font-medium' : 'hover:bg-accent'
            )}
          >
            <input
              type="checkbox"
              className="accent-primary"
              checked={checked}
              onChange={() => onToggle(lang.code)}
            />
            <FlagIcon code={lang.code} />
            <span>{lang.label}</span>
          </label>
        );
      })}
    </div>
  </div>
);

// ─── Main Page ───

const GenrePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Derive state from URL
  const genreParam = searchParams.get('genre') || '';
  const langParams  = searchParams.getAll('lang');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const totalPages = Math.ceil(Math.min(totalItems, 600) / BOOKS_PER_PAGE);
  // Convert 2-letter URL codes → 3-letter OL codes for API calls
  const olLangCodes = langParams
    .map((c) => urlCodeToOlCode[c])
    .filter(Boolean);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const startIndex = (pageParam - 1) * BOOKS_PER_PAGE;
      const options = { langRestrict: olLangCodes };
      let result;
      if (genreParam) {
        result = await searchByGenre(genreParam, startIndex, options);
      } else {
		const baseQuery = 'subject:fiction';
        result = await searchBooks(baseQuery, startIndex, options);
      }
      setBooks(result.books);
      setTotalItems(result.totalItems);
    } catch {
      setError('Не удалось загрузить книги. Проверьте соединение и попробуйте снова.');
    } finally {
	  setLoading(false);
    }
  }, [genreParam, olLangCodes.join(','), pageParam]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
	fetchBooks();
  }, [fetchBooks]);

// ── URL helpers ───
  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    if ('genre' in updates) {
      if (updates.genre) next.set('genre', updates.genre);
      else next.delete('genre');
    }
    if ('langs' in updates) {
      next.delete('lang');
      updates.langs.forEach((l) => next.append('lang', l));
    }
    if ('page' in updates) {
      if (updates.page > 1) next.set('page', String(updates.page));
      else next.delete('page');
    } else {
      next.delete('page'); // reset page on filter change
    }
    setSearchParams(next, { replace: true });
  };

  const handleGenreSelect = (subject) => {
    updateParams({ genre: subject });
    setMobileFiltersOpen(false);
  };

  const handleLangToggle = (code) => {
    const next = langParams.includes(code)
      ? langParams.filter((l) => l !== code)
      : [...langParams, code];
    updateParams({ langs: next });
  };

  // ── Page title ──
  const pageTitle = genreParam ? (SUBJECT_TO_LABEL[genreParam] || genreParam) : 'Все книги';

  const sidebarContent = (
    <div className="p-4">
      <GenreList selected={genreParam} onSelect={handleGenreSelect} />
      <LangFilter selected={langParams} onToggle={handleLangToggle} />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          {!loading && totalItems > 0 && (
            <p className="text-sm text-muted-foreground">
              ~{totalItems.toLocaleString()} книг
              
            </p>
          )}
        </div>
		
      {/* Mobile filter toggle */}
        <Button
          variant="outline"
          size="sm"
          className="md:hidden gap-1.5"
          onClick={() => setMobileFiltersOpen((p) => !p)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
          {(genreParam || langParams.length > 0) && (
            <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Layout: sidebar + content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="border rounded-xl bg-card sticky top-20">
            {sidebarContent}
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="relative ml-auto w-72 max-h-full overflow-y-auto bg-background border-l z-50">
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background">
                <span className="font-semibold">Фильтры</span>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && !loading && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
              {error}
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground">Книги не найдены</p>
              <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить фильтры</p>
            </div>
          )}

          {!loading && books.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateParams({ page: pageParam - 1 })}
                    disabled={pageParam <= 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Назад
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {pageParam} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateParams({ page: pageParam + 1 })}
                    disabled={pageParam >= totalPages}
                    className="gap-1"
                  >
                    Вперёд <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
