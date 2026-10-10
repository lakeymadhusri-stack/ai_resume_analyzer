const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Logo = (p) => (
  <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true" {...p}>
    <rect width="64" height="64" rx="16" fill="#FFE066" />
    <rect x="16" y="12" width="26" height="36" rx="3" fill="#0F1B2D" />
    <rect x="21" y="19" width="14" height="3" rx="1.5" fill="#5DD6D0" />
    <rect x="21" y="26" width="16" height="3" rx="1.5" fill="#fff" />
    <rect x="21" y="33" width="10" height="3" rx="1.5" fill="#5B6B80" />
    <path d="M36 46l12-12 4 4-12 12-5 1z" fill="#D93F4C" />
  </svg>
);
export const UploadIcon = (p) => (<svg {...base} {...p}><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>);
export const FileIcon = (p) => (<svg {...base} {...p}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>);
export const CloseIcon = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const CheckIcon = (p) => (<svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const AlertIcon = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.2v.1" /></svg>);
export const LockIcon = (p) => (<svg {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>);
export const MenuIcon = (p) => (<svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const ArrowDown = (p) => (<svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>);
