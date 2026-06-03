import DOMPurify from 'dompurify';

/**
 * Allowed tags and attributes for review text.
 * <spoiler> is a custom tag — we handle its rendering in ReviewCard via CSS.
 */
const ALLOWED_TAGS  = ['b', 'i', 'blockquote', 'br', 'spoiler', 'p'];
const ALLOWED_ATTRS = {};   // no attributes allowed on any tag

/**
 * Sanitise user-submitted HTML before saving to Firestore.
 * Strips everything except allowed tags.
 */
export const sanitizeReviewHtml = (dirty) =>
  DOMPurify.sanitize(dirty || '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [],
  });

/**
 * Same config for rendering saved HTML back into the DOM.
 * Use as the value of dangerouslySetInnerHTML={{ __html: renderReviewHtml(text) }}
 */
export const renderReviewHtml = (saved) =>
  DOMPurify.sanitize(saved || '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [],
  });
