/** Σήμα του σχολείου: κλειδί του σολ μέσα σε ορειχάλκινο δακτύλιο. */
export default function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="msp-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8fbfa" />
          <stop offset="45%" stopColor="#35b7ae" />
          <stop offset="100%" stopColor="#08716d" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22.2" fill="none" stroke="url(#msp-brass)" strokeWidth="1.3" />
      <circle cx="24" cy="24" r="18.4" fill="none" stroke="url(#msp-brass)" strokeWidth="0.5" opacity="0.55" />
      <path
        d="M24.6 9.5c-2.6 2.5-4.1 5.4-4.1 8.6 0 2.3.7 4.2 1.7 6.3-3.3 2.2-5.2 4.7-5.2 7.9 0 3.6 2.8 6.4 6.5 6.4.9 0 1.7-.1 2.5-.4l.4 3c.2 1.9-.7 3-2.2 3-.9 0-1.6-.4-2-1 1.2-.1 2.1-1 2.1-2.2 0-1.3-1-2.3-2.4-2.3-1.5 0-2.6 1.2-2.6 2.8 0 2.3 2 4 4.8 4 3 0 5-2.1 4.6-5.4l-.5-3.6c2.5-1 4.1-3.2 4.1-5.9 0-3.2-2.4-5.7-5.7-5.9l-.5-3.5c2.4-2.4 3.7-4.7 3.7-7.3 0-2.4-1.2-4.2-2.6-5.4Zm.5 3c.7.7 1.1 1.7 1.1 2.9 0 1.8-.9 3.4-2.5 5-.5-1.2-.8-2.3-.8-3.4 0-1.9.8-3.4 2.2-4.5ZM23 26.7l1.2 8.5c-.4.1-.8.2-1.2.2-2.4 0-4.2-1.8-4.2-4.2 0-2 1.2-3.6 3.2-4.5h1Zm2.9.2c2 .3 3.4 1.8 3.4 3.8 0 1.6-.9 2.9-2.3 3.6l-1.1-7.4Z"
        fill="url(#msp-brass)"
      />
    </svg>
  );
}
