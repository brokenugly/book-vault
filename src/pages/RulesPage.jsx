import { Link } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

const RULES = [
  {
    num: '01',
    title: 'Уважайте друг друга',
    body: 'Запрещены оскорбления, дискриминация, язык вражды и любые формы агрессии в адрес других участников.',
  },
  {
    num: '02',
    title: 'Никакого спама и рекламы',
    body: 'Запрещены спам, коммерческая реклама, несогласованные промо-материалы и массовые рассылки.',
  },
  {
    num: '03',
    title: 'Честные рецензии',
    body: 'Рецензии должны быть осмысленными. Накрутка рейтингов, флуд и публикации без содержания не допускаются.',
  },
  {
    num: '04',
    title: 'Конфиденциальность',
    body: 'Запрещается публиковать личные данные других людей без их явного согласия.',
  },
  {
    num: '05',
    title: 'Права администрации',
    body: 'Администрация оставляет за собой право удалять контент, не соответствующий правилам, и блокировать пользователей без предупреждения.',
  },
];

const RulesPage = () => (
  <div className="container mx-auto px-4 py-12 max-w-2xl">
    {/* Header */}
    <div className="flex items-start gap-3 mb-4">
      <Shield className="w-8 h-8 text-primary mt-0.5 shrink-0" />
      <h1 className="text-3xl font-bold">Правила поведения в BookVault</h1>
    </div>

    {/* Intro */}
    <div className="rounded-xl bg-muted/50 border p-5 mb-8 text-sm text-muted-foreground leading-relaxed">
      Данные правила направлены на создание дружелюбной и безопасной среды для всех любителей
      книг. Пожалуйста, ознакомьтесь перед публикацией рецензий, комментариев и подборок.
    </div>

    {/* Rules list */}
    <div className="flex flex-col gap-4 mb-10">
      {RULES.map((rule) => (
        <div
          key={rule.num}
          className="flex gap-4 p-5 border rounded-xl bg-card hover:shadow-sm transition-shadow"
        >
          <span className="text-3xl font-bold text-primary/80 leading-none shrink-0 select-none w-8">
            {rule.num}
          </span>
          <div>
            <h3 className="font-semibold mb-1">{rule.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{rule.body}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Footer note */}
    <div className="flex items-start gap-3 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-4 text-sm">
      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
      <p className="text-muted-foreground">
        По вопросам и жалобам обращайтесь в{' '}
        <Link to="/support" className="text-primary font-medium hover:underline">
          техподдержку
        </Link>
        . Правила могут обновляться - следите за новостями.
      </p>
    </div>
  </div>
);

export default RulesPage;
