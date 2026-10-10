import { useState } from 'react';
import { useScrolled } from '../hooks/useScrollEffects';
import { Logo, MenuIcon, CloseIcon } from './Icons';

export default function Header() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container site-header__bar">
        <a className="brand" href="#top" onClick={close}>
          <Logo />
          <span>Resume Advisor</span>
        </a>
        <nav id="site-nav" className="site-nav" aria-label="Primary">
          <a href="#how" onClick={close}>How it works</a>
          <a href="#review" onClick={close}>What you get</a>
          <a href="#analyze" onClick={close}>Analyze</a>
          <a href="#privacy" onClick={close}>Privacy</a>
        </nav>
        <a className="btn btn--mark btn--sm site-header__cta" href="#analyze">Upload resume</a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
