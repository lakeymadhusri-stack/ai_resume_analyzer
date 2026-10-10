import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

/** Extract text from a text-based PDF, in the browser. */
export async function extractPdfText(file) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = [];

  try {
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const lines = [];
      let line = '';
      let lastY = null;
      let lastEnd = null;

      for (const item of content.items) {
        if (!('str' in item)) continue;
        const y = item.transform[5];
        const x = item.transform[4];
        if (lastY !== null && Math.abs(y - lastY) > 2.5) {
          lines.push(line);
          line = '';
          lastEnd = null;
        }
        const needsSpace =
          line && lastEnd !== null && x - lastEnd > 1 && !line.endsWith(' ') && !item.str.startsWith(' ');
        line += (needsSpace ? ' ' : '') + item.str;
        lastY = y;
        lastEnd = x + (item.width || 0);
        if (item.hasEOL) {
          lines.push(line);
          line = '';
          lastY = null;
          lastEnd = null;
        }
      }
      if (line) lines.push(line);
      pages.push(lines.join('\n'));
      page.cleanup();
    }
  } finally {
    pdf.destroy();
  }

  return { text: pages.join('\n\n'), pages: pages.length };
}
