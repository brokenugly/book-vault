export const GENRES = [
  { label: 'Фэнтези', value: 'fantasy', query: 'fantasy' },
  { label: 'Романтика', value: 'romance', query: 'romance' },
  { label: 'Детектив', value: 'mystery', query: 'mystery' },
  { label: 'Научная фантастика', value: 'science_fiction', query: 'science fiction' },
  { label: 'Классика', value: 'classics', query: 'classic literature' },
];

export const BOOK_STATUSES = {
  willRead: 'Хочу прочитать',
  reading: 'Читаю сейчас',
  read: 'Прочитано',
};

export const BOOKS_PER_PAGE = 20;

export const STATUS_TABS = [
  { value: 'reading', label: 'Читаю сейчас' },
  { value: 'willRead', label: 'Хочу прочитать' },
  { value: 'read', label: 'Прочитано' },
];
