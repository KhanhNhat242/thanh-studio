"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, TransitionEvent } from "react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/ButtonLink";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";
import { heroSlides, type HeroSlide } from "@/data/hero";
import { siteConfig } from "@/lib/site-config";
import { nb } from "@/lib/text";

/** Ảnh responsive: desktop/mobile dùng 2 file khác nhau — thẻ và ảnh phóng to dùng CHUNG để không bị "nhảy ảnh". */
function SlidePicture({
  slide,
  sizes,
  eager = false,
  className = "",
}: {
  slide: HeroSlide;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const common = { alt: slide.alt, sizes, quality: 75 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: slide.desktop });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    src: slide.mobile,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source media="(max-width: 767px)" srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...rest}
        className={`absolute inset-0 h-full w-full object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos-d)] ${className}`}
        style={
          {
            "--pos-d": slide.desktopPosition,
            "--pos-m": slide.mobilePosition,
          } as CSSProperties
        }
      />
    </picture>
  );
}

type Rect = { top: number; left: number; width: number; height: number };
type Phase = "closed" | "opening" | "open" | "closing";

const COUNT = heroSlides.length;
/** Tốc độ chạy: số thẻ đi qua mỗi giây (≈ 1 thẻ / 6 giây) */
const SPEED = 1 / 6;
/** Khi tải trang, thẻ giữa là Huế (bối cảnh đặc trưng) */
const START = Math.max(0, heroSlides.findIndex((s) => s.id === "hue"));

