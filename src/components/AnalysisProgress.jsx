import { CheckIcon } from './Icons';

export default function AnalysisProgress({ run, onCancel }) {
  const receiving = run.chars > 0;
  const steps = [
    { label: 'Reading resume', state: 'done' },
    { label: 'Analyzing with Ollama Cloud', state: receiving ? 'done' : 'active' },
    { label: 'Preparing recommendations', state: receiving ? 'active' : 'todo' },
  ];

  return (
    <div className="progress" role="status" aria-live="polite">
      <ul>
        {steps.map((s) => (
          <li key={s.label} className={`is-${s.state}`}>
            <span className="progress__dot">
              {s.state === 'done' ? <CheckIcon width={14} height={14} strokeWidth={3} /> : s.state === 'active' ? <span className="spinner" /> : null}
            </span>
            {s.label}
          </li>
        ))}
      </ul>
      <p className="muted">
        {receiving
          ? `Receiving the review… ${run.chars.toLocaleString()} characters so far.`
          : run.thinking
            ? 'The model is thinking it through. Larger models can take a minute.'
            : 'Waiting for the model to start. Larger models can take a minute.'}
      </p>
      <button type="button" className="btn btn--ghost-dark btn--sm" onClick={onCancel}>Cancel</button>
    </div>
  );
}
