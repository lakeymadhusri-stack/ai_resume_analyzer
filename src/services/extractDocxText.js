/** Extract raw text from a .docx file, in the browser. */
export async function extractDocxText(file) {
  const mod = await import('mammoth/mammoth.browser.min.js');
  const mammoth = mod.default || mod;
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return { text: value || '', pages: 0 };
}
