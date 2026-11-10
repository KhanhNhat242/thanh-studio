import type { ReactNode } from "react";
import { nb } from "@/lib/text";

interface SectionHeadingProps {
  /** Tên mục ngắn (trùng nhãn menu) — chỉ dùng khi tiêu đề không tự nói lên mục đó */
  eyebrow?: string;
  title: string;
  description?: string;
  /**
   * center: căn giữa · left: căn trái ·
   * split: kiểu tạp chí — tiêu đề lớn bên trái, đoạn dẫn lệch sang phải (desktop)
   */
  align?: "center" | "left" | "split";
  /** blush: đang đặt trên nền hồng phấn → toàn bộ chữ dùng ink để đủ tương phản */
  tone?: "light" | "blush";
  /** Thẻ tiêu đề — dùng "h1" khi đây là tiêu đề chính của trang */
  as?: "h1" | "h2";
  /** Nội dung chèn thêm dưới mô tả */
  children?: ReactNode;
  className?: string;
}

/** Cụm tiêu đề section: nhãn mục nhỏ + tiêu đề serif lớn nét mảnh + đoạn dẫn. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "split",
  tone = "light",
  as: Heading = "h2",
  children,
  className = "",
}: SectionHeadingProps) {
  const center = align === "center";
  const split = align === "split";
  const bodyColor = tone === "blush" ? "text-ink" : "text-ink/80";

  const head = (
    <>
      {eyebrow && (
        <p
          className={`text-[14px] font-medium ${tone === "blush" ? "text-ink" : "text-champagne-deep"}`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={`${eyebrow ? "mt-4" : ""} font-serif text-[38px] leading-[1.08] font-light tracking-[-0.01em] text-ink sm:text-[46px] md:text-[56px] xl:text-[64px]`}
      >
        {nb(title)}
      </Heading>
    </>
  );

  const body = description && (
    <p
      className={`text-[16px] leading-[1.8] md:text-[17px] ${bodyColor} ${center ? "mx-auto max-w-[580px]" : "max-w-[460px]"}`}
    >
      {nb(description)}
    </p>
  );

  if (split) {
    return (
      <div
        data-reveal="up" suppressHydrationWarning
        className={`grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 ${className}`}
      >
        <div className="lg:col-span-7">{head}</div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
          {body}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="up" suppressHydrationWarning
      className={`${center ? "mx-auto text-center" : ""} max-w-[820px] ${className}`}
    >
      {head}
      {body && <div className="mt-6">{body}</div>}
      {children}
    </div>
  );
}
