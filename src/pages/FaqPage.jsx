import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';

const FAQ_ITEMS = [
  {
    q: 'Как добавить книгу в библиотеку?',
    a: 'Используйте поиск на сайте, найдите нужную книгу и нажмите «Добавить в коллекцию» на странице книги. Для этого необходимо быть авторизованным.',
  },
  {
    q: 'Как работает поиск?',
    a: 'Поиск осуществляется через Open Library API - просто введите название книги или имя автора в строку поиска. Результаты охватывают более миллиона книг.',
  },
  {
    q: 'Что такое подборки?',
    a: 'Это тематические списки книг от редакции BookVault. Они содержат немного общей информации о выбранных книгах, а также их можно добавлять в свой профиль.',
  },
  {
    q: 'Как написать рецензию?',
    a: ( <>
        Перейти на страницу любой интересующей вас книги и найти секцию с рецензиями - чуть ниже описания книги. Обязательно прочитайте{' '}
        <Link to="/rules" className="text-primary hover:underline">
          правила
        </Link>
        {' '}перед написанием отзыва!
      </>
	),
  },
  {
    q: 'Как сбросить пароль?',
    a: ( <>
        Перейдите на{' '}
        <Link to="/login" className="text-primary hover:underline">
          страницу входа
        </Link>
        {' '}и нажмите «Забыли пароль?». На указанный email придёт ссылка для сброса пароля.
      </>
	),
  },
  {
    q: 'Что делать, если нашёл ошибку?',
    a: (
      <>
        Пожалуйста, напишите нам в{' '}
        <Link to="/support" className="text-primary hover:underline">
          техподдержку
        </Link>
        . Опишите ошибку как можно подробнее - это поможет нам быстро её исправить.
      </>
    ),
  },
  {
    q: 'Где найти правила поведения?',
    a: (
      <>
        Правила поведения в BookVault опубликованы на{' '} 
		<Link to="/rules" className="text-primary hover:underline">
        этой 
        </Link>
		{' '}странице.
      </>
    ),
  },
  {
    q: 'Можно ли использовать BookVault без регистрации?',
    a: 'Да! Поиск и просмотр книг доступны без регистрации. Авторизация нужна только для добавления книг в личную коллекцию, оценок и заметок.',
  },
];

const FaqPage = () => (
  <div className="container mx-auto px-4 py-12 max-w-2xl">
    <div className="flex items-start gap-3 mb-8">
      <HelpCircle className="w-8 h-8 text-primary mt-0.5 shrink-0" />
      <div>
        <h1 className="text-3xl font-bold">Часто задаваемые вопросы</h1>
        <p className="text-muted-foreground mt-1">
          Не нашли ответа? Напишите нам в{' '}
          <Link to="/support" className="text-primary hover:underline">
            техподдержку
          </Link>
          .
        </p>
      </div>
    </div>

    <Accordion type="multiple" collapsible className="w-full">
      {FAQ_ITEMS.map((item, idx) => (
        <AccordionItem key={idx} value={`item-${idx}`}>
          <AccordionTrigger className="text-left text-sm sm:text-base">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FaqPage;
