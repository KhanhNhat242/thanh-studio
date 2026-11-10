import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function ZaloIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        d="M12 3.5c-5 0-9 3.4-9 7.6 0 2.4 1.3 4.5 3.3 5.9l-.6 3.2 3.2-1.7c1 .3 2 .4 3.1.4 5 0 9-3.4 9-7.8S17 3.5 12 3.5Z"
      />
      <text
        x="12"
        y="13.6"
        textAnchor="middle"
        fontSize="5.6"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Arial, sans-serif"
      >
        Zalo
      </text>
    </svg>
  );
}

export function MessengerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3c-5 0-9 3.7-9 8.4 0 2.6 1.2 4.9 3.2 6.4V21l3-1.6c.9.2 1.8.4 2.8.4 5 0 9-3.7 9-8.4S17 3 12 3Z" />
      <path d="m7.5 13.5 3-3.2 2.2 2.2 3.8-2.2-3 3.2-2.2-2.2-3.8 2.2Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M20 12H4m6-6-6 6 6 6" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
    </svg>
  );
}

export function RingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="9" cy="14" r="5.5" />
      <circle cx="15" cy="14" r="5.5" />
      <path d="m10.5 4.5 1.5-2 1.5 2-1.5 2-1.5-2Z" />
    </svg>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
      <path d="M9 4v14m6-12v14" />
    </svg>
  );
}

export function MountainIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m3 19 6.5-10 4 6 2.5-3.5L21 19H3Z" />
      <circle cx="17" cy="6" r="1.8" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 40" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M0 40V24.6C0 10.8 6.2 2.6 18.6 0l2 4.4C13.8 6.6 10.4 11 10.4 18h8.4v22H0Zm27.2 0V24.6C27.2 10.8 33.4 2.6 45.8 0l2 4.4C41 6.6 37.6 11 37.6 18H46v22H27.2Z"
      />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
