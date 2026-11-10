import type { CSSProperties } from "react";
import { buttonClass } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ReflectiveCard } from "@/components/ui/ReflectiveCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SelectPackageLink } from "@/components/ui/SelectPackageLink";
import { packages, priceNotice } from "@/data/packages";
import { nb } from "@/lib/text";

/** Bảng giá (F3) — chưa có giá chính thức: hiển thị "Liên hệ để nhận báo giá" (REQUIREMENTS mục 9). */
export function Pricing() {
  return (
    <section
      id="bang-gia"
      className="chapter bg-blush-fade"
      style={
        {
          "--fade-from": "var(--color-ivory)",
          "--fade-to": "var(--color-cream)",
        } as CSSProperties
      }
    >
      <Container>
        <SectionHeading
          tone="blush"
          eyebrow=""
          title="Gói chụp và combo trọn gói"
          description="Mỗi đôi bạn một câu chuyện, vì vậy báo giá được tư vấn riêng theo ngày cưới, bối cảnh và trang phục."
        />

        <ul
          data-reveal="up" suppressHydrationWarning
          className="mx-auto mt-12 grid max-w-[480px] gap-6 lg:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
          {packages.map((p) => (
            <li key={p.id} className={p.highlighted ? "order-first lg:order-none" : ""}>
              {/* Thẻ kim loại phản quang (React Bits ReflectiveCard): nghiêng theo chuột, vệt sáng lướt qua.
                  Gói nổi bật: ánh vàng hồng (blush) + viền champagne đậm; gói thường: ánh ngà. */}
              <ReflectiveCard
                tint={p.highlighted ? "var(--color-blush)" : "var(--color-ivory)"}
                rimColor={p.highlighted ? "var(--color-champagne-deep)" : undefined}
              >
              <article className="flex h-full flex-col p-8 md:p-10">
                <h3 className="font-serif text-[32px] leading-tight font-light">{p.name.replace(/^Gói\s+/, "")}</h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink/85">{nb(p.summary)}</p>
                <p className="mt-5 font-serif text-[20px] text-ink italic">{priceNotice}</p>

                <ul className="mt-6 flex-1 divide-y divide-ink/15 border-t border-ink/15">
                  {p.items.map((item) => (
                    <li key={item} className="py-3 text-[15px] leading-[1.55] text-ink">
                      {nb(item)}
                    </li>
                  ))}
                </ul>

                <SelectPackageLink
                  packageId={p.id}
                  className={buttonClass(p.highlighted ? "primary" : "outline", "mt-8 w-full")}
                >
                  Nhận báo giá gói này
                </SelectPackageLink>
              </article>
              </ReflectiveCard>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
