import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

const quickLinks = [
  { label: "Câu chuyện", href: "#cau-chuyen" },
  { label: "Album", href: "#album" },
  { label: "Bảng giá", href: "#bang-gia" },
  { label: "Đặt lịch", href: "#dat-lich" },
];

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-cream">
      <Container className="py-[72px]">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.3fr_0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Logo tone="cream" />
            <p className="mt-6 font-serif text-[28px] leading-snug font-light text-cream italic">
              “Làm cho đúng, cho&nbsp;đủ&nbsp;tình”
            </p>
            <p className="mt-3 max-w-[340px] text-[14px] leading-relaxed text-cream/75">
              Ảnh cưới chuyên nghiệp – make up thời thượng – lưu&nbsp;giữ&nbsp;khoảnh&nbsp;khắc.
            </p>
          </div>

          <nav aria-label="Liên kết nhanh" className="text-center md:text-left">
            <h3 className="text-[11px] font-medium tracking-[0.32em] text-champagne uppercase">
              Khám phá
            </h3>
            <ul className="mt-4 space-y-0.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-11 items-center text-[15px] text-cream/85 transition-colors hover:text-champagne"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-center md:col-span-2 md:text-left lg:col-span-1">
            <h3 className="text-[11px] font-medium tracking-[0.32em] text-champagne uppercase">
              Liên hệ
            </h3>
            <ul className="mt-6 space-y-4 text-[15px] text-cream/80">
              <li className="flex items-start justify-center gap-3 md:justify-start">
                <PinIcon className="mt-0.5 size-[18px] shrink-0 text-champagne" />
                <span>{siteConfig.branches.hue.address}</span>
              </li>
              <li>
                <a
                  href={siteConfig.links.tel}
                  className="inline-flex items-center gap-3 transition-colors hover:text-champagne"
                >
                  <PhoneIcon className="size-[18px] text-champagne" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.email}
                  className="inline-flex items-center gap-3 break-all transition-colors hover:text-champagne"
                >
                  <MailIcon className="size-[18px] shrink-0 text-champagne" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-champagne"
                >
                  <FacebookIcon className="size-[18px] text-champagne" />
                  Fanpage Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-cream/10 pt-7 text-[12px] tracking-[0.06em] text-cream/70 md:flex-row md:justify-between">
          <p>© {siteConfig.legalName}</p>
          <p>{siteConfig.openingHours}</p>
        </div>
      </Container>
    </footer>
  );
}
