import { Container } from "@/components/ui/Container";
import { ClockIcon, MailIcon, MapIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { BookingForm } from "@/components/sections/BookingForm";
import { siteConfig } from "@/lib/site-config";
import { nb } from "@/lib/text";

/** Form đặt lịch (F4) + thông tin liên hệ & bản đồ chi nhánh (F6) */
export function Booking() {
  const { hue, daNang } = siteConfig.branches;

  return (
    <section id="dat-lich" className="chapter bg-ivory">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Cột trái: tiêu đề + liên hệ + bản đồ */}
          <div data-reveal="up" className="lg:col-span-5">
            <p className="text-[14px] font-medium text-champagne-deep">Liên hệ</p>
            <h2 className="mt-4 font-serif text-[38px] leading-[1.08] font-light tracking-[-0.01em] sm:text-[46px] md:text-[56px]">
              {nb("Đặt lịch tư vấn & giữ chỗ")}
            </h2>
            <p
              className="mt-6 max-w-[460px] text-[16px] leading-[1.8] text-ink/80 md:text-[17px]"
            >
              {nb(
                "Để lại thông tin ngày cưới, ekip Thanh Studio sẽ liên hệ tư vấn lịch trình và báo giá chi tiết.",
              )}
            </p>

            <ul className="mt-9 space-y-5 text-[15px]">
              <li className="flex gap-4">
                <PinIcon className="mt-0.5 size-5 shrink-0 text-champagne-deep" />
                <div>
                  <p className="font-medium">{hue.name}</p>
                  <p className="mt-0.5 text-muted">{hue.address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapIcon className="mt-0.5 size-5 shrink-0 text-champagne-deep" />
                <div>
                  <p className="font-medium">{daNang.name}</p>
                  <p className="mt-0.5 text-muted">{daNang.note}</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <PhoneIcon className="size-5 shrink-0 text-champagne-deep" />
                <p>
                  Hotline / Zalo:{" "}
                  <a href={siteConfig.links.tel} className="font-medium hover:text-champagne-deep">
                    {siteConfig.phoneDisplay}
                  </a>
                </p>
              </li>
              <li className="flex items-center gap-4">
                <MailIcon className="size-5 shrink-0 text-champagne-deep" />
                <a href={siteConfig.links.email} className="break-all hover:text-champagne-deep">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <ClockIcon className="size-5 shrink-0 text-champagne-deep" />
                <p>{siteConfig.openingHours}</p>
              </li>
            </ul>

            <div className="mt-9">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-cream">
                <iframe
                  title={`Bản đồ ${hue.name}`}
                  src={hue.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full [filter:grayscale(0.35)_sepia(0.15)]"
                />
              </div>
              <a
                href={hue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-ink underline decoration-champagne underline-offset-[6px] hover:text-champagne-deep"
              >
                <PinIcon className="size-4 text-champagne-deep" />
                Chỉ đường tới studio
              </a>
            </div>
          </div>

          {/* Cột phải: form */}
          <div
            id="booking-form"
            data-reveal="up"
            className="w-full max-w-[600px] self-start justify-self-center border border-line bg-cream p-6 sm:p-8 md:p-10 lg:sticky lg:top-28 lg:col-span-6 lg:col-start-7 lg:justify-self-end"
          >
            <p className="font-serif text-[30px] leading-tight font-light md:text-[34px]">
              {nb("Thông tin ngày vui của hai bạn")}
            </p>
            <p className="mt-3 mb-8 text-[14px] leading-[1.6] text-muted">
              {nb("Chỉ cần 3 thông tin bắt buộc: số điện thoại, ngày cưới và gói quan tâm.")}
            </p>
            <BookingForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
