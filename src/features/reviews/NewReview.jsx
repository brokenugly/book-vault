import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Bold, Italic, Quote, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import RatingStars from '../../components/common/RatingStars';
import { useAuth } from '../../hooks/useAuth';
import { addReview, checkUserReview } from '../../services/firestore';
import { sanitizeReviewHtml } from '../../utils/sanitize';

// ─── Rich-text toolbar ───

const TOOLBAR_ACTIONS = [
  { icon: Bold, tag: 'b', title: 'Жирный' },
  { icon: Italic, tag: 'i', title: 'Курсив' },
  { icon: Quote, tag: 'blockquote', title: 'Цитата' },
  { icon: EyeOff, tag: 'spoiler', title: 'Спойлер' },
];

const FormattingToolbar = ({ textareaRef, value, onChange }) => {
  const wrapSelection = (tag) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const selected = value.slice(start, end);
    const open  = `<${tag}>`;
    const close = `</${tag}>`;
    const newVal =
      value.slice(0, start) + open + selected + close + value.slice(end);
    onChange(newVal);
    // Restore cursor after re-render
    setTimeout(() => {
      const newCursor = start + open.length + selected.length + close.length;
      el.setSelectionRange(newCursor, newCursor);
      el.focus();
    }, 0);
  };

  return (
    <div className="flex items-center gap-1 p-1.5 border-b bg-muted/50 rounded-t-md">
      {TOOLBAR_ACTIONS.map(({ icon: Icon, tag, title }) => (
        <button
          key={tag}
          type="button"
          title={title}
          onClick={() => wrapSelection(tag)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent
                     text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold"
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
      <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
        Выделите текст и нажмите кнопку форматирования
      </span>
    </div>
  );
};

// ─── Main Page ───

const NewReview = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [checking,  setChecking]  = useState(true);   // loading existing review check
  const [duplicate, setDuplicate] = useState(false);  // already has a review

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shortId, setShortId] = useState('');
  
  // Check if user already wrote a review for this book
  useEffect(() => {
    if (!user) { setChecking(false); return; }
    checkUserReview(user.uid, bookId).then((existing) => {
      if (existing) setDuplicate(true);
      setChecking(false);
    });
  }, [user, bookId]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Войдите, чтобы написать рецензию.</p>
        <Button asChild>
          <Link to="/login">Войти</Link>
        </Button>
      </div>
    );
  }
  
  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  if (duplicate) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <AlertCircle className="w-14 h-14 text-orange-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Вы уже написали рецензию</h2>
        <p className="text-muted-foreground mb-6">
          На каждую книгу можно написать только одну рецензию. Найдите свою рецензию
          на странице всех рецензий и удалите её, если хотите написать новую.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to={`/book/${bookId}`}>← К книге</Link>
          </Button>
          <Button asChild>
            <Link to={`/book/${bookId}/reviews`}>Все рецензии</Link>
          </Button>
        </div>
      </div>
    );
  }

  const validate = () => {
    if (rating === 0) return 'Поставьте оценку книге';
    if (!title.trim()) return 'Введите заголовок рецензии';
    if (text.trim().length < 20) return 'Текст рецензии слишком короткий (минимум 20 символов)';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const cleanText = sanitizeReviewHtml(text);
      const result = await addReview({
        bookId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Читатель',
        rating,
        title: title.trim(),
        text: cleanText,
      });
      setShortId(result.shortId);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Не удалось сохранить рецензию');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2x1 font-bold mb-2">Рецензия отправлена!</h2>
        
        <Button asChild>
          <Link to={`/book/${bookId}`}>← Вернуться к книге</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1">
        <ArrowLeft className="w-4 h-4" /> Назад
      </Button>

      <h1 className="text-2xl font-bold mb-6">Написать рецензию</h1>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Rating */}
        <div className="space-y-2">
          <Label>
            Оценка <span className="text-destructive">*</span>
          </Label>
          <RatingStars rating={rating} onRate={setRating} size="lg" />
          <p className="text-xs text-muted-foreground">
            {rating === 0 && 'Выберите оценку'}
            {rating === 1 && 'Ужасно'}
            {rating === 2 && 'Плохо'}
            {rating === 3 && 'Нормально'}
            {rating === 4 && 'Хорошо'}
            {rating === 5 && 'Отлично!'}
          </p>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="review-title">
            Заголовок <span className="text-destructive">*</span>
          </Label>
          <Input
            id="review-title"
            placeholder="Кратко о впечатлении..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            disabled={loading}
          />
          <p className="text-xs text-right text-muted-foreground">{title.length}/120</p>
        </div>

        {/* Text with toolbar */}
        <div className="space-y-1.5">
          <Label htmlFor="review-text">
            Текст рецензии <span className="text-destructive">*</span>
          </Label>
          <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <FormattingToolbar
              textareaRef={textareaRef}
              value={text}
              onChange={setText}
            />
            <textarea
              id="review-text"
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Поделитесь своими впечатлениями о книге..."
              rows={12}
              disabled={loading}
              className="w-full px-3 py-2 text-sm bg-background text-foreground
                         placeholder:text-muted-foreground outline-none resize-y min-h-[200px]"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Используйте кнопки выше для форматирования. Теги: &lt;b&gt;, &lt;i&gt;, &lt;blockquote&gt;, &lt;spoiler&gt;
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Опубликовать рецензию
        </Button>
      </form>
    </div>
  );
};

export default NewReview;
