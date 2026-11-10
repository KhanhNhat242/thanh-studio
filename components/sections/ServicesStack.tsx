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
        // Dãy thẻ chạy vòng: off ∈ [-n/2, n/2) → thẻ giữa luôn có 2 thẻ phụ mỗi bên (thẻ đầu: 4 & 5 nằm bên trái).
        // Thẻ vòng từ mép phải sang mép trái ở |off| = 2.5, lúc đó đã mờ hẳn (opacity 0) nên không thấy nhảy.
        const off = ((((i - pos + n / 2) % n) + n) % n) - n / 2;
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
              style={{ "--off": i > n / 2 ? i - n : i, "--depth": Math.abs(i > n / 2 ? i - n : i) } as CSSProperties}
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
              {/* Tiêu đề (trên) và phần chữ (dưới) chung một cột flex: thiếu chỗ thì đoạn mô tả co lại & bị cắt,
                  không bao giờ đè lên tiêu đề */}
              <span className="absolute inset-0 flex flex-col p-5 md:p-6">
                <span className="services-card__title block shrink-0 font-serif text-[26px] leading-[1.02] font-light text-cream text-shadow-soft md:text-[36px]">
                  {nb(s.title)}
                </span>
                <span className="services-card__body mt-4 flex min-h-0 flex-1 flex-col justify-end text-cream">
                  {s.badge && (
                    <span className="mb-3 shrink-0 self-start bg-blush px-2.5 py-0.5 text-[12px] font-medium text-ink">{s.badge}</span>
                  )}
                  <span className="services-card__desc block min-h-0 overflow-hidden text-[14px] leading-[1.6] text-cream/90 md:text-[15px]">
                    {nb(s.description)}
                  </span>
                  <span className="mt-3 inline-flex shrink-0 items-center gap-2 self-start text-[14px] font-medium text-cream underline decoration-champagne underline-offset-[6px]">
                    Tư vấn dịch vụ
                    <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
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
