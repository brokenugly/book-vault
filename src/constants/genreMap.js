/**
 * Genre map and language options.
 * `subject` values are used directly in Open Library subject queries.
 * `olCode` is the ISO 639-2/B code used by Open Library for language filtering.
 */

export const GENRE_MAP = [
  // ── Short list (always visible) ──
  { label: 'Классика',          subject: 'classics',         group: 'short' },
  { label: 'Фэнтези',           subject: 'fantasy',          group: 'short' },
  { label: 'Детективы',         subject: 'mystery',          group: 'short' },
  { label: 'Любовные романы',   subject: 'romance',          group: 'short' },
  { label: 'Фантастика',        subject: 'science_fiction',  group: 'short' },

  // ── Full extended list ──
  { label: 'Приключения',       subject: 'adventure',        group: 'full'  },
  { label: 'Биографии',         subject: 'biography',        group: 'full'  },
  { label: 'Бизнес',            subject: 'business',         group: 'full'  },
  { label: 'Комиксы',           subject: 'comics',           group: 'full'  },
  { label: 'Кулинария',         subject: 'cooking',          group: 'full'  },
  { label: 'Современная проза', subject: 'contemporary',     group: 'full'  },
  { label: 'Ужасы',             subject: 'horror',           group: 'full'  },
  { label: 'Исторический роман',subject: 'historical',       group: 'full'  },
  { label: 'Юмор',              subject: 'humor',            group: 'full'  },
  { label: 'Молодёжная проза',  subject: 'young_adult',      group: 'full'  },
  { label: 'Наука и образование',subject: 'nonfiction',      group: 'full'  },
  { label: 'Поэзия',            subject: 'poetry',           group: 'full'  },
  { label: 'Психология',        subject: 'psychology',       group: 'full'  },
  { label: 'Религия',           subject: 'religion',         group: 'full'  },
  { label: 'Самопомощь',        subject: 'self_help',        group: 'full'  },
  { label: 'Спорт',             subject: 'sports',           group: 'full'  },
  { label: 'Триллер',           subject: 'thriller',         group: 'full'  },
  { label: 'Путешествия',       subject: 'travel',           group: 'full'  },
  { label: 'Детские книги',     subject: "children",         group: 'full'  },
];

/** All genres (short + full, deduplicated) */
export const ALL_GENRES = GENRE_MAP;
export const SHORT_GENRES = GENRE_MAP.filter((g) => g.group === 'short');
export const EXTENDED_GENRES = GENRE_MAP.filter((g) => g.group === 'full');

/** subject → label reverse map */
export const SUBJECT_TO_LABEL = Object.fromEntries(
  GENRE_MAP.map((g) => [g.subject, g.label])
);

/**
 * Language options shown in the filter panel.
 *
 * `code`   — 2-letter code used in URL params (?lang=ru)
 * `olCode` — ISO 639-2/B code sent to Open Library API (language:rus)
 */
export const LANGUAGE_OPTIONS = [
  { code: 'ru', olCode: 'rus', label: 'Русский'     },
  { code: 'en', olCode: 'eng', label: 'Английский'  },
  { code: 'de', olCode: 'ger', label: 'Немецкий'    },
  { code: 'fr', olCode: 'fre', label: 'Французский' },
  { code: 'es', olCode: 'spa', label: 'Испанский'   },
  { code: 'it', olCode: 'ita', label: 'Итальянский' },
  { code: 'zh', olCode: 'chi', label: 'Китайский'   },
  { code: 'ja', olCode: 'jpn', label: 'Японский'    },
];

/** Map 2-letter URL code → 3-letter OL code */
export const urlCodeToOlCode = Object.fromEntries(
  LANGUAGE_OPTIONS.map((l) => [l.code, l.olCode])
);
