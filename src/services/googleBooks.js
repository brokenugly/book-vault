/*
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const mapBook = (item) => ({
  id: item.id,
  title: item.volumeInfo?.title || 'Без названия',
  authors: item.volumeInfo?.authors || ['Автор неизвестен'],
  thumbnail:
    item.volumeInfo?.imageLinks?.thumbnail?.replace('http://', 'https://') ||
    item.volumeInfo?.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
    null,
  description: item.volumeInfo?.description || '',
  publishedDate: item.volumeInfo?.publishedDate || '',
  categories: item.volumeInfo?.categories || [],
  averageRating: item.volumeInfo?.averageRating || null,
  ratingsCount: item.volumeInfo?.ratingsCount || 0,
  pageCount: item.volumeInfo?.pageCount || null,
  publisher: item.volumeInfo?.publisher || '',
  language: item.volumeInfo?.language || '',
  previewLink: item.volumeInfo?.previewLink || '',
  isbn:
    item.volumeInfo?.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier || '',
});

export const searchBooks = async (queryStr, startIndex = 0, options = {}) => {
  const { langRestrict = '' } = options;
  const params = new URLSearchParams({
    q: queryStr,
    startIndex: String(startIndex),
    maxResults: 20,
  });
  if (API_KEY) params.set('key', API_KEY);
  // Google Books API only supports a single langRestrict value
  if (langRestrict) params.set('langRestrict', langRestrict);
  const url = `${BASE_URL}?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
  const data = await res.json();
  console.log('📖 API ответ:', {
  totalItems: data.totalItems,
  firstBookLanguage: data.items?.[0]?.volumeInfo?.language,
  firstBookTitle: data.items?.[0]?.volumeInfo?.title,
  allLanguages: data.items?.map(i => i.volumeInfo?.language)
});
  return {
    books: (data.items || []).map(mapBook),
    totalItems: data.totalItems || 0,
  };
};

export const getBookById = async (id) => {
  const params = new URLSearchParams();
  if (API_KEY) params.set('key', API_KEY);

  const res = await fetch(`${BASE_URL}/${id}?${params}`);
  if (!res.ok) throw new Error('Книга не найдена');
  const data = await res.json();
  return mapBook(data);
};

export const searchByGenre = async (subject, startIndex = 0, options = {}) => {
  const query = subject ? `subject:${subject}` : 'fiction';
  return searchBooks(query, startIndex, options);
};
*/