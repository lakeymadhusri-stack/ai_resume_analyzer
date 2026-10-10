import { useState } from 'react';
import Reveal from './Reveal';
import CorrectionList from './CorrectionList';
import CareerRoadmap from './CareerRoadmap';
import ExportActions from './ExportActions';

const TABS = [
  ['overview', 'Overview'],
  ['review', 'Resume review'],
  ['edits', 'Suggested edits'],
  ['matches', 'Career matches'],
  ['skills', 'Skills gap'],
  ['plan', 'Action plan'],
];

const PRIORITY = { high: 'High priority', medium: 'Medium priority', low: 'Low priority' };
const FIT = { strong: 'Strong fit', possible: 'Possible fit', stretch: 'Stretch' };

const Chips = ({ items, tone = '' }) =>
  items.length ? (
    <ul className="chips">{items.map((s, i) => <li key={i} className={tone}>{s}</li>)}</ul>
  ) : (
    <p className="empty">Nothing reported.</p>
  );

function Overview({ r }) {
  return (
    <div className="stack">
      <Reveal className="card card--lead">
        <h4>Summary</h4>
        <p className="lead">{r.summary || 'No summary was returned.'}</p>
      </Reveal>
      <div className="grid2">
        <Reveal className="card" variant="left">
          <h4>Profile found in your resume</h4>
          <dl className="facts">
            <dt>Experience level</dt>
            <dd>{r.profile.experience_level || 'Not stated'}</dd>
            <dt>Education</dt>
            <dd>{r.profile.education.length ? r.profile.education.join('; ') : 'Not stated'}</dd>
            <dt>Roles</dt>
            <dd>{r.profile.roles_found.length ? r.profile.roles_found.join('; ') : 'Not stated'}</dd>
          </dl>
        </Reveal>
        <Reveal className="card" variant="right" delay={80}>
          <h4>Skills found</h4>
          <Chips items={r.profile.skills_found} />
        </Reveal>
      </div>
      {r.follow_up_questions.length > 0 && (
        <Reveal className="card">
          <h4>Questions that would sharpen this review</h4>
          <ul className="plain">{r.follow_up_questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
        </Reveal>
      )}
      <Reveal as="p" className="disclaimer">{r.disclaimer}</Reveal>
    </div>
  );
}

function Review({ r }) {
  const order = ['high', 'medium', 'low'];
  const issues = [...r.issues].sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));
  return (
    <div className="stack">
      <h4 className="subhead">Strengths</h4>
      {r.strengths.length ? (
        r.strengths.map((s, i) => (
          <Reveal key={i} className="card strength">
            <h5>{s.title}</h5>
            {s.evidence && <blockquote>{s.evidence}</blockquote>}
            {s.impact && <p>{s.impact}</p>}
          </Reveal>
        ))
      ) : (
        <p className="empty">No strengths were reported.</p>
      )}
      <h4 className="subhead">Improvements</h4>
      {issues.length ? (
        issues.map((it, i) => (
          <Reveal key={i} className={`card issue issue--${it.priority}`}>
            <span className={`tag tag--${it.priority}`}>{PRIORITY[it.priority]}</span>
            <h5>{it.issue}</h5>
            {it.why_it_matters && <p className="muted">{it.why_it_matters}</p>}
            {it.recommendation && <p><strong>Fix:</strong> {it.recommendation}</p>}
          </Reveal>
        ))
      ) : (
        <p className="empty">No issues were reported.</p>
      )}
    </div>
  );
}

function Matches({ r }) {
  if (!r.career_matches.length) return <p className="empty">No role matches were reported.</p>;
  return (
    <div className="grid2">
      {r.career_matches.map((m, i) => (
        <Reveal key={i} className="card" delay={(i % 2) * 80} variant={i % 2 ? 'right' : 'left'}>
          <div className="card__top">
            <h5>{m.role}</h5>
            <span className={`tag tag--fit-${m.fit}`}>{FIT[m.fit]}</span>
          </div>
          <p>{m.reason}</p>
          {m.gaps.length > 0 && (
            <>
              <p className="edit__label">To close the gap</p>
              <ul className="plain">{m.gaps.map((g, k) => <li key={k}>{g}</li>)}</ul>
            </>
          )}
        </Reveal>
      ))}
    </div>
  );
}

function Skills({ r }) {
  return (
    <div className="stack">
      <div className="grid3">
        <Reveal className="card" variant="left">
          <h4>Shown in your resume</h4>
          <Chips items={r.skills_gap.evidenced} tone="chip--teal" />
        </Reveal>
        <Reveal className="card" delay={80}>
          <h4>Worth strengthening</h4>
          <Chips items={r.skills_gap.to_strengthen} tone="chip--mark" />
        </Reveal>
        <Reveal className="card" variant="right" delay={160}>
          <h4>Not shown in your resume</h4>
          <Chips items={r.skills_gap.not_evidenced} />
        </Reveal>
      </div>
      <Reveal as="p" className="hint">
        "Not shown" only means the resume doesn't mention a skill. It doesn't mean you lack it, so add it if it's true.
      </Reveal>
    </div>
  );
}

export default function ResultsDashboard({ result, originalText, onStartOver }) {
  const [tab, setTab] = useState('overview');
  const [editState, setEditState] = useState(() =>
    result.suggested_edits.map((e) => ({ text: e.rewrite, status: 'pending' }))
  );

  const onKey = (e) => {
    const i = TABS.findIndex(([k]) => k === tab);
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length;
    if (next !== null) {
      e.preventDefault();
      setTab(TABS[next][0]);
      document.getElementById(`tab-${TABS[next][0]}`)?.focus();
    }
  };

  return (
    <div className="results">
      <ExportActions result={result} originalText={originalText} editState={editState} onStartOver={onStartOver} />

      <div className="tabs-wrap">
        <div className="tabs" role="tablist" aria-label="Review sections" onKeyDown={onKey}>
          {TABS.map(([key, label]) => (
            <button
              key={key}
              id={`tab-${key}`}
              role="tab"
              type="button"
              aria-selected={tab === key}
              aria-controls={`panel-${key}`}
              tabIndex={tab === key ? 0 : -1}
              className={tab === key ? 'is-active' : ''}
              onClick={() => setTab(key)}
            >
              {label}
              {key === 'edits' && result.suggested_edits.length > 0 && <span className="tabs__count">{result.suggested_edits.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="tabpanel">
        {tab === 'overview' && <Overview r={result} />}
        {tab === 'review' && <Review r={result} />}
        {tab === 'edits' && (
          <CorrectionList edits={result.suggested_edits} editState={editState} setEditState={setEditState} />
        )}
        {tab === 'matches' && <Matches r={result} />}
        {tab === 'skills' && <Skills r={result} />}
        {tab === 'plan' && <CareerRoadmap plan={result.action_plan} />}
      </div>
    </div>
  );
}
