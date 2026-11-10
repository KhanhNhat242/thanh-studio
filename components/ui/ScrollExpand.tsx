"use client";

/*
 * ScrollExpand — chuyển thể từ React Bits (https://reactbits.dev/animations/scroll-expand, bản JS-CSS)
 * sang TypeScript + next/image. Dùng bọc NỘI DUNG của một section; ba pha theo vị trí cuộn:
 *   1. Ảnh nằm trong khung nhỏ giữa màn hình (nội dung section bị che phía sau).
 *   2. Cuộn tiếp → khung mở rộng tới tràn màn hình, ảnh thu từ mediaZoom về 1.
 *   3. Cuộn tiếp → ảnh phóng nhẹ rồi cả sân khấu mờ dần, lộ nội dung section ngay tại chỗ.
 */

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./ScrollExpand.css";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

interface ScrollExpandProps {
  src: StaticImageData;
  alt: string;
  /** Nội dung section — hiện ra khi ảnh mờ đi */
  children: ReactNode;
  /** Kích thước khung lúc đầu, % màn hình (desktop) */
  startWidth?: number;
  startHeight?: number;
  /** Kích thước khung lúc đầu trên mobile (< 768px) — màn dọc nên khung phải rộng hơn */
  startWidthMobile?: number;
  startHeightMobile?: number;
  startRadius?: number;
  /** Ảnh phóng sẵn lúc đầu rồi thu về 1 khi khung mở hết */
  mediaZoom?: number;
  /** Quãng cuộn (× chiều cao màn hình) cho pha mở khung */
  scrollDistance?: number;
  /** Quãng cuộn (× chiều cao màn hình) cho pha phóng to + mờ dần */
  fadeDistance?: number;
  /** Độ phóng thêm ở pha mờ dần */
  fadeZoom?: number;
  smoothing?: number;
  /** Nền sân khấu — nên trùng nền section để lúc mờ không thấy ranh giới */
  background?: string;
  className?: string;
}

export function ScrollExpand({
  src,
  alt,
  children,
  startWidth = 42,
  startHeight = 58,
  startWidthMobile = 78,
  startHeightMobile = 40,
  startRadius = 4,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  fadeDistance = 0.6,
  fadeZoom = 1.12,
  smoothing = 0.1,
  background = "var(--color-ivory)",
  className = "",
}: ScrollExpandProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);

  const propsRef = useRef({
    startWidth, startHeight, startWidthMobile, startHeightMobile, startRadius,
    mediaZoom, scrollDistance, fadeDistance, fadeZoom, smoothing,
  });
  useEffect(() => {
    propsRef.current = {
      startWidth, startHeight, startWidthMobile, startHeightMobile, startRadius,
      mediaZoom, scrollDistance, fadeDistance, fadeZoom, smoothing,
    };
  });

  /** expand ∈ [0,1]: mở khung · fade ∈ [0,1]: phóng thêm + mờ cả sân khấu */
  const apply = useCallback((expand: number, fade: number) => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!stage || !frame || !media) return;
    const c = propsRef.current;
    const mobile = window.innerWidth < 768;
    const sw = mobile ? c.startWidthMobile : c.startWidth;
    const sh = mobile ? c.startHeightMobile : c.startHeight;

    const e = smoothstep(0, 1, expand);
    const w = sw + (100 - sw) * e;
    const h = sh + (100 - sh) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${c.startRadius * (1 - e)}px)`;

    const f = smoothstep(0, 1, fade);
    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e + (c.fadeZoom - 1) * f})`;
    stage.style.opacity = `${1 - f}`;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let raf = 0;
    let running = false;
    const cur = { expand: 0, fade: 0 };
    const target = { expand: 0, fade: 0 };

    const read = () => {
      const c = propsRef.current;
      // Dùng chiều cao thật của sân khấu (100svh) để khớp với chiều cao track trong CSS
      const vh = stage.offsetHeight || window.innerHeight;
      const scrolled = -track.getBoundingClientRect().top;
      target.expand = clamp(scrolled / (vh * c.scrollDistance), 0, 1);
      target.fade = clamp((scrolled - vh * c.scrollDistance) / (vh * c.fadeDistance), 0, 1);
    };

    const tick = () => {
      const s = propsRef.current.smoothing;
      const k = s <= 0 ? 1 : 1 - Math.exp(-1 / (60 * s));
      cur.expand += (target.expand - cur.expand) * k;
      cur.fade += (target.fade - cur.fade) * k;
      if (Math.abs(target.expand - cur.expand) < 0.0004 && Math.abs(target.fade - cur.fade) < 0.0004) {
        cur.expand = target.expand;
        cur.fade = target.fade;
        running = false;
      }
      apply(cur.expand, cur.fade);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      read();
      if (!running) {
        running = true;
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      read();
      cur.expand = target.expand;
      cur.fade = target.fade;
      apply(cur.expand, cur.fade);
    };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [apply]);

  return (
    <div
      className={`scroll-expand ${className}`}
      style={{ "--se-bg": background, "--se-scroll": scrollDistance, "--se-fade": fadeDistance } as CSSProperties}
    >
      <div ref={trackRef} className="scroll-expand__track" aria-hidden>
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            <Image
              ref={mediaRef}
              src={src}
              alt={alt}
              fill
              placeholder="blur"
              sizes="100vw"
              draggable={false}
              className="scroll-expand__media"
            />
          </div>
        </div>
      </div>
      <div className="scroll-expand__content">{children}</div>
    </div>
  );
}
