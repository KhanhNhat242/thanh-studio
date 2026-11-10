import { Container } from "@/components/ui/Container";
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
        <SectionHeading eyebrow="Cảm nhận" title="Các cặp đôi kể lại">
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
              <span className="font-medium text-ink">{lead.author}</span> — {lead.note}
            </figcaption>
          </figure>
        )}

        <div data-reveal="up" className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-2 md:gap-16 lg:mt-20">
          {rest.map((t) => (
            <figure key={t.id}>
              <blockquote className="font-serif text-[22px] leading-[1.5] font-light text-ink italic md:text-[26px]">
                “{nb(t.quote)}”
              </blockquote>
              <figcaption className="mt-5 text-[15px] text-muted">
                <span className="font-medium text-ink">{t.author}</span> — {t.note}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
