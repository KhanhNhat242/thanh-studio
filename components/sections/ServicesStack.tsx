"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { useScrollProgress } from "@/components/ui/useScrollProgress";
import { nb } from "@/lib/text";
import type { Service } from "@/types/content";

/** Quãng cuộn cho mỗi lần chuyển sang thẻ kế tiếp (× chiều cao màn hình) */
const STEP_VH = 0.7;

/**
 * Dịch vụ dạng thẻ xếp chồng: thẻ giữa to & ở trước, hai bên lùi ra sau.
 * Section bám dính; cuộn dọc tới đâu, dãy thẻ trượt ngang (phải → trái) tới đó để đưa dịch vụ kế tiếp ra giữa.
 */
export function ServicesStack({ services, heading }: { services: Service[]; heading: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const n = services.length;

  const paint = useCallback(
    (p: number) => {
      const pos = p * (n - 1);
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const off = i - pos;
        card.style.setProperty("--off", off.toFixed(4));
        card.style.setProperty("--depth", Math.abs(off).toFixed(4));
        card.style.zIndex = String(100 - Math.round(Math.abs(off) * 10));
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${(pos + 1) / n})`;
    },
    [n],
  );
  useScrollProgress(trackRef, paint);

  return (
    <div ref={trackRef} className="services-track" style={{ "--steps": n - 1, "--step": STEP_VH } as CSSProperties}>
      <div className="services-stage">
        <div className="shrink-0">{heading}</div>

        <div className="services-deck">
          {services.map((s, i) => (
            <Link
              key={s.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              href="#dat-lich"
              aria-label={`${s.title} — tư vấn dịch vụ này`}
              className="services-card group"
              style={{ "--off": i, "--depth": i } as CSSProperties}
            >
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 380px, 66vw"
                style={{ objectPosition: s.objectPosition }}
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent via-40% to-ink/80" />
              <span aria-hidden className="services-card__dim absolute inset-0 bg-ink" />
              <span className="absolute inset-x-0 top-0 p-5 md:p-6">
                <span className="block font-serif text-[26px] leading-[1.02] font-light text-cream text-shadow-soft md:text-[36px]">
                  {nb(s.title)}
                </span>
              </span>
              <span className="services-card__body absolute inset-x-0 bottom-0 p-5 text-cream md:p-6">
                {s.badge && (
                  <span className="mb-3 inline-block bg-blush px-2.5 py-0.5 text-[12px] font-medium text-ink">{s.badge}</span>
                )}
                <span className="block text-[14px] leading-[1.6] text-cream/90 md:text-[15px]">{nb(s.description)}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-cream underline decoration-champagne underline-offset-[6px]">
                  Tư vấn dịch vụ
                  <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Thanh tiến độ: đã xem tới dịch vụ thứ mấy */}
        <div className="mx-auto mb-6 h-px w-40 shrink-0 bg-ink/15 md:mb-10">
          <span ref={barRef} className="block h-full origin-left bg-champagne-deep" style={{ transform: `scaleX(${1 / n})` }} />
        </div>
      </div>
    </div>
  );
}
