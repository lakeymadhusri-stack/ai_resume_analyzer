import Reveal from './Reveal';
import { LockIcon } from './Icons';

export default function PrivacySection() {
  return (
    <section id="privacy" className="section">
      <div className="container privacy">
        <Reveal className="privacy__lead" variant="left">
          <span className="privacy__icon"><LockIcon width={28} height={28} /></span>
          <h2>What leaves your browser</h2>
          <p>
            Your file is read locally. Only the extracted text, plus the role details you choose to add,
            is sent to Ollama Cloud to produce the review.
          </p>
        </Reveal>
        <Reveal className="privacy__body" variant="right" delay={80}>
          <ul>
            <li>Email addresses and phone numbers can be removed from the text before it is sent.</li>
            <li>This app does not save your resume. Closing or resetting the page clears it.</li>
            <li>Don't upload anything you aren't comfortable sharing with the service. Check Ollama's current privacy terms.</li>
            <li>AI feedback can be incomplete or wrong. Verify facts and review every suggestion before using it.</li>
            <li>No score here predicts ATS results or hiring outcomes.</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
