"use client";

import { useEffect, useState } from "react";
import { MessengerIcon, PhoneIcon, ZaloIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/lib/site-config";

const items = [
  { label: "Gọi ngay", href: siteConfig.links.tel, Icon: PhoneIcon, external: false },
  { label: "Nhắn Zalo", href: siteConfig.links.zalo, Icon: ZaloIcon, external: true },
  { label: "Messenger", href: siteConfig.links.messenger, Icon: MessengerIcon, external: true },
];

/**
 * Cụm nút liên hệ cố định (F7). Trên mobile tự ẩn khi form đặt lịch đang hiển thị
 * để không che nút gửi form (đã có link Zalo ngay dưới nút gửi).
 */
export function FloatingContact() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const form = document.getElementById("booking-form");
    if (!form) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const io = new IntersectionObserver(
      ([entry]) => setHidden(mq.matches && entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed right-5 bottom-6 z-40 flex flex-col gap-3 transition-[opacity,transform] duration-500 ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      {items.map(({ label, href, Icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group relative grid size-12 place-items-center rounded-full border border-champagne bg-ivory/95 text-ink shadow-float backdrop-blur transition-colors duration-300 hover:bg-champagne"
        >
          <Icon className="size-[22px]" />
          <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden translate-x-2 rounded-full bg-ink px-3.5 py-1.5 text-[12px] tracking-[0.06em] whitespace-nowrap text-cream opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:block">
            {label}
          </span>
        </a>
      ))}
    </div>
  );
}
