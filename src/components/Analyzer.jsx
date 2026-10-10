import { config } from '../config';
import ResumeUploader from './ResumeUploader';
import CareerContextForm from './CareerContextForm';
import AnalysisProgress from './AnalysisProgress';
import Reveal from './Reveal';
import { AlertIcon } from './Icons';

export default function Analyzer({ a }) {
  const { file, extract, context, run } = a;
  const hasKey = Boolean(config.apiKey);
  const tooLong = extract.text.length > config.maxResumeChars;
  const tooShort = extract.text.trim().length < config.minResumeChars;
  const canAnalyze = extract.status === 'ready' && !tooLong && !tooShort && hasKey && run.status !== 'running';
  const running = run.status === 'running';

  return (
    <section id="analyze" className="section section--paper">
      <div className="container">
        <Reveal className="section__head">
          <h2>Analyze your resume</h2>
          <p>Upload it, add a target role if you have one, and run the review.</p>
        </Reveal>

        {!hasKey && (
          <Reveal>
            <p className="alert alert--warn alert--block" role="status">
              <AlertIcon width={20} height={20} />
              <span>
                No API key found. Copy <code>.env.example</code> to <code>.env</code>, set <code>VITE_OLLAMA_API_KEY</code>,
                then restart the dev server (or add it in your Netlify / Vercel environment settings and redeploy).
              </span>
            </p>
          </Reveal>
        )}

        <div className="analyzer">
          <Reveal variant="left">
            <ResumeUploader
              file={file}
              extract={extract}
              onSelect={a.selectFile}
              onRemove={a.removeFile}
              onTextChange={a.setText}
              maxMb={config.maxFileMb}
              maxChars={config.maxResumeChars}
            />
          </Reveal>

          <Reveal variant="right" delay={90}>
            <CareerContextForm context={context} onChange={a.updateContext} />
          </Reveal>
        </div>

        <Reveal className="analyzer__action" variant="zoom">
          {running ? (
            <AnalysisProgress run={run} onCancel={a.cancel} />
          ) : (
            <>
              <button type="button" className="btn btn--ink btn--lg" disabled={!canAnalyze} onClick={a.analyze}>
                {run.status === 'error' ? 'Try again' : 'Analyze resume'}
              </button>
              <p className="muted">
                {extract.status === 'ready'
                  ? 'Text extracted. Your text is sent to Ollama Cloud when you continue.'
                  : 'Upload a resume to enable analysis.'}
              </p>
            </>
          )}
          {run.status === 'error' && run.error && (
            <p className="alert alert--error alert--block" role="alert">
              <AlertIcon width={20} height={20} /> <span>{run.error.message}</span>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
