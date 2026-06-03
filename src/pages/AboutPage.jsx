import { BookOpen, Heart, Search, Library } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    title: 'Поиск книг',
    desc: 'Более 2 миллионов книг из каталога Google Books всегда у вас под рукой.',
  },
  {
    icon: Library,
    title: 'Личная библиотека',
    desc: 'Сохраняйте книги, отслеживайте прогресс чтения и ставьте оценки.',
  },
  {
    icon: Heart,
    title: 'Для читателей',
    desc: 'Созданный читателями для читателей - с заботой о каждой детали.',
  },
];

const AboutPage = () => (
  <div className="container mx-auto px-4 py-12 max-w-3xl">
    {/* Hero */}
    <div className="text-center mb-12">
      {/* SVG Illustration */}
      <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-primary/10 mb-6">
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Book stack illustration */}
          <rect x="10" y="45" width="28" height="22" rx="2" fill="#f97316" opacity="0.8" />
          <rect x="12" y="43" width="28" height="22" rx="2" fill="#fb923c" />
          <rect x="8"  y="40" width="3"  height="22" rx="1" fill="#ea580c" />
          <rect x="42" y="38" width="24" height="30" rx="2" fill="#3b82f6" opacity="0.8" />
          <rect x="44" y="36" width="24" height="30" rx="2" fill="#60a5fa" />
          <rect x="40" y="33" width="3"  height="30" rx="1" fill="#2563eb" />
          <rect x="18" y="18" width="20" height="26" rx="2" fill="#22c55e" opacity="0.8" />
          <rect x="20" y="16" width="20" height="26" rx="2" fill="#4ade80" />
          <rect x="16" y="13" width="3"  height="26" rx="1" fill="#16a34a" />
          {/* Star */}
          <polygon points="40,5 42,11 48,11 43,15 45,21 40,17 35,21 37,15 32,11 38,11"
            fill="#f97316" opacity="0.9" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold mb-4">О проекте</h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
        <strong className="text-foreground">BookVault</strong> - это персональное книжное
        пространство, объединяющее каталогизацию, рецензии и рекомендации. Наша цель - помочь
        читателям находить, обсуждать и сохранять любимые книги.
      </p>
    </div>

    {/* Feature blocks */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex flex-col items-center text-center gap-3 p-5 border rounded-xl bg-card hover:shadow-sm transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>

    {/* Mission */}
    <div className="rounded-xl bg-gradient-to-br from-primary/5 to-orange-50 dark:from-primary/10 dark:to-orange-950/20 border border-primary/10 p-6">
      <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Наша миссия
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        Мы верим, что каждая книга заслуживает своего читателя. BookVault создан, чтобы сделать
        поиск и отслеживание книг простым и приятным. Ничего лишнего - только ваши книги и
        ваши впечатления.
      </p>
    </div>

    <p className="text-center text-sm text-muted-foreground mt-8">
      Есть вопросы или идеи?{' '}
      <a href="/support" className="text-primary hover:underline">
        Напишите нам
      </a>
    </p>
  </div>
);

export default AboutPage;
