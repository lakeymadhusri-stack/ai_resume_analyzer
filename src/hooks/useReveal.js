import { useEffect, useRef, useState } from 'react';

/**
 * True while the element is inside the viewport. It flips back to false when the
 * element scrolls out, which is what drives both fade-in and fade-out.
 */
export function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '-7% 0px -7% 0px',
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
}
