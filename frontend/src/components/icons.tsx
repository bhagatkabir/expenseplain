// Minimal hand-rolled icon set (no external icon dependency).
// Each icon accepts a `className` for sizing/color via Tailwind.

type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LogoMark({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.25" r="1.35" fill="currentColor" stroke="none" />
      <path d="M7 6V5.2A2.2 2.2 0 0 1 9.2 3h5.6A2.2 2.2 0 0 1 17 5.2V6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.25 12.5 2.5 2.5 5-5.5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4.5 12h15" />
      <path d="M13 5.5 19.5 12 13 18.5" />
    </svg>
  );
}

export function ReceiptIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M6 3h12v18l-2.5-1.6L13 21l-1.5-1.6L10 21l-2.5-1.6L5 21V3Z" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </svg>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M2.5 20h19" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M12 3.5 19 6.5v5.4c0 4.4-3 7.6-7 8.6-4-1-7-4.2-7-8.6V6.5Z" />
      <path d="m9.25 12 1.9 1.9L15 10" />
    </svg>
  );
}

export function SyncIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.66 5.66L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M11.5 4H5a1 1 0 0 0-1 1v6.5a1 1 0 0 0 .3.7l9 9a1 1 0 0 0 1.4 0l6.5-6.5a1 1 0 0 0 0-1.4l-9-9a1 1 0 0 0-.7-.3Z" />
      <circle cx="8.25" cy="8.25" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}
