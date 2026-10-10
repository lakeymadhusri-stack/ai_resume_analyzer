# Resume Advisor: AI Resume Analyzer & Career Advisor

A React (JavaScript) single-page app. Upload a PDF or DOCX resume, review the extracted text, and get strengths,
prioritized fixes, editable rewrites, role matches, a skills gap and a 30/60/90-day plan from an Ollama Cloud model.

Everything runs in the browser. There is **no server code**: the app calls Ollama directly from the frontend, so it
deploys as a plain static site on Netlify or Vercel.

## Quick start

```bash
npm install
cp .env.example .env      # then edit .env and paste your key
npm run dev
```

Open http://localhost:5173.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_OLLAMA_API_KEY` | none | Key from https://ollama.com/settings/keys |
| `VITE_OLLAMA_MODEL` | `gpt-oss:120b` | Any cloud model on your account (https://ollama.com/search?c=cloud) |
| `VITE_OLLAMA_BASE_URL` | `/ollama-api` | Where `/api/chat` is called. See "How requests reach Ollama" |
| `VITE_MAX_FILE_MB` | `8` | Upload size limit |
| `VITE_MAX_RESUME_CHARS` | `24000` | Extracted text limit |

Restart `npm run dev` after editing `.env`. On a host, set the same variables in the dashboard and redeploy.

## Deploy

**Netlify:** push the repo, "Add new site", import it. `netlify.toml` already sets the build command, `dist`, and the
rewrite rule. Add the variables under Site configuration, Environment variables.

**Vercel:** import the repo (Vite is detected). `vercel.json` contains the rewrite rule. Add the variables under
Settings, Environment Variables.

## How requests reach Ollama

The browser calls `POST {VITE_OLLAMA_BASE_URL}/api/chat`. With the default `/ollama-api`, that path is forwarded to
`https://ollama.com/api/chat` by the Vite dev proxy locally and by the rewrite rules in `netlify.toml` / `vercel.json`
in production. These are static config rules, not a server, and they avoid CORS problems.

To skip the rewrite and call Ollama directly, set `VITE_OLLAMA_BASE_URL=https://ollama.com`. This only works if the
browser is allowed to call that endpoint (CORS).

Responses are streamed, which keeps the connection alive on hosts that limit how long a proxied request can wait.

## Security: read this before deploying publicly

Any `VITE_` variable is bundled into the JavaScript the browser downloads. Because the call is made from the frontend,
**anyone who opens your deployed site can find your API key** in the bundle or the network tab. The rewrite rule does not
hide it, since the browser still sends the key.

Reasonable precautions for a frontend-only deployment:

- Use a dedicated key you can revoke, and rotate it if the site is shared widely.
- Keep the deployment private (Netlify/Vercel password protection) or share the URL only with people you trust.
- Never commit `.env` (it is in `.gitignore`).

For a public product, move the call into a small serverless function that holds the key and keep this UI unchanged.

## Project structure

```
src/
  components/   Header, Hero, HowItWorks, WhatYouGet, Analyzer, ResumeUploader, CareerContextForm,
                AnalysisProgress, ResultsDashboard, CorrectionList, CareerRoadmap, ExportActions, Reveal, ...
  hooks/        useResumeAnalysis (app state), useReveal (scroll fade in/out), useScrollEffects
  services/     extractPdfText (PDF.js), extractDocxText (Mammoth), extractResume, ollamaClient, responseSchema
  utils/        fileValidation, textUtils, exportReport
  config.js     reads the VITE_ variables
```

## Notes and limits

- Text-based PDFs and DOCX only. Scanned PDFs need OCR (not included). Legacy `.doc` is rejected with guidance.
- Model output is validated and rendered as plain text, never as HTML. Malformed JSON gets one automatic repair retry.
- Suggested edits are never applied automatically. "Revised draft" includes only the edits you accept, and the
  uploaded file is never changed.
- AI feedback can be wrong or incomplete. Review every suggestion.
