import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { Button } from '../components/ui/button';

const StubPage = ({ title, description }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <Construction className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
    <h1 className="text-3xl font-bold mb-3">{title}</h1>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
    <Button variant="outline" asChild>
      <Link to="/">← На главную</Link>
    </Button>
  </div>
);

// ReportPage — still a stub (no dedicated page required in this sprint)
export const ReportPage = () => (
  <StubPage
    title="Пожаловаться"
    description="Форма жалоб в разработке. По срочным вопросам воспользуйтесь техподдержкой."
  />
);

export const NotFoundPage = () => (
  <div className="container mx-auto px-4 py-20 text-center">
    <p className="text-8xl font-bold text-muted-foreground/20 mb-4 select-none">404</p>
    <h1 className="text-3xl font-bold mb-3">Страница не найдена</h1>
    <p className="text-muted-foreground mb-6">Запрошенная страница не существует.</p>
    <Button asChild>
      <Link to="/">← На главную</Link>
    </Button>
  </div>
);
