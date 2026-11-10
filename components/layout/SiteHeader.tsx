"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";
import { homeNav, siteConfig } from "@/lib/site-config";

interface SiteHeaderProps {
  /** overlay: trong suốt trên Hero, chuyển nền kem khi cuộn · solid: luôn nền kem */
  variant?: "overlay" | "solid";
}

export function SiteHeader({ variant = "overlay" }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = variant === "solid" || scrolled;
  const tone = solid ? "ink" : "cream";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] duration-500 ${
          solid
            ? "h-[68px] bg-cream shadow-[0_1px_0_var(--color-line)] md:h-[72px]"
            : "h-[76px] bg-gradient-to-b from-ink/55 to-transparent md:h-[88px]"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-5 md:px-8 xl:px-10">
          <Link href="#top" aria-label={`${siteConfig.name} — Trang chủ`}>
            <Logo tone={tone} />
          </Link>

          <nav aria-label="Điều hướng chính" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {homeNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative py-2 text-[13px] tracking-[0.08em] transition-colors ${
                      solid ? "text-ink/80 hover:text-ink" : "text-cream/90 hover:text-cream"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-champagne transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.links.tel}
              className={`hidden items-center gap-2 text-[13px] tracking-[0.06em] xl:flex ${
                solid ? "text-ink" : "text-cream"
              }`}
            >
              <PhoneIcon className={`size-4 ${solid ? "text-champagne-deep" : "text-champagne"}`} />
              {siteConfig.phoneDisplay}
            </a>
            <Link
              href="#dat-lich"
              className={`hidden min-h-11 items-center px-5 text-[12px] font-medium tracking-[0.14em] uppercase transition-colors duration-300 md:inline-flex ${
                solid
                  ? "bg-champagne text-ink hover:bg-ink hover:text-cream"
                  : "border border-cream/60 text-cream hover:bg-cream hover:text-ink"
              }`}
            >
              Đặt lịch
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Mở menu"
              aria-expanded={open}
              className={`-mr-2 grid size-11 place-items-center lg:hidden ${
                solid ? "text-ink" : "text-cream"
              }`}
            >
              <MenuIcon className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile toàn màn hình */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-cream transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-[68px] items-center justify-between px-5 md:px-8">
          <Logo tone="ink" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
            className="-mr-2 grid size-11 place-items-center text-ink"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>
        <nav aria-label="Menu di động" className="flex flex-1 flex-col justify-center px-8">
          <ul className="space-y-1">
            {homeNav.map((item, i) => (
              <li
                key={item.href}
                className={`transition-[opacity,transform] duration-700 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-serif text-[36px] leading-tight font-light text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line px-8 py-7">
          <Link
            href="#dat-lich"
            onClick={() => setOpen(false)}
            className="flex min-h-12 w-full items-center justify-center bg-champagne text-[13px] font-medium tracking-[0.14em] text-ink uppercase"
          >
            Đặt lịch tư vấn
          </Link>
          <a
            href={siteConfig.links.tel}
            className="mt-4 flex min-h-11 items-center justify-center gap-2 text-[14px] text-ink"
          >
            <PhoneIcon className="size-4 text-champagne-deep" />
            Hotline {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  );
}