/** Vị trí liên tục của thẻ i so với tâm, trong khoảng [-COUNT/2, COUNT/2) — vòng vô tận */
const offsetOf = (i: number, p: number) => {
  const half = COUNT / 2;
  return ((((i - p + half) % COUNT) + COUNT) % COUNT) - half;
};
/** Độ "ở giữa" 0..1 — dùng làm sáng thẻ và hiện tên bối cảnh */
const focusOf = (off: number) => Math.max(0, 1 - Math.abs(off) * 1.6);
const wrap = (i: number) => (i + COUNT) % COUNT;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Hero (F1): 5 thẻ ảnh trên nền tối ấm chạy ngang vô tận từ phải sang trái, mỗi lúc thấy 3 thẻ phủ đủ bề ngang.
 * Rê chuột / focus vào dãy thẻ thì dừng. Bấm một thẻ → ảnh phóng to từ đúng vị trí thẻ ra phủ kín section,
 * kèm tiêu đề, mô tả, slogan, CTA; ở trạng thái này không tự chuyển, ← → đổi ảnh, Esc / nút đóng thu về thẻ.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Thẻ cần nhận lại focus sau khi thu nhỏ (chỉ focus được khi dãy thẻ đã hết `inert`) */
  const returnFocus = useRef<number | null>(null);

  /** Vị trí trôi liên tục (đơn vị: thẻ) — cập nhật mỗi khung hình, không qua state để khỏi render lại */
  const posRef = useRef(START);
  const visibleRef = useRef<boolean[]>([]);
  const holdRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  /** Kéo bằng chuột / ngón tay: vị trí bắt đầu, mẫu vận tốc; `inertia` = vận tốc trôi tiếp sau khi thả (thẻ/giây) */
  const dragRef = useRef<{ id: number; x: number; y: number; start: number; moved: boolean; samples: { t: number; p: number }[] } | null>(null);
  const inertiaRef = useRef(0);
  const suppressClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);

  const [active, setActive] = useState<number | null>(null);
  const [frame, setFrame] = useState<Rect | "full">("full");
  const [phase, setPhase] = useState<Phase>("closed");

  /** Ghi vị trí hiện tại vào từng thẻ (biến CSS --off / --focus) */
  const paint = useCallback(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const off = offsetOf(i, posRef.current);
      card.style.setProperty("--off", off.toFixed(4));
      card.style.setProperty("--focus", focusOf(off).toFixed(3));
      // Thẻ đã trôi ra ngoài màn hình: không cho focus bằng bàn phím
      const visible = Math.abs(off) < 1.5;
      if (visibleRef.current[i] !== visible) {
        visibleRef.current[i] = visible;
        card.tabIndex = visible ? 0 : -1;
        card.setAttribute("aria-hidden", String(!visible));
      }
    });
  }, []);

  // Dừng khi rê chuột / focus vào dãy thẻ hoặc đang phóng to
  useEffect(() => {
    holdRef.current = hovering || focused || dragging || phase !== "closed";
  }, [hovering, focused, dragging, phase]);

  // Vòng chạy vô tận: tăng tốc / giảm tốc mềm khi dừng – chạy; tạm nghỉ khi hero khuất khỏi màn hình
  useEffect(() => {
    paint();
    if (reducedMotion()) return;
    let raf = 0;
    let last = 0;
    let speed = 0;
    let onScreen = true;

    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      const target = holdRef.current || !onScreen ? 0 : SPEED;
      speed += (target - speed) * Math.min(1, dt * 4);
      // Quán tính sau khi thả tay kéo: trôi tiếp rồi chậm dần
      const glide = inertiaRef.current;
      if (Math.abs(glide) > 1e-3 && !dragRef.current) inertiaRef.current = glide * Math.exp(-dt * 3.5);
      else if (!dragRef.current) inertiaRef.current = 0;
      const move = (speed > 1e-5 ? speed : 0) + (dragRef.current ? 0 : inertiaRef.current);
      if (move !== 0) {
        posRef.current += move * dt;
        paint();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [paint]);

  /** Đưa thẻ i ra giữa ngay lập tức (dùng khi đang phóng to — dãy thẻ phía sau bị che) */
  const centerOn = useCallback(
    (i: number) => {
      posRef.current += offsetOf(i, posRef.current);
      paint();
    },
    [paint],
  );

  const rectOf = useCallback((i: number): Rect => {
    const card = cardRefs.current[i]?.getBoundingClientRect();
    const box = sectionRef.current?.getBoundingClientRect();
    if (!card || !box) return { top: 0, left: 0, width: 0, height: 0 };
    return { top: card.top - box.top, left: card.left - box.left, width: card.width, height: card.height };
  }, []);

  const open = (i: number) => {
    setActive(i);
    if (reducedMotion()) {
      setFrame("full");
      setPhase("open");
      return;
    }
    setFrame(rectOf(i));
    setPhase("opening");
    // 2 khung hình: trình duyệt vẽ khung ở đúng vị trí thẻ trước, rồi mới giãn ra full section
    requestAnimationFrame(() => requestAnimationFrame(() => setFrame("full")));
  };

  const close = useCallback(() => {
    if (active === null) return;
    returnFocus.current = active;
    if (reducedMotion()) {
      setPhase("closed");
      setActive(null);
      return;
    }
    setFrame(rectOf(active));
    setPhase("closing");
  }, [active, rectOf]);

  /** Đổi ảnh khi đang phóng to — thẻ tương ứng được đưa ra giữa để lúc đóng thu về đúng chỗ */
  const go = useCallback(
    (dir: 1 | -1) => {
      if (active === null) return;
      const next = wrap(active + dir);
      setActive(next);
      centerOn(next);
    },
    [active, centerOn],
  );

  const onFrameTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "width") return;
    if (phase === "opening") setPhase("open");
    if (phase === "closing") {
      setPhase("closed");
      setActive(null);
    }
  };

  useEffect(() => {
    if (phase !== "closed" || returnFocus.current === null) return;
    cardRefs.current[returnFocus.current]?.focus({ preventScroll: true });
    returnFocus.current = null;
  }, [phase]);

  // Dự phòng: nếu trình duyệt không bắn transitionend, vẫn chốt trạng thái sau khi hết thời gian chuyển động
  useEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const t = window.setTimeout(() => {
      if (phase === "opening") setPhase("open");
      else {
        setPhase("closed");
        setActive(null);
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close, go]);

  /** Bề rộng 1 "ô" thẻ (1/3 stage) — kéo 1 ô = trượt 1 thẻ */
  const slotPx = () => (stageRef.current?.clientWidth || window.innerWidth) / 3;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    suppressClickRef.current = false;
    inertiaRef.current = 0;
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: posRef.current, moved: false, samples: [{ t: performance.now(), p: posRef.current }] };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      // Trên cảm ứng: vuốt dọc là cuộn trang, không giành lấy
      if (e.pointerType !== "mouse" && Math.abs(e.clientY - d.y) > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }
      d.moved = true;
      setDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    // Kéo sang phải → thẻ trượt sang phải (vị trí giảm)
    posRef.current = d.start - dx / slotPx();
    const now = performance.now();
    d.samples.push({ t: now, p: posRef.current });
    while (d.samples.length > 2 && now - d.samples[0].t > 100) d.samples.shift();
    paint();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (!d.moved) return;
    suppressClickRef.current = true;
    setDragging(false);
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const span = (last.t - first.t) / 1000;
    if (!reducedMotion()) inertiaRef.current = span > 0.01 ? Math.max(-6, Math.min(6, (last.p - first.p) / span)) : 0;
  };

  const expanded = phase !== "closed" && active !== null;
  const slide = active !== null ? heroSlides[active] : null;
  const frameStyle: CSSProperties =
    frame === "full" ? { top: 0, left: 0, width: "100%", height: "100%" } : frame;
  const ctrlClass =
    "grid size-12 place-items-center rounded-full border border-cream/35 bg-ink/20 text-cream backdrop-blur-sm transition-colors hover:border-champagne hover:text-champagne";

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-roledescription="carousel"
      aria-label="Ảnh nổi bật"
      className="hero-bg on-dark relative isolate h-[100svh] min-h-[560px] w-full overflow-hidden pt-[76px] md:pt-[88px]"
    >
      <h1 className="sr-only">
        {siteConfig.name} Huế — {siteConfig.slogan}
      </h1>

      {/* Dãy thẻ chạy ngang vô tận — 3 thẻ phủ đủ bề ngang */}
      <div
        inert={expanded}
        ref={stageRef}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          // Vừa kéo xong thì không tính là bấm vào thẻ
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
        data-dragging={dragging || undefined}
        className="hero-stage relative h-full touch-pan-y select-none"
      >
        {heroSlides.map((s, i) => {
          const off = offsetOf(i, START);
          const visible = Math.abs(off) < 1.5;
          return (
            <button
              key={s.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              type="button"
              onClick={() => open(i)}
              tabIndex={visible ? 0 : -1}
              aria-hidden={!visible}
              aria-label={`Xem ảnh ${s.place}`}
              aria-expanded={expanded && active === i}
              style={{ "--off": off, "--focus": focusOf(off) } as CSSProperties}
              className={`hero-card group h-[56svh] max-h-[720px] overflow-hidden rounded-sm bg-ink md:h-[64svh] ${
                expanded && active === i ? "opacity-0" : ""
              }`}
            >
              <SlidePicture
                slide={s}
                sizes="(min-width: 768px) 34vw, 40vw"
                eager={visible}
                className="transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
              />
              <span aria-hidden className="hero-card__shade absolute inset-0 bg-ink" />
              <span aria-hidden className="hero-card__title absolute inset-0 flex items-center justify-center p-4">
                <span className="max-h-full rotate-180 text-center font-serif text-[18px] leading-[1.05] font-light tracking-[0.06em] text-cream uppercase text-shadow-soft [writing-mode:vertical-rl] sm:text-[28px] md:text-[40px] xl:text-[52px]">
                  {s.place}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Ảnh phóng to: xuất phát đúng từ vị trí thẻ, giãn ra phủ kín section */}
      {expanded && slide && (
        <div
          onTransitionEnd={onFrameTransitionEnd}
          style={frameStyle}
          className={`absolute z-10 overflow-hidden bg-ink text-cream transition-[top,left,width,height,border-radius] duration-700 ease-[var(--ease-editorial)] motion-reduce:transition-none ${
            frame === "full" ? "rounded-none" : "rounded-sm"
          }`}
        >
          <div key={slide.id} className="lightbox-fade absolute inset-0">
            <SlidePicture slide={slide} sizes="100vw" eager />
          </div>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink/75 via-ink/30 via-45% to-transparent md:h-[60%] md:from-ink/65"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/55 to-transparent" />

          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              phase === "open" ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="absolute top-[84px] right-5 flex items-center gap-3 md:top-[100px] md:right-8 xl:right-10">
              <p className="mr-1 text-[14px] text-cream/85 tabular-nums text-shadow-soft">
                {(active ?? 0) + 1} / {COUNT}
              </p>
              <button type="button" onClick={() => go(-1)} aria-label="Ảnh trước" className={ctrlClass}>
                <ArrowLeftIcon className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Ảnh tiếp theo" className={ctrlClass}>
                <ArrowRightIcon className="size-5" />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Thu nhỏ, quay lại dãy ảnh"
                className={`${ctrlClass} ml-2`}
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-20">
              <div className="mx-auto max-w-[1320px] px-5 md:px-8 xl:px-10">
                {/* pr-16 trên mobile: chừa chỗ cho cụm nút Gọi/Zalo/Messenger cố định (F7) */}
                <div key={slide.id} className="lightbox-fade max-w-[640px] pr-16 sm:pr-0">
                  <p className="text-[15px] text-cream/90 italic text-shadow-soft">“{siteConfig.slogan}”</p>
                  <h2 className="mt-3 font-serif text-[46px] leading-[1.02] font-light tracking-[-0.015em] text-shadow-soft sm:text-[60px] md:text-[80px] xl:text-[96px]">
                    {slide.place}
                  </h2>
                  <p className="mt-5 max-w-[520px] text-[16px] leading-[1.75] text-cream/90 text-shadow-soft md:text-[17px]">
                    {nb(slide.description)}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
                    <Link href="#dat-lich" className={buttonClass("primary", "w-full px-6 sm:w-auto md:px-8")}>
                      Đặt lịch tư vấn
                    </Link>
                    <Link href="#album" className={buttonClass("outline-light", "w-full px-6 sm:w-auto md:px-8")}>
                      Xem album
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
