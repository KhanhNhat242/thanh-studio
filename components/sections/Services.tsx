import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";
import { nb } from "@/lib/text";
import type { Service } from "@/types/content";

/**
 * Bố cục so le kiểu trang tạp chí (desktop, lưới 12 cột):
 * hàng 1: ảnh ngang lớn + ảnh dọc lệch xuống · hàng 2: đảo ngược · hàng 3: combo trọn gói nổi bật.
 */
const layout = [
  { li: "lg:col-span-7", media: "aspect-[4/5] sm:aspect-[4/3]", sizes: "(min-width: 1024px) 56vw, 50vw" },
  { li: "lg:col-span-4 lg:col-start-9 lg:mt-40", media: "aspect-[4/5] sm:aspect-[3/4]", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { li: "lg:col-span-4", media: "aspect-[4/5] sm:aspect-[3/4]", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { li: "lg:col-span-7 lg:col-start-6 lg:mt-28", media: "aspect-[4/5] sm:aspect-[4/3]", sizes: "(min-width: 1024px) 56vw, 50vw" },
];

function ServiceText({ s }: { s: Service }) {
  return (
    <>
      <h3 className="font-serif text-[28px] leading-[1.12] font-normal transition-colors group-hover:text-champagne-deep md:text-[32px]">
        {nb(s.title)}
      </h3>
      <p className="mt-3 max-w-[460px] text-[15.5px] leading-[1.75] text-muted">{nb(s.description)}</p>
    </>
  );
}

/** 5 dịch vụ chính — đúng thứ tự REQUIREMENTS mục 4. */
export function Services() {
  const regular = services.slice(0, 4);
  const feature = services[4];

  return (
    <section id="dich-vu" className="chapter bg-ivory">
      <Container>
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Từ buổi chụp pre-wedding đến ngày cưới"
          description="Năm dịch vụ chăm chút từ buổi chụp pre-wedding, lớp make up, bộ váy cưới đến khoảnh khắc trong ngày trọng đại."
        />

        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          {regular.map((s, i) => (
            <li key={s.id} data-reveal="up" className={layout[i].li}>
              <Link href="#dat-lich" className="group block">
                <div className={`relative overflow-hidden bg-line ${layout[i].media}`}>
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    placeholder="blur"
                    sizes={`${layout[i].sizes}, 100vw`}
                    style={{ objectPosition: s.objectPosition }}
                    className="hover-zoom object-cover transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6">
                  <ServiceText s={s} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Dịch vụ 05 — combo trọn gói, trình bày như bài nổi bật */}
        {feature && (
          <div data-reveal="up" className="mt-20 border-t border-line pt-14 lg:mt-28 lg:pt-20">
            <Link href="#dat-lich" className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-line sm:aspect-[16/10] lg:col-span-7">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  style={{ objectPosition: feature.objectPosition }}
                  className="hover-zoom object-cover transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                {feature.badge && (
                  <span className="mb-5 inline-block bg-blush px-3 py-1 text-[13px] font-medium text-ink">
                    {feature.badge}
                  </span>
                )}
                <ServiceText s={feature} />
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-champagne underline-offset-[6px] group-hover:text-champagne-deep">
                  Tư vấn gói combo
                  <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
