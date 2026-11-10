"use client";

import Image from "next/image";
import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollProgress } from "@/components/ui/useScrollProgress";
import { nb } from "@/lib/text";
import type { Location } from "@/types/content";

/** Quãng cuộn cho mỗi thẻ mới trượt lên (× chiều cao màn hình) */
const STEP_VH = 0.75;

/**
 * Bối cảnh dạng thẻ ngang xếp chồng: thẻ đang xem nằm trước, các thẻ đã xem lùi ra sau (nhỏ dần, ló lên phía trên).
 * Section bám dính; cuộn tới đâu, thẻ kế tiếp trượt từ dưới lên phủ lên thẻ hiện tại tới đó.
 */
export function LocationsStack({ locations, heading }: { locations: Location[]; heading: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const n = locations.length;

  const paint = useCallback(
    (p: number) => {
      const pos = p * (n - 1);
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rel = i - pos;
        // rel > 0: thẻ sắp tới (đang trượt lên từ dưới) · rel ≤ 0: thẻ đã hiện, -rel = độ lùi ra sau
        card.style.setProperty("--rise", Math.max(0, rel).toFixed(4));
        card.style.setProperty("--back", Math.max(0, -rel).toFixed(4));
      });
    },
    [n],
  );
  useScrollProgress(trackRef, paint);

  return (
    <>
      {/* Tiêu đề đứng trước sân khấu bám dính → chồng thẻ được chiếm trọn chiều cao màn hình */}
      {heading}
      <div ref={trackRef} className="locations-track" style={{ "--steps": n - 1, "--step": STEP_VH } as CSSProperties}>
        <div className="locations-stage">

          <div className="locations-deck">
            {locations.map((loc, i) => (
              <article
                key={loc.key}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="locations-card on-dark"
                style={{ "--rise": i, "--back": 0, zIndex: i + 1 } as CSSProperties}
              >
                <Image
                  src={loc.image}
                  alt={loc.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 1000px, 92vw"
                  className="object-cover"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 via-50% to-transparent" />
                <span aria-hidden className="locations-card__dim absolute inset-0 bg-ink" />
                {/* pr-16 trên mobile: chừa chỗ cho cụm nút Gọi/Zalo/Messenger cố định (F7) */}
                <div className="absolute inset-x-0 bottom-0 p-6 pr-16 text-cream text-shadow-soft md:p-10">
                  <h3 className="font-serif text-[34px] leading-[1.05] font-light md:text-[56px]">{loc.name}</h3>
                  <p className="mt-3 max-w-[520px] text-[15px] leading-[1.65] text-cream/90 md:text-[16px]">
                    {nb(loc.description)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
