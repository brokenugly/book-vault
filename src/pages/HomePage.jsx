import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Star, Users, Library } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { GENRES } from '../utils/constants';
import fantasyImg from '@/assets/fantasy.jpg';
import romanceImg from '@/assets/romance.jpg';
import detectiveImg from '@/assets/detective.jpg';
import sciFiImg from '@/assets/sci-fi.jpg';
import classicsImg from '@/assets/classics.jpg';

const GENRE_COVERS = {
  fantasy: fantasyImg,
  romance: romanceImg,
  mystery: detectiveImg,
  science_fiction: sciFiImg,
  classics: classicsImg,
};

const STATS = [
  { icon: BookOpen, label: 'Книг в каталоге', value: '1 млн+' },
  { icon: Users, label: 'Читателей', value: '100 тыс+' },
  { icon: Library, label: 'Жанров', value: '20+' },
];

const HomePage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };
  
  // Genre cards now link to /genres?genre=<value>
  const genreHref = (value) => `/genres?genre=${value}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-background dark:from-orange-950/20 dark:via-background dark:to-background py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Ваш личный книжный каталог
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Открывайте мир <span className="text-primary">книг</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Ищите, сохраняйте и отслеживайте прочитанные книги. Более миллиона книг в каталоге.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Название книги или автор..."
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="shrink-0">Найти</Button>
          </form>

          {/* Quick searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Гарри Поттер', 'Достоевский', 'Мастер и Маргарита'].map((q) => (
              <button
                key={q}
                onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 text-primary" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold">Популярные жанры</h2>
          <Link to="/genres/" className="text-primary text-sm hover:underline">
            Все жанры →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {GENRES.map((genre) => (
            <Link
              key={genre.value}
              to={genreHref(genre.value)}
              className="group relative rounded-xl overflow-hidden aspect-[3/2] bg-muted border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {GENRE_COVERS[genre.value] && (
                <img
                  src={GENRE_COVERS[genre.value]}
                  alt={genre.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity group-hover:scale-105 duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="text-white font-semibold text-sm">{genre.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA for unauthenticated */}
	  {!user && (
		<section className="container mx-auto px-4 pb-12">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-orange-100 dark:from-primary/10 dark:to-orange-950/30 border border-primary/20 p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Начните собирать библиотеку</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Создайте аккаунт, чтобы сохранять книги, ставить оценки и отслеживать прочитанное.
            </p>
            <div className="flex justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/register">Зарегистрироваться</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Войти</Link>
              </Button>
            </div>
          </div>
        </section>
	  )}
    </div>
  );
};

export default HomePage;
