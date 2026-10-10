/** Clean extracted text without merging unrelated sections. */
export function normalizeText(input = '') {
  return input
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /(?<![\w])\(?\+?\d[\d ().-]{7,}\d(?![\w])/g;

/** Local-only redaction of email addresses and phone numbers before text is sent. */
export function redactContacts(text = '') {
  return text.replace(EMAIL, '[email removed]').replace(PHONE, (m) => {
    const digits = m.replace(/\D/g, '').length;
    return digits >= 9 && digits <= 15 ? '[phone removed]' : m;
  });
}

/** Heuristic: many very short lines often means columns were read out of order. */
export function looksLikeColumns(text = '') {
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 25) return false;
  const short = lines.filter((l) => l.trim().length < 22).length;
  return short / lines.length > 0.6;
}
