import { Link } from "react-router-dom";

export function LogoMark({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="21.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M11.5 26a12.5 12.5 0 0 0 25 0Z" fill="currentColor" />
      <rect x="20" y="38" width="8" height="3" rx="1.5" fill="currentColor" />
      <path
        d="M17.5 21.5c-1.7-2.3.9-3.4.4-5.5"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 22c-1.7-2.3.9-3.4.4-5.5"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30.5 21.5c-1.7-2.3.9-3.4.4-5.5"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      data-testid="logo-link"
      aria-label="Chiransh Foods — Home"
      className="group inline-flex items-center gap-2.5"
    >
      <LogoMark
        className={`h-10 w-10 shrink-0 transition-transform duration-500 group-hover:rotate-6 ${
          light ? "text-cream" : "text-leaf"
        }`}
      />
      <span className="leading-none">
        <span
          className={`block font-serif text-[1.4rem] font-semibold tracking-wide ${
            light ? "text-cream" : "text-leaf"
          }`}
        >
          Chiransh
        </span>
        <span className="mt-0.5 block text-[0.55rem] font-display font-semibold uppercase tracking-[0.45em] text-saffron">
          Foods
        </span>
      </span>
    </Link>
  );
}
