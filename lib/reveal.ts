import type { CSSProperties } from "react";

/** Style trễ cho hiệu ứng data-reveal (stagger) */
export const revealDelay = (ms: number): CSSProperties =>
  ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;
