import Reveal from './Reveal';

const ROWS = [
  ['Strengths', 'Each one points to the line in your resume that earns it.'],
  ['Fixes in priority order', 'Vague wording, missing outcomes and inconsistent details, with why each one matters.'],
  ['Rewrites you control', 'Original and rewrite side by side. Edit, accept or ignore every suggestion.'],
  ['Role matches', 'Role families your evidence supports, and what would close the gap.'],
  ['Skills gap', "Skills you show, skills to strengthen, and skills the resume doesn't show yet."],
  ['A 30/60/90-day plan', 'Projects, learning topics and interview practice sized to your level.'],
];

export default function WhatYouGet() {
  return (
    <section id="review" className="section section--ink">
      <div className="container">
        <Reveal className="section__head section__head--light">
          <h2>What lands in your review</h2>
          <p>Six parts, each one grounded in what your resume actually says.</p>
        </Reveal>
        <ul className="rows">
          {ROWS.map(([title, text], i) => (
            <Reveal as="li" key={title} className="rows__item" delay={(i % 3) * 70}>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
