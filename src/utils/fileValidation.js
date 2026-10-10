export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getExtension(name = '') {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

/** Returns { ok: true } or { ok: false, message }. */
export function validateFile(file, maxMb) {
  if (!file) return { ok: false, message: 'Choose a PDF or DOCX file to continue.' };
  const ext = getExtension(file.name);
  if (ext === 'doc') {
    return {
      ok: false,
      message: 'Older .doc files are not supported. Re-save the file as .docx or export it as PDF, then upload it again.',
    };
  }
  if (ext !== 'pdf' && ext !== 'docx') {
    return { ok: false, message: 'Upload a PDF or DOCX file.' };
  }
  if (file.size === 0) {
    return { ok: false, message: 'This file is empty. Choose a different file.' };
  }
  if (file.size > maxMb * 1024 * 1024) {
    return {
      ok: false,
      message: `This file is ${formatBytes(file.size)}. The limit is ${maxMb} MB, so compress it or shorten the document.`,
    };
  }
  return { ok: true };
}
