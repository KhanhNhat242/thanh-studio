"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Theo dõi tiến độ cuộn qua một "track" cao (bên trong có sân khấu `position: sticky`).
 * Gọi `onProgress(p)` với p ∈ [0, 1] mỗi khung hình khi đang cuộn — có làm mượt (lerp),
 * ghi thẳng style qua ref nên không render lại React.
 * Sân khấu là phần tử con đầu tiên của track; có thể thấp hơn màn hình (bị giới hạn chiều cao trên màn hình lớn)
 * và bám ở `top` > 0. p = 0: sân khấu bắt đầu bám · p = 1: sân khấu thôi bám.
 */
export function useScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  smoothing = 0.12,
) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cur = -1;
    let target = 0;

    const read = () => {
      const r = track.getBoundingClientRect();
      const stage = track.firstElementChild as HTMLElement | null;
      const stageH = stage?.offsetHeight || window.innerHeight;
      const stickTop = stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
      const span = r.height - stageH;
      target = span > 0 ? Math.min(1, Math.max(0, (stickTop - r.top) / span)) : 0;
    };

    const tick = () => {
      raf = 0;
      if (cur < 0 || reduced || smoothing <= 0) cur = target;
      else cur += (target - cur) * (1 - Math.exp(-1 / (60 * smoothing)));
      if (Math.abs(target - cur) < 0.0005) cur = target;
      cb.current(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      read();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [trackRef, smoothing]);
}
