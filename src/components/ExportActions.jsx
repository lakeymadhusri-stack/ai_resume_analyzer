import { useState } from 'react';
import {
  buildReportText, buildRevisedDraft, copyText, downloadText, printReport,
} from '../utils/exportReport';

export default function ExportActions({ result, originalText, editState, onStartOver }) {
  const [note, setNote] = useState('');

  const flash = (msg) => {
    setNote(msg);
    setTimeout(() => setNote(''), 3200);
  };

  const revised = () => buildRevisedDraft(originalText, result.suggested_edits, editState);

  const draftNote = (d) => {
    const parts = [];
    if (!d.applied) return 'No accepted edits yet, so this is your original text.';
    parts.push(`${d.applied} edit${d.applied > 1 ? 's' : ''} applied`);
    if (d.missed.length) parts.push(`${d.missed.length} couldn't be matched to your text`);
    if (d.placeholders) parts.push(`${d.placeholders} placeholder${d.placeholders > 1 ? 's' : ''} to fill in`);
    return parts.join(', ');
  };

  return (
    <div className="export no-print">
      <div className="btnrow">
        <button type="button" className="btn btn--outline btn--sm" onClick={async () => flash((await copyText(buildReportText(result, editState))) ? 'Report copied.' : 'Copy failed. Use Download instead.')}>
          Copy report
        </button>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => { downloadText('resume-review.txt', buildReportText(result, editState)); flash('Report downloaded.'); }}>
          Download report
        </button>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => flash(printReport(result, editState) ? 'Opening print view…' : 'Pop-up blocked. Allow pop-ups or use Download.')}>
          Print / Save as PDF
        </button>
        <button type="button" className="btn btn--outline btn--sm" onClick={async () => { const d = revised(); flash((await copyText(d.text)) ? `Revised draft copied. ${draftNote(d)}.` : 'Copy failed.'); }}>
          Copy revised draft
        </button>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => { const d = revised(); downloadText('resume-revised-draft.txt', d.text); flash(`Draft downloaded. ${draftNote(d)}.`); }}>
          Download revised draft
        </button>
        <button type="button" className="btn btn--ink btn--sm" onClick={onStartOver}>Analyze another resume</button>
      </div>
      <p className="export__note" role="status" aria-live="polite">{note}</p>
    </div>
  );
}
