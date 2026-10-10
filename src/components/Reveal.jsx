import { useReveal } from '../hooks/useReveal';

/** Fades and slides content in when it enters the viewport, and back out when it leaves. */
export default function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
