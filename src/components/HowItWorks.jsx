import { useRef } from 'react';
import Reveal from './Reveal';
import { useSectionProgress } from '../hooks/useScrollEffects';

const STEPS = [
  {
    title: 'Upload your resume',
    text: 'Drop in a PDF or DOCX. The file is read inside your browser, and the original is never modified.',
  },
  {
    title: 'Check the extracted text',
    text: 'You see exactly what was read, so you can fix mixed-up columns or trim it before anything is sent for analysis.',
  },
  {
    title: 'Review the feedback',
    text: 'Get evidence-backed strengths, prioritized fixes, side-by-side rewrites, role matches and a practical plan.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  useSectionProgress(ref);

  return (
    <section id="how" className="section">
      <div className="container">
        <Reveal className="section__head">
          <h2>Three steps, and you stay in control of every change</h2>
          <p>Built for people who want honest feedback without handing over the pen.</p>
        </Reveal>

        <div className="timeline-wrap" ref={ref}>
          <div className="timeline__track" aria-hidden="true">
            <span className="timeline__fill" />
          </div>
          <ol className="timeline">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} variant={i % 2 ? 'right' : 'left'} className="timeline__item">
                <span className="timeline__marker" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
