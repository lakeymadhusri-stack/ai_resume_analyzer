import { useEffect, useRef } from 'react';
import { useScrollEffects } from './hooks/useScrollEffects';
import { useResumeAnalysis } from './hooks/useResumeAnalysis';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import WhatYouGet from './components/WhatYouGet';
import Analyzer from './components/Analyzer';
import ResultsDashboard from './components/ResultsDashboard';
import PrivacySection from './components/PrivacySection';
import Footer from './components/Footer';
import Reveal from './components/Reveal';

export default function App() {
  useScrollEffects();
  const a = useResumeAnalysis();
  const resultsRef = useRef(null);

  // Bring the finished review into view.
  useEffect(() => {
    if (a.result) {
      const t = setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [a.resultId, a.result]);

  const startOver = () => {
    a.startOver();
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhatYouGet />
        <Analyzer a={a} />
        {a.result && (
          <section id="results" ref={resultsRef} className="section section--results">
            <div className="container">
              <Reveal className="section__head">
                <h2>Your resume review</h2>
                <p>Suggestions only. Your original file was not changed.</p>
              </Reveal>
              <ResultsDashboard
                key={a.resultId}
                result={a.result}
                originalText={a.extract.text}
                onStartOver={startOver}
              />
            </div>
          </section>
        )}
        <PrivacySection />
      </main>
      <Footer />
    </>
  );
}
