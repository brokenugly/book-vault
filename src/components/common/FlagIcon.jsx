/**
 * Simple inline SVG flag icons for the language filter.
 * No external dependencies required.
 */
const flags = {
  ru: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="6.667" fill="#FFFFFF" />
      <rect y="6.667" width="30" height="6.667" fill="#0039A6" />
      <rect y="13.333" width="30" height="6.667" fill="#D52B1E" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
      <rect width="5" height="1" fill="#000000" />
      <rect y="1" width="5" height="1" fill="#DD0000" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  ),
  fr: (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  ),
  es: (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#c60b1e" />
      <rect y="0.5" width="3" height="1" fill="#ffc400" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#DE2910" />
      <polygon points="5,2 6.18,5.09 9.51,5.09 6.90,7.05 7.94,10.18 5,8.44 2.06,10.18 3.10,7.05 0.49,5.09 3.82,5.09" fill="#FFDE00" />
    </svg>
  ),
  ja: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  ),
};

const FlagIcon = ({ code, className = 'w-5 h-4 rounded-sm overflow-hidden' }) => {
  const svg = flags[code?.toLowerCase()];
  if (!svg) return null;
  return (
    <span className={`inline-block shrink-0 ${className}`} aria-label={code}>
      {svg}
    </span>
  );
};

export default FlagIcon;
