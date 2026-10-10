import { ArrowDown } from './Icons';

function ResumeMock() {
  return (
    <div className="paper" aria-hidden="true">
      <div className="paper__name">
        <span className="bar bar--ink w45" />
        <span className="bar w30 thin" />
      </div>

      <div className="paper__block">
        <span className="bar bar--teal w20 thin" />
        <span className="bar w90" />
        <span className="bar w75" />
      </div>

      <div className="paper__block">
        <span className="bar bar--teal w25 thin" />
        <p className="paper__line">
          <span className="hl">
            <span className="strike">Worked on a Python project.</span>
          </span>
        </p>
        <p className="paper__rewrite">Built a Python application to [verified purpose], using [verified tools].</p>
        <span className="paper__note">Name what you built and how.</span>
        <span className="bar w85" />
        <span className="bar w60" />
      </div>

      <div className="paper__block">
        <span className="bar bar--teal w22 thin" />
        <span className="bar w80" />
        <span className="bar w50" />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker">AI resume review and career guidance</p>
          <h1>Your resume, read closely and marked up like a careful editor would.</h1>
          <p className="hero__lead">
            Upload a PDF or DOCX. Get strengths backed by your own words, fixes in priority order,
            rewrites you can edit, and a 30/60/90-day plan. Nothing is changed unless you accept it.
          </p>
          <div className="hero__actions">
            <a className="btn btn--mark" href="#analyze">Analyze my resume</a>
            <a className="btn btn--ghost" href="#how">
              See how it works <ArrowDown width={18} height={18} />
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <ResumeMock />
        </div>
      </div>
    </section>
  );
}
