/**
 * Open Library API service
 * Docs: https://openlibrary.org/developers/api
 *
 * Language codes used by Open Library are ISO 639-2/B (3-letter):
 *   rus, eng, ger, fre, spa, ita, chi, jpn, por, ara, pol, nld, swe ...
 */

const OL_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b/id';
const RESULTS_PER_PAGE = 20;

// User-Agent recommended by Open Library docs
const HEADERS = {
  'User-Agent': 'BookVault/1.0 (support@bookvault.app)',
};

// ─── Session-Storage Cache (5 min TTL) ───

const CACHE_TTL = 5 * 60 * 1000;

const cacheGet = (key) => {
  try {
    const raw = sessionStorage.getItem(`ol_${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(`ol_${key}`); return null; }
    return data;
  } catch { return null; }
};

const cacheSet = (key, data) => {
  try {
    sessionStorage.setItem(`ol_${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
};

// ─── Helpers ───

/** Extract OLID string from a key like "/works/OL123456W" */
export const extractOlid = (key = '') => key.replace('/works/', '').replace('/', '');

/** Build cover URL from cover_i (Open Library integer ID) */
const coverUrl = (coverId, size = 'M') =>
  coverId ? `${COVERS_BASE}/${coverId}-${size}.jpg` : null;

/** Normalise description field — OL returns string OR {type,value} object */
const extractDesc = (desc) => {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (typeof desc === 'object' && desc.value) return desc.value;
  return '';
};

/**
 * Map a single raw search document to our unified book shape.
 */
const mapSearchDoc = (doc) => ({
  id:            extractOlid(doc.key),
  title:         doc.title || 'Без названия',
  authors:       doc.author_name || ['Автор неизвестен'],
  thumbnail:     coverUrl(doc.cover_i),
  description:   '',                              // not returned by search endpoint
  publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : '',
  language:      doc.language || [],              // array of 3-letter OL codes
  pageCount:     doc.number_of_pages_median || null,
  publisher:     Array.isArray(doc.publisher) ? doc.publisher[0] : (doc.publisher || ''),
  previewLink:   `${OL_BASE}${doc.key}`,
  ia_id:         Array.isArray(doc.ia) && doc.ia.length ? doc.ia[0] : null,
  has_fulltext:  !!doc.has_fulltext,
  categories:    doc.subject ? doc.subject.slice(0, 5) : [],
  averageRating: null,
  ratingsCount:  0,
  isbn:          Array.isArray(doc.isbn) ? doc.isbn[0] : '',
});

// ─── Language query helpers ───

const buildLangQuery = (langs) => {
  if (!langs || langs.length === 0) return '';
  if (langs.length === 1) return `language:${langs[0]}`;
  return `language:(${langs.join(' OR ')})`;
};

// ─── Public API ───

export const searchBooks = async (query, startIndex = 0, options = {}) => {
  const { langRestrict = [] } = options;

  // Build the combined query string
  const langFragment = buildLangQuery(langRestrict);
  const fullQuery = langFragment ? `${query} AND ${langFragment}` : query;

  const cacheKey = `search_${fullQuery}_${startIndex}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const fields = [
    'key', 'title', 'author_name', 'first_publish_year', 'language',
    'cover_i', 'has_fulltext', 'ia', 'publisher', 'number_of_pages_median',
    'subject', 'isbn',
  ].join(',');

  const params = new URLSearchParams({
    q:      fullQuery,
    offset: startIndex,
    limit:  RESULTS_PER_PAGE,
    fields,
  });

  const res = await fetch(`${OL_BASE}/search.json?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Open Library search error: ${res.status}`);
  const data = await res.json();

  const result = {
    books:      (data.docs || []).map(mapSearchDoc),
    totalItems: data.numFound || 0,
  };

  cacheSet(cacheKey, result);
  return result;
};

/**
 * Get full book details by Open Library Works ID (e.g. "OL123456W").
 */
export const getBookById = async (olid) => {
  const cacheKey = `book_${olid}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const worksUrl = `${OL_BASE}/works/${olid}.json`;
  const editionsUrl = `${OL_BASE}/works/${olid}/editions.json?limit=10&fields=publishers,number_of_pages,isbn_13,isbn_10,languages,covers,ocaid`;
  const searchUrl   = `${OL_BASE}/search.json?q=key:/works/${olid}&fields=ia,has_fulltext&limit=1`;

  let worksData, editionsData, searchData;
  try {
    [worksData, editionsData, searchData] = await Promise.all([
      fetch(worksUrl, { headers: HEADERS }).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
      fetch(editionsUrl, { headers: HEADERS }).then((r) => r.ok ? r.json() : { entries: [] }),
      fetch(searchUrl, { headers: HEADERS }).then((r) => r.ok ? r.json() : { docs: [] }),
    ]);
  } catch {
    throw new Error('Книга не найдена');
  }

  // Pick best edition for publisher / page count / ISBN
  const editions = editionsData.entries || [];
  const bestEd   = editions[0] || {};
  const searchDoc = searchData.docs?.[0] || {};

  // Covers: prefer works cover, fallback to edition
  const workCoverId = Array.isArray(worksData.covers) ? worksData.covers.find((c) => c > 0) : null;
  const edCoverId   = Array.isArray(bestEd.covers)    ? bestEd.covers.find((c) => c > 0) : null;
  const thumbnail   = coverUrl(workCoverId || edCoverId, 'L');

  // Authors — works returns [{author:{key:"/authors/OL..."}}, ...]
  // fetch for author names
  let authors = ['Автор неизвестен'];
  if (Array.isArray(worksData.authors) && worksData.authors.length > 0) {
    try {
      const authorKey = worksData.authors[0]?.author?.key;
      if (authorKey) {
        const aRes = await fetch(`${OL_BASE}${authorKey}.json`, { headers: HEADERS });
        if (aRes.ok) {
          const aData = await aRes.json();
          authors = [aData.name || aData.personal_name || 'Автор неизвестен'];
          if (worksData.authors.length > 1) authors.push('и др.');
        }
      }
    } catch {}
  }

  // Language from editions
  const langs = editions.flatMap((e) =>
    (e.languages || []).map((l) => l.key?.replace('/languages/', '') || '')
  ).filter(Boolean);
  const language = [...new Set(langs)];

  const publisher = Array.isArray(bestEd.publishers) ? bestEd.publishers[0] : '';
  const pageCount = bestEd.number_of_pages || null;
  const isbn      = (bestEd.isbn_13?.[0]) || (bestEd.isbn_10?.[0]) || '';

  const ia_id =
    (Array.isArray(searchDoc.ia) && searchDoc.ia.length ? searchDoc.ia[0] : null) ||
    editions.map((e) => e.ocaid).find((id) => !!id) ||
    (Array.isArray(worksData.ia) ? worksData.ia[0] : null) ||
    null;

  const book = {
    id:           olid,
    title:        worksData.title || 'Без названия',
    authors,
    thumbnail,
    description:  extractDesc(worksData.description),
    publishedDate: worksData.first_publish_date || '',
    language,
    pageCount,
    publisher,
    isbn,
    previewLink:  `${OL_BASE}/works/${olid}`,
    ia_id,
	has_fulltext: !!ia_id,
    categories:   (worksData.subjects || []).slice(0, 8),
    averageRating: null,
    ratingsCount:  0,
  };

  cacheSet(cacheKey, book);
  return book;
};

export const searchByGenre = async (subject, startIndex = 0, options = {}) => {
  const q = subject ? `subject:${subject}` : 'subject:fiction';
  return searchBooks(q, startIndex, options);
};

export const getBookReaderUrl = (iaId) =>
  iaId ? `https://archive.org/embed/${iaId}?ui_lang=en` : null;
