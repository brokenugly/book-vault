/**
 * Static collections data.
 * bookId is the Open Library Works ID (OL…W).
 * Update these IDs if you want to point to different editions.
 */

export const STATIC_COLLECTIONS = [
  {
    slug:        'autumn-cozy',
    title:       'Что почитать осенью: уютные романы',
    description: 'Тёплые истории для долгих вечеров с пледом и горячим чаем. Уютная атмосфера и романтика – лучшее сопровождение осенних дождей.',
    emoji:       '🍂',
    books: [
      {
        bookId:      'OL66554W',
        title:       'Гордость и предубеждение',
        author:      'Джейн Остин',
        description: 'Классический роман о любви, обществе и человеческих предрассудках. Элизабет Беннет и мистер Дарси – одна из самых любимых пар в мировой литературе.',
        thumbnail:   'https://covers.openlibrary.org/b/id/12136319-M.jpg',
      },
      {
        bookId:      'OL27040535W',
        title:       'Маленькие женщины',
        author:      'Луиза Мэй Олкотт',
        description: 'Тёплая семейная сага о четырёх сёстрах, взрослеющих во время Гражданской войны. История о мечтах, потерях и неиссякаемой любви.',
        thumbnail:   'https://covers.openlibrary.org/b/id/12550363-M.jpg',
      },
      {
        bookId:      'OL1095427W',
        title:       'Джейн Эйр',
        author:      'Шарлотта Бронте',
        description: 'История сироты, ставшей гувернанткой в таинственном поместье. Роман о достоинстве, страсти и праве на счастье.',
        thumbnail:   'https://covers.openlibrary.org/b/id/12684270-M.jpg',
      },
      {
        bookId:      'OL66534W',
        title:       'Нортенгерское аббатство',
        author:      'Джейн Остин',
        description: 'Очаровательная пародия на готические романы. Юная Кэтрин Морланд впервые выезжает в свет – и обнаруживает, что жизнь не похожа на любимые книги.',
        thumbnail:   'https://covers.openlibrary.org/b/id/8315272-M.jpg',
      },
    ],
  },
  {
    slug:        'strong-heroines',
    title:       'Фэнтези с сильными героинями',
    description: 'Книги, где женщины меняют миры, сражаются с тьмой и находят себя. Смелые, умные, непокорные.',
    emoji:       '⚔️',
    books: [
      {
        bookId:      'OL8479867W',
        title:       'Имя ветра',
        author:      'Патрик Ротфусс',
        description: 'Эпическая фэнтезийная сага о легендарном волшебнике Квоте – история, рассказанная им самим. Магия, музыка и тайны университета Арканум.',
        thumbnail:   'https://covers.openlibrary.org/b/id/6692522-M.jpg',
      },
      {
        bookId:      'OL16607146W',
        title:       'Трон из стекла',
        author:      'Сара Маас',
        description: 'Молодая убийца Селин участвует в турнире, чтобы получить свободу. Дворцовые интриги, тёмная магия и неожиданные союзники.',
        thumbnail:   'https://covers.openlibrary.org/b/id/8174281-M.jpg',
      },
      {
        bookId:      'OL16082078W',
        title:       'Наследие',
        author:      'Робин Хобб',
        description: 'История молодой женщины в мире, где у неё нет права на выбор. Но она найдёт свой путь – через боль и предательство.',
        thumbnail:   'https://covers.openlibrary.org/b/id/8343785-M.jpg',
      },
      {
        bookId:      'OL5735363W',
        title:       'Голодные игры',
        author:      'Сюзанна Коллинз',
        description: 'Китнисс Эвердин против всей системы. Дистопия, выживание и цена свободы в мире, где дети убивают детей.',
        thumbnail:   'https://covers.openlibrary.org/b/id/12646529-M.jpg',
      },
    ],
  },
  {
    slug:        'space-sci-fi',
    title:       'Научная фантастика о космосе',
    description: 'Головокружительные путешествия по галактикам, инопланетные цивилизации и философские вопросы о месте человечества во Вселенной.',
    emoji:       '🚀',
    books: [
      {
        bookId:      'OL893415W',
        title:       'Дюна',
        author:      'Фрэнк Герберт',
        description: 'Величайшая космическая опера всех времён. Пустынная планета Арракис, пряность мелан́ж и судьба пророка Пола Атрейдеса.',
        thumbnail:   'https://covers.openlibrary.org/b/id/15202650-M.jpg',
      },
      {
        bookId:      'OL17091839W',
        title:       'Марсианин',
        author:      'Энди Вейр',
        description: 'Астронавт Марк Уотни остался один на Марсе. Выживание с помощью науки, юмора и неукротимого желания жить.',
        thumbnail:   'https://covers.openlibrary.org/b/id/15136038-M.jpg',
      },
      {
        bookId:      'OL2163649W',
        title:       'Автостопом по галактике',
        author:      'Дуглас Адамс',
        description: 'Земля уничтожена ради строительства гиперпространственной трассы. Артур Дент начинает невероятное путешествие с инопланетным другом.',
        thumbnail:   'https://covers.openlibrary.org/b/id/13642711-M.jpg',
      },
      {
        bookId:      'OL17267881W',
        title:       'Задача трёх тел',
        author:      'Лю Цысинь',
        description: 'Контакт с инопланетной цивилизацией меняет всё. Твёрдая научная фантастика о физике, истории и судьбе человечества.',
        thumbnail:   'https://covers.openlibrary.org/b/id/15162422-M.jpg',
      },
    ],
  },
  {
    slug:        'weekend-reads',
    title:       'Книги, которые читаются за выходные',
    description: 'Захватывающие истории, от которых невозможно оторваться. Откройте в пятницу вечером – закроете в воскресенье.',
    emoji:       '📖',
    books: [
      {
        bookId:      'OL5735363W',
        title:       'Голодные игры',
        author:      'Сюзанна Коллинз',
        description: 'Страница за страницей – невозможно остановиться. Дистопия, экшн и характеры, которые не забываются.',
        thumbnail:   'https://covers.openlibrary.org/b/id/12646529-M.jpg',
      },
      {
        bookId:      'OL17091839W',
        title:       'Марсианин',
        author:      'Энди Вейр',
        description: 'Смешно, напряжённо, умно. Читается на одном дыхании, потому что за каждой страницей новое открытие или катастрофа.',
        thumbnail:   'https://covers.openlibrary.org/b/id/15136038-M.jpg',
      },
      {
        bookId:      'OL17112428W',
        title:       'Девушка в поезде',
        author:      'Пола Хокинс',
        description: 'Психологический триллер с непредсказуемым финалом. Три женщины, одна тайна – и невозможно угадать, кому верить.',
        thumbnail:   'https://covers.openlibrary.org/b/id/12623906-M.jpg',
      },
      {
        bookId:      'OL2163649W',
        title:       'Автостопом по галактике',
        author:      'Дуглас Адамс',
        description: 'Один из самых смешных романов в истории. Абсурд, философия и приключения – лёгкое чтение с глубоким послевкусием.',
        thumbnail:   'https://covers.openlibrary.org/b/id/13642711-M.jpg',
      },
    ],
  },
];

export const getCollectionBySlug = (slug) =>
  STATIC_COLLECTIONS.find((c) => c.slug === slug) || null;
