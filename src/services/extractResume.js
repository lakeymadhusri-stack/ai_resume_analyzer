import { config } from '../config';
import { getExtension } from '../utils/fileValidation';
import { normalizeText, looksLikeColumns } from '../utils/textUtils';
import { extractPdfText } from './extractPdfText';
import { extractDocxText } from './extractDocxText';

export class ExtractError extends Error {}

async function checkSignature(file, ext) {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const asText = String.fromCharCode(...head);
  if (ext === 'pdf' && !asText.startsWith('%PDF')) {
    throw new ExtractError('This file has a .pdf name but is not a valid PDF. Re-export it as PDF and try again.');
  }
  if (ext === 'docx' && !asText.startsWith('PK')) {
    throw new ExtractError('This file has a .docx name but is not a valid DOCX. Re-save it as .docx and try again.');
  }
}

/** Reads a validated PDF/DOCX and returns { text, pages, warnings }. */
export async function extractResume(file) {
  const ext = getExtension(file.name);
  await checkSignature(file, ext);

  let result;
  try {
    result = ext === 'pdf' ? await extractPdfText(file) : await extractDocxText(file);
  } catch (err) {
    if (err instanceof ExtractError) throw err;
    console.error('Resume parsing failed:', err?.name || 'Error');
    throw new ExtractError(
      'We could not read this file. Re-export it as PDF or DOCX and try again.'
    );
  }

  const text = normalizeText(result.text);
  if (text.length < config.minResumeChars) {
    throw new ExtractError(
      ext === 'pdf'
        ? "We couldn't extract readable text. If this is a scanned PDF, run OCR on it first or upload a text-based PDF."
        : "We couldn't find enough readable text in this document. Check that the resume is typed text, not images."
    );
  }

  const warnings = [];
  if (looksLikeColumns(text)) {
    warnings.push('The text order may be mixed up, which is common with two-column layouts. Review the extracted text before analyzing.');
  }
  if (text.length > config.maxResumeChars) {
    warnings.push(
      `This resume has ${text.length.toLocaleString()} characters and the limit is ${config.maxResumeChars.toLocaleString()}. Trim the text below before analyzing.`
    );
  }
  return { text, pages: result.pages, warnings };
}
