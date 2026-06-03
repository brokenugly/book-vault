import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  Sun, Moon, Search, BookOpen, ChevronDown, ChevronUp,
  Menu, X, User, LogOut, Library,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { auth } from '../../services/firebase';
import { GENRES } from '../../utils/constants';
import { cn } from '../../lib/utils';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);
  
  // Single toggle: light → dark → light
  const handleThemeToggle = () => {
    toggleTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Genre nav link: /genres?genre=<value>
  const genreHref = (value) => `/genres?genre=${value}`;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight hidden sm:inline">BookVault</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {/* Genres Dropdown */}
          <DropdownMenu open={genresOpen} onOpenChange={setGenresOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Жанры
                {genresOpen
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Жанры</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {GENRES.map((genre) => (
                <DropdownMenuItem
                  key={genre.value}
                  asChild
                  onClick={() => setGenresOpen(false)}
                >
                  <Link to={genreHref(genre.value)}>{genre.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={() => setGenresOpen(false)}>
                <Link to="/genres" className="text-primary font-medium">
                  Все жанры
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/collections">Подборки</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/news">Новости</Link>
          </Button>
		  <Button variant="ghost" size="sm" asChild>
            <Link to="/tests">Тесты</Link>
          </Button>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center gap-2 max-w-md ml-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Найти книгу или автора..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" size="sm">Найти</Button>
        </form>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          {/* Single theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
          >
            {theme === 'light'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />}
          </Button>
		  
          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="max-w-[100px] truncate text-sm">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium truncate">{user.displayName || 'Пользователь'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile"><User className="w-4 h-4 mr-2" />Мой профиль</Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild className="hidden sm:flex">
              <Link to="/login">Войти</Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск книг..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" size="sm">OK</Button>
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1">Жанры</p>
            {GENRES.map((genre) => (
              <Link
                key={genre.value}
                to={genreHref(genre.value)}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-1.5 text-sm rounded-md hover:bg-accent"
              >
                {genre.label}
              </Link>
            ))}
            <Link
              to="/genres"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-1.5 text-sm rounded-md hover:bg-accent text-primary font-medium"
            >
              Все жанры
            </Link>
            <div className="h-px bg-border my-1" />
            <Link to="/collections" onClick={() => setMobileOpen(false)} className="px-2 py-1.5 text-sm rounded-md hover:bg-accent">Подборки</Link>
            <Link to="/news" onClick={() => setMobileOpen(false)} className="px-2 py-1.5 text-sm rounded-md hover:bg-accent">Новости</Link>
			<Link to="/tests" onClick={() => setMobileOpen(false)} className="px-2 py-1.5 text-sm rounded-md hover:bg-accent">Тесты</Link>

            <div className="h-px bg-border my-1" />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center gap-2">
                  <User className="w-4 h-4" /> Мой профиль
                </Link>
                <Link to="/my-books" onClick={() => setMobileOpen(false)} className="px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center gap-2">
                  <Library className="w-4 h-4" /> Моя коллекция
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="px-2 py-1.5 text-sm rounded-md hover:bg-accent text-destructive flex items-center gap-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Выйти
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-2 py-1.5 text-sm rounded-md bg-primary text-primary-foreground text-center font-medium">
                Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
