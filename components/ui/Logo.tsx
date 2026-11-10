import Image from "next/image";
import markInk from "@/public/images/logo/logo-mark-ink.png";
import markCream from "@/public/images/logo/logo-mark-cream.png";
import { siteConfig } from "@/lib/site-config";

interface LogoProps {
  /** ink: dùng trên nền sáng · cream: dùng trên ảnh/nền tối */
  tone?: "ink" | "cream";
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Logo = biểu tượng gốc (vòng hoa + đôi nhẫn vàng, đã tách nền & đổi màu)
 * + wordmark serif dựng bằng font để chữ luôn sắc nét ở kích thước nhỏ.
 */
export function Logo({ tone = "ink", size = "sm", className = "" }: LogoProps) {
  const mark = tone === "ink" ? markInk : markCream;
  const text = tone === "ink" ? "text-ink" : "text-cream";
  // Chữ nhấn: champagne đậm trên nền sáng (≥ 4.5:1), champagne sáng trên nền tối
  const accent = tone === "ink" ? "text-champagne-deep" : "text-champagne";

  if (size === "lg") {
    return (
      <span className={`flex flex-col items-center text-center ${className}`}>
        <Image src={mark} alt="" className="h-24 w-auto" sizes="100px" />
        <span
          className={`mt-4 font-serif text-[22px] font-medium tracking-[0.28em] uppercase ${text}`}
        >
          {siteConfig.name}
        </span>
        <span className={`mt-1 text-[11px] tracking-[0.5em] uppercase ${accent}`}>
          Huế
        </span>
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image src={mark} alt="" className="h-11 w-auto md:h-12" sizes="50px" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-[17px] font-semibold tracking-[0.2em] uppercase md:text-[18px] ${text}`}
        >
          Thanh Studio
        </span>
        <span className={`mt-1.5 text-[10px] font-medium tracking-[0.42em] uppercase ${accent}`}>
          Wedding · Huế
        </span>
      </span>
    </span>
  );
}
