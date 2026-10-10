import { Logo } from './Icons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__bar">
        <span className="brand brand--dim"><Logo width={24} height={24} /> Resume Advisor</span>
        <p>AI-generated feedback. Always review it before using it.</p>
      </div>
    </footer>
  );
}
