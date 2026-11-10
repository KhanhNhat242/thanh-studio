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
    <div ref={trackRef} className="locations-track" style={{ "--steps": n - 1, "--step": STEP_VH } as CSSProperties}>
      <div className="locations-stage">
        <div className="shrink-0">{heading}</div>

        <div className="locations-deck">
          {locations.map((loc, i) => {
            const textTop = loc.mobileText !== "bottom";
            return (
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
                  className="locations-card__img object-cover"
                  style={
                    {
                      "--pos": loc.imagePosition ?? "50% 50%",
                      "--pos-m": loc.imagePositionMobile ?? loc.imagePosition ?? "50% 50%",
                    } as CSSProperties
                  }
                />
                <span
                  aria-hidden
                  className={`absolute inset-0 from-ink/85 via-ink/25 via-50% to-transparent md:bg-gradient-to-t ${textTop ? "bg-gradient-to-b" : "bg-gradient-to-t"
                    }`}
                />
                <span aria-hidden className="locations-card__dim absolute inset-0 bg-ink" />
                {/* Mobile: chữ mặc định ở trên thẻ (người trong ảnh thường ở giữa/dưới); khi ở dưới thì pr-16 chừa chỗ
                  cho cụm nút Gọi/Zalo/Messenger cố định (F7). Desktop: chữ luôn ở dưới. */}
                <div
                  className={`absolute inset-x-0 p-6 text-cream text-shadow-soft md:top-auto md:bottom-0 md:p-10 ${textTop ? "top-0" : "bottom-0 pr-16"
                    } ${loc.textSide === "right" ? "md:flex md:flex-col md:items-end md:text-right" : ""
                    }`}
                >
                  <h3 className="font-serif text-[34px] leading-[1.05] font-light md:text-[56px]">{loc.name}</h3>
                  <p className={`mt-3 max-w-[520px] text-[15px] leading-[1.65] text-cream/90 md:block md:text-[16px] ${textTop ? "" : "hidden"}`}>
                    {nb(loc.description)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
