import { config } from '../config';

const LEVELS = ['', 'Student or intern', 'Entry-level', 'Mid-level', 'Senior', 'Lead or manager'];

export default function CareerContextForm({ context, onChange }) {
  return (
    <div className="panel">
      <div className="panel__head">
        <h3>2. Career context</h3>
        <p>Optional. Without a target role you get broader guidance.</p>
      </div>

      <div className="field">
        <label htmlFor="role">Target role</label>
        <input
          id="role"
          type="text"
          placeholder="Junior machine learning engineer"
          value={context.targetRole}
          maxLength={120}
          onChange={(e) => onChange({ targetRole: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="level">Experience level</label>
        <select id="level" value={context.experienceLevel} onChange={(e) => onChange({ experienceLevel: e.target.value })}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>{l || 'Not specified'}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="jd">Job description</label>
        <textarea
          id="jd"
          rows={5}
          placeholder="Paste a job posting to check which of its terms your resume shows."
          value={context.jobDescription}
          maxLength={config.maxJobDescriptionChars}
          onChange={(e) => onChange({ jobDescription: e.target.value })}
        />
      </div>

      <label className="check">
        <input type="checkbox" checked={context.redact} onChange={(e) => onChange({ redact: e.target.checked })} />
        <span>
          Remove email addresses and phone numbers before sending
          <small>Done in your browser, so contact details never reach the AI service.</small>
        </span>
      </label>
    </div>
  );
}
