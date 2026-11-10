import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { locations } from "@/data/locations";
import { revealDelay } from "@/lib/reveal";
import { nb } from "@/lib/text";
import type { LocationKey } from "@/types/content";

/**
 * Bento (desktop 3 cột): Huế — bối cảnh đặc trưng — chiếm ô lớn nhất 2×2,
 * Lăng Cô & Đà Nẵng 1×1, Phim trường dải ngang 3×1. Bo góc nhỏ, không bóng đổ.
 */
const tile: Record<LocationKey, { li: string; sizes: string; large: boolean }> = {
  hue: {
    li: "min-h-[520px] sm:col-span-2 lg:row-span-2 lg:min-h-0",
    sizes: "(min-width: 1024px) 66vw, 100vw",
    large: true,
  },
  "lang-co": {
    li: "min-h-[420px] lg:min-h-0",
    sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
    large: false,
  },
  "da-nang": {
    li: "min-h-[420px] lg:min-h-0",
    sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
    large: false,
  },
  "phim-truong": {
    li: "min-h-[420px] sm:col-span-2 lg:col-span-3 lg:min-h-0",
    sizes: "100vw",
    large: false,
  },
};

/** Bối cảnh chụp — giúp cặp đôi ở xa hình dung nơi chụp. */
export function Locations() {
  return (
    <section id="boi-canh" className="chapter bg-cream">
      <Container>
        <SectionHeading
          eyebrow="Bối cảnh"
          title="Huế, Lăng Cô, Đà Nẵng hay phim trường"
          description="Gợi ý nơi chụp và lịch trình, để cả những cặp đôi ở xa cũng dễ hình dung trước buổi chụp."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:grid-rows-[400px_400px_360px] lg:gap-5">
          {locations.map((loc, i) => {
            const t = tile[loc.key];
            return (
              <li key={loc.key} data-reveal="up" style={revealDelay(i * 110)} className={t.li}>
                <article className="on-dark group relative h-full overflow-hidden rounded-sm bg-ink">
                  <Image
                    src={loc.image}
                    alt={loc.imageAlt}
                    fill
                    placeholder="blur"
                    sizes={t.sizes}
                    className="hover-zoom object-cover transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-ink/90 via-ink/55 via-50% to-transparent"
                  />
                  <div className={`absolute inset-x-0 bottom-0 text-cream text-shadow-soft ${t.large ? "p-7 md:p-10" : "p-6"}`}>
                    <h3
                      className={`font-serif leading-[1.05] font-light ${
                        t.large ? "text-[40px] md:text-[56px]" : "text-[30px] md:text-[32px]"
                      }`}
                    >
                      {loc.name}
                    </h3>
                    <p
                      className={`mt-3 leading-[1.65] text-cream/90 ${
                        t.large ? "max-w-[420px] text-[16px]" : "max-w-[360px] text-[14.5px]"
                      }`}
                    >
                      {nb(loc.description)}
                    </p>
                    <p
                      className={`mt-4 border-t border-cream/25 pt-4 text-[13.5px] leading-[1.6] text-champagne ${
                        t.large ? "max-w-[420px]" : "max-w-[360px]"
                      }`}
                    >
                      {nb(loc.itinerary)}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
