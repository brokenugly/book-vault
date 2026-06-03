import { Link } from 'react-router-dom';
import { FlaskConical, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { TESTS_LIST } from '../constants/testsData';

const TestsListPage = () => (
  <div className="container mx-auto px-4 py-10">
    <div className="flex items-start gap-3 mb-8">
      <FlaskConical className="w-8 h-8 text-primary mt-0.5 shrink-0" />
      <div>
        <h1 className="text-3xl font-bold">Тесты</h1>
        <p className="text-muted-foreground mt-1">
          Проверьте свои знания в мире книг. Пройдите тест и узнайте результат!
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {TESTS_LIST.map((test) => (
        <div
          key={test.id}
          className="flex flex-col gap-3 p-5 border rounded-xl bg-card hover:shadow-md
                     transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-4xl select-none">{test.emoji}</div>
          <div className="flex-1">
            <h2 className="font-semibold text-base leading-snug">{test.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {test.questions.length} вопросов
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5 mt-auto">
            <Link to={`/tests/${test.id}`}>
              Пройти тест <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  </div>
);

export default TestsListPage;
