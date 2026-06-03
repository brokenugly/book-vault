import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <BookOpen className="w-5 h-5 text-primary" />
              BookVault
            </Link>
            <p className="text-sm text-muted-foreground">
              Ваш личный каталог книг. Читайте, отслеживайте, делитесь.
            </p>
            <p className="text-sm text-muted-foreground mt-2">© BookVault 2026</p>
          </div>

          {/* Информация */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Информация</h3>
            <nav className="flex flex-col gap-1.5">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">О нас</Link>
              <Link to="/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Контакты</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
			  <Link to="/rules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Правила поведения</Link>
            </nav>
          </div>

          {/* Поддержка */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Поддержка</h3>
            <nav className="flex flex-col gap-1.5">
			
              <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Техподдержка</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
