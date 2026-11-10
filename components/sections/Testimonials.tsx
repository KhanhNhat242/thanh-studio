import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { QuoteIcon, UserIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";
import { siteConfig } from "@/lib/site-config";
import { nb } from "@/lib/text";

/**
 * Cảm nhận khách hàng (F5) — trích dẫn kiểu tạp chí, không dùng thẻ có sao
 * (REQUIREMENTS mục 9: không bịa số sao; con số duy nhất: "100% khách đề xuất trên Facebook").
 */
export function Testimonials() {
  const [lead, ...rest] = testimonials;

  return (
    <section id="cam-nhan" className="chapter bg-cream">
      <Container>
        <SectionHeading eyebrow="" title="Các cặp đôi kể lại">
          <p className="text-[16px] leading-[1.8] text-ink/80 md:text-[17px]">
            100% khách đề xuất Thanh Studio trên{" "}
            <a
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-champagne underline-offset-[6px] hover:text-champagne-deep"
            >
              Facebook
            </a>
            .
          </p>
        </SectionHeading>

        {lead && (
          <figure data-reveal="up" className="mt-16 max-w-[980px] lg:mt-24">
            <blockquote className="font-serif text-[28px] leading-[1.35] font-light text-ink italic md:text-[38px] xl:text-[44px]">
              “{nb(lead.quote)}”
            </blockquote>
            <figcaption className="mt-6 text-[15px] text-muted">
              {/* <span className="font-medium text-ink">{lead.author}</span> — {lead.note} */}
            </figcaption>
          </figure>
        )}

        {/* Thẻ cảm nhận: dấu ngoặc kép lớn, tên + dòng phụ, ô đại diện tròn góc phải, mảng màu nhấn lệch phía sau.
            Không có hàng sao / điểm đánh giá — REQUIREMENTS mục 9 cấm bịa số sao. */}
        <div data-reveal="up" className="mt-20 grid gap-14 md:grid-cols-2 md:gap-10 lg:mt-24 lg:gap-14">
          {rest.map((t, i) => (
            // Thẻ nổi bồng bềnh trên mặt nước (cùng hệ .float-water với ảnh About); hai thẻ lệch nhịp nhau
            <div
              key={t.id}
              className="float-water relative"
              style={{ "--float-tilt": 0.35, ...(i % 2 ? { "--float-period": "8.5s" } : {}) } as CSSProperties}
            >
              <span aria-hidden className="float-water__ripple" />
              <span aria-hidden className="float-water__ripple float-water__ripple--late" />
              <span aria-hidden className="float-water__shadow" />
              <div className="float-water__item relative h-full pr-3 pb-3 md:pr-4 md:pb-4">
              <span aria-hidden className="absolute top-12 right-0 bottom-0 left-12 rounded-sm bg-blush" />
              <figure className="relative h-full rounded-sm bg-ivory p-7 pt-9 shadow-soft md:p-9 md:pt-10">
                {/* TODO(content): thay biểu tượng bằng ảnh thật của cặp đôi khi được khách đồng ý */}
                <span
                  aria-hidden
                  className="absolute -top-8 right-6 grid size-16 place-items-center rounded-full bg-champagne-deep text-ivory ring-[6px] ring-cream md:size-[72px]"
                >
                  <UserIcon className="size-8" />
                </span>
                <figcaption className="flex items-start gap-4 pr-16">
                  <QuoteIcon className="mt-1 h-9 w-11 shrink-0 text-champagne" />
                  <span>
                    <span className="block font-serif text-[24px] leading-[1.15] text-ink md:text-[26px]">{t.author}</span>
                    <span className="mt-1 block text-[14px] text-champagne-deep">{t.note}</span>
                  </span>
                </figcaption>
                <blockquote className="mt-6 text-[16px] leading-[1.75] text-ink/85">{nb(t.quote)}</blockquote>
              </figure>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
