import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "outline-light" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-champagne text-ink hover:bg-ink hover:text-cream border border-champagne hover:border-ink",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  "outline-light":
    "border border-cream/60 text-cream hover:bg-cream hover:text-ink hover:border-cream",
  ghost: "text-ink hover:text-champagne-deep",
};

export const buttonClass = (variant: Variant = "primary", extra = "") =>
  `inline-flex min-h-12 items-center justify-center gap-2.5 px-7 text-[13px] font-medium tracking-[0.14em] uppercase transition-colors duration-300 ${variants[variant]} ${extra}`;

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
    </Link>
  );
}
