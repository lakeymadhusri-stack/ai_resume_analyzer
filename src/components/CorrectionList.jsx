import { useState } from 'react';
import Reveal from './Reveal';
import { copyText } from '../utils/exportReport';

export default function CorrectionList({ edits, editState, setEditState }) {
  const [copied, setCopied] = useState(null);

  if (!edits.length) return <p className="empty">No rewrites were suggested for this resume.</p>;

  const patch = (i, p) => setEditState((s) => s.map((e, idx) => (idx === i ? { ...e, ...p } : e)));

  const copy = async (i) => {
    if (await copyText(editState[i].text)) {
      setCopied(i);
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1600);
    }
  };

  return (
    <div className="stack">
      <p className="hint">
        Nothing is applied automatically. Edit any rewrite, then accept it to include it in your revised draft.
        Text in [brackets] is a placeholder for a real, verified detail only you can supply.
      </p>
      {edits.map((e, i) => {
        const st = editState[i] || { text: e.rewrite, status: 'pending' };
        return (
          <Reveal key={i} className={`card edit is-${st.status}`}>
            <div className="card__top">
              <h4>{e.section || 'Resume'}</h4>
              <span className={`tag tag--${st.status}`}>
                {st.status === 'accepted' ? 'Accepted' : st.status === 'ignored' ? 'Ignored' : 'Pending'}
              </span>
            </div>
            {e.original && (
              <div className="edit__orig">
                <span className="edit__label">Original</span>
                <p>{e.original}</p>
              </div>
            )}
            <div className="edit__new">
              <label className="edit__label" htmlFor={`rw-${i}`}>Rewrite (editable)</label>
              <textarea
                id={`rw-${i}`}
                rows={3}
                value={st.text}
                onChange={(ev) => patch(i, { text: ev.target.value, status: st.status === 'ignored' ? 'pending' : st.status })}
              />
            </div>
            {e.reason && <p className="edit__reason">{e.reason}</p>}
            <div className="btnrow">
              <button type="button" className="btn btn--teal btn--sm" onClick={() => patch(i, { status: st.status === 'accepted' ? 'pending' : 'accepted' })}>
                {st.status === 'accepted' ? 'Undo accept' : 'Accept'}
              </button>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => copy(i)}>
                {copied === i ? 'Copied' : 'Copy rewrite'}
              </button>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => patch(i, { status: st.status === 'ignored' ? 'pending' : 'ignored' })}>
                {st.status === 'ignored' ? 'Restore' : 'Ignore'}
              </button>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
