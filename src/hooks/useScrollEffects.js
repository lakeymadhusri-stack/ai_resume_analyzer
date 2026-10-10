import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Publishes scroll position as CSS variables: --sy, --progress, --hero-o. */
export function useScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--progress', max > 0 ? String(Math.min(1, y / max)) : '0');
      if (!reduced) {
        root.style.setProperty('--sy', String(Math.round(y)));
        root.style.setProperty('--hero-o', String(Math.max(0, 1 - y / (window.innerHeight * 0.8))));
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/** Sets --p (0 to 1) on an element as it travels through the viewport. */
export function useSectionProgress(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = prefersReducedMotion();
    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const p = reduced ? 1 : (window.innerHeight * 0.62 - rect.top) / rect.height;
      el.style.setProperty('--p', String(Math.max(0, Math.min(1, p))));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
}
