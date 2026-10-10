import Reveal from './Reveal';

const COLUMNS = [
  ['days_30', 'First 30 days', 'Foundations'],
  ['days_60', 'Days 31 to 60', 'Build and prove'],
  ['days_90', 'Days 61 to 90', 'Present and practice'],
];

export default function CareerRoadmap({ plan }) {
  return (
    <div className="roadmap">
      {COLUMNS.map(([key, title, sub], i) => (
        <Reveal key={key} className="card roadmap__col" delay={i * 90} variant={i === 1 ? 'up' : i === 0 ? 'left' : 'right'}>
          <h4>{title}</h4>
          <p className="muted">{sub}</p>
          {plan[key].length ? (
            <ul className="checklist">
              {plan[key].map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          ) : (
            <p className="empty">No steps reported.</p>
          )}
        </Reveal>
      ))}
    </div>
  );
}
