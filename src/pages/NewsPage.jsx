import { Newspaper } from 'lucide-react';

const NEWS = [
  {
    id: 1,
    date: '01.04.2026',
    isoDate: '2026-04-01',
    tag: 'Запуск',
    tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    title: 'Запуск BookVault: приглашаем первых читателей',
    body: `Мы рады представить BookVault - персональное пространство для каталогизации книг. 
Сервис позволяет искать книги из библиотеки Google Books, добавлять их в личную 
коллекцию, отслеживать статус чтения и оставлять личные заметки. 
Регистрация открыта для всех - присоединяйтесь!`,
  },
  {
    id: 2,
    date: '15.04.2026',
    isoDate: '2026-04-15',
    tag: 'Анонс',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    title: 'Совсем скоро: рецензии и подборки',
    body: `В следующем обновлении BookVault появятся возможности для написания рецензий и 
создания собственных подборок. Делитесь мнениями о прочитанных книгах и составляйте 
тематические списки для друзей. Следите за новостями!`,
  },
  {
    id: 3,
    date: '01.05.2026',
    isoDate: '2026-05-01',
    tag: 'Бета',
    tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    title: 'Присоединяйтесь к бета-тестированию',
    body: `Мы запускаем программу бета-тестирования новых функций. Первые участники получат 
ранний доступ к рецензиям, подборкам и социальным функциям. Чтобы стать 
бета-тестером, зарегистрируйтесь на сайте и напишите нам в техподдержку.`,
  },
];

const NewsCard = ({ item }) => (
  <article className="flex flex-col sm:flex-row gap-4 border rounded-xl p-5 bg-card hover:shadow-sm transition-shadow">
    {/* Date sidebar */}
    <div className="sm:w-28 shrink-0 flex sm:flex-col items-center sm:items-start gap-2">
      <time dateTime={item.isoDate} className="text-sm text-muted-foreground font-mono">
        {item.date}
      </time>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.tagColor}`}>
        {item.tag}
      </span>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <h2 className="font-semibold text-base mb-2">{item.title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {item.body}
      </p>
    </div>
  </article>
);

const NewsPage = () => (
  <div className="container mx-auto px-4 py-10">
    {/* Header */}
    <div className="flex items-start gap-3 mb-8">
      <Newspaper className="w-8 h-8 text-primary mt-0.5 shrink-0" />
      <div>
        <h1 className="text-3xl font-bold">Новости и анонсы</h1>
        <p className="text-muted-foreground mt-1">
          Следите за обновлениями BookVault: новые функции, события и анонсы.
        </p>
      </div>
    </div>

    {/* News feed */}
    <div className="flex flex-col gap-4 max-w-3xl">
      {NEWS.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>

    <p className="mt-8 text-sm text-muted-foreground">
      Больше новостей появится позже. Подписывайтесь и возвращайтесь!
    </p>
  </div>
);

export default NewsPage;
