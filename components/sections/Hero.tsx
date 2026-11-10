"use client";
import type { CSSProperties } from "react";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/ButtonLink";
import { heroSlides, type HeroSlide } from "@/data/hero";
import { siteConfig } from "@/lib/site-config";
import { nb } from "@/lib/text";

const SLIDE_MS = 7000;

function SlidePicture({ slide, first }: { slide: HeroSlide; first: boolean }) {
  const common = { alt: slide.alt, sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: slide.desktop });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    src: slide.mobile,
    loading: first ? "eager" : "lazy",
    fetchPriority: first ? "high" : "auto",
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source media="(max-width: 767px)" srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...rest}
        className="absolute inset-0 h-full w-full object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos-d)]"
        style={
          {
            "--pos-d": slide.desktopPosition,
            "--pos-m": slide.mobilePosition,
          } as CSSProperties
        }
      />
    </picture>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  const goTo = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    // Tôn trọng prefers-reduced-motion: không tự chuyển ảnh (thanh tiến trình đứng yên qua CSS)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => goTo((active + 1) % heroSlides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [active, cycle, goTo]);

  const current = heroSlides[active];

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Ảnh nổi bật"
      className="on-dark relative isolate h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink text-cream"
    >
      {/* Ảnh trình chiếu */}
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            key={i === active ? `on-${cycle}` : "off"}
            className={`absolute inset-0 ${i === active ? "ken-burns" : ""}`}
          >
            <SlidePicture slide={slide} first={i === 0} />
          </div>
        </div>
      ))}

      {/* Gradient nhẹ chỉ ở đáy (giữ ảnh sáng, lãng mạn) — đủ để chữ trắng kem đọc rõ */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-ink/75 via-ink/30 via-45% to-transparent md:h-[62%] md:from-ink/65"
      />

      {/* Nội dung */}
      <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-20">
        <div className="mx-auto grid max-w-[1320px] items-end gap-10 px-5 md:px-8 lg:grid-cols-[1fr_auto] xl:px-10">
          <div className="max-w-[680px]">
            {/* Thanh tiến trình — mobile/tablet */}
            <div className="mb-7 flex gap-2 lg:hidden">
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ảnh ${i + 1}: ${s.place}`}
                  aria-current={i === active}
                  className="relative h-6 w-12 py-[11px]"
                >
                  <span className="block h-0.5 w-full overflow-hidden bg-cream/25">
                    {i === active && (
                      <span
                        key={cycle}
                        className="hero-progress block h-full bg-champagne"
                        style={{ "--slide-duration": `${SLIDE_MS}ms` } as CSSProperties}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[15px] text-cream/90 text-shadow-soft">{nb(siteConfig.tagline)}</p>

            <h1 className="mt-5 font-serif text-[48px] leading-[1] font-light tracking-[-0.015em] text-shadow-soft sm:text-[60px] md:text-[80px] xl:text-[104px]">
              Làm cho đúng,
              <br />
              <span className="italic">cho đủ tình.</span>
            </h1>

            <p className="mt-6 max-w-[500px] text-[16px] leading-[1.75] text-cream/90 text-shadow-soft md:text-[17px]">
              {nb(
                "Chụp chậm lại để mỗi khung hình tại Huế, Lăng Cô và Đà Nẵng mang trọn câu chuyện tình yêu của đôi bạn.",
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              <Link href="#dat-lich" className={buttonClass("primary", "w-full px-6 sm:w-auto md:px-8")}>
                Đặt lịch tư vấn
              </Link>
              <Link href="#album" className={buttonClass("outline-light", "w-full px-6 sm:w-auto md:px-8")}>
                Xem album
              </Link>
            </div>
          </div>

          {/* Thông tin slide — desktop */}
          <div className="hidden w-[260px] lg:block">
            <p key={`place-${active}`} className="lightbox-fade text-[14px] text-shadow-soft">
              {current.place}
              <span className="text-cream/80"> · {current.mood}</span>
            </p>
            <div className="mt-4 flex gap-2">
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ảnh ${i + 1}: ${s.place}`}
                  aria-current={i === active}
                  className="group relative h-8 flex-1 py-[15px]"
                >
                  <span className="block h-0.5 w-full overflow-hidden bg-cream/25 transition-colors group-hover:bg-cream/45">
                    {i === active && (
                      <span
                        key={cycle}
                        className="hero-progress block h-full bg-champagne"
                        style={{ "--slide-duration": `${SLIDE_MS}ms` } as CSSProperties}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
