"use client";

/*
 * CircularCarousel — chuyển thể từ React Bits (https://reactbits.dev/components/circular-carousel, bản JS-CSS)
 * sang TypeScript. Giữ nguyên vòng 3D, thẻ cong, kéo có quán tính, bắt dính, tự xoay, intro "rise",
 * hiệu ứng đổi bộ ảnh. Lược bỏ: ảnh mẫu Unsplash, preset wheel/panorama (cần mask).
 * Nhãn trợ năng bằng tiếng Việt.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./CircularCarousel.css";

export interface CarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

type Layout = {
  axis: "y";
  tilt: number;
  perspective: number;
  curve: number;
  spread: number;
  billboard: boolean;
  backfaces: boolean;
};

const PRESETS: Record<"cylinder" | "orbit", Layout> = {
  cylinder: { axis: "y", tilt: -5, perspective: 2500, curve: 1, spread: 1, billboard: false, backfaces: true },
  orbit: { axis: "y", tilt: -16, perspective: 1500, curve: 0, spread: 1.45, billboard: true, backfaces: false },
};

type IntroType = "assemble" | "rise" | "spin" | "none";
const INTRO_LENGTH: Record<IntroType, number> = { assemble: 1500, rise: 1400, spin: 1800, none: 0 };
const TILES = 8;
const OVERLAP = 2.5;
const DRAG_THRESHOLD = 5;
const SPRING = 118;
const SETTLE_SPEED = 9;
const CAPTION_SPACE = 96;
const SWAP_LENGTH = 700;
const SWAP_SPREAD = 420;
const TO_RAD = Math.PI / 180;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
type Vec3 = [number, number, number];
const rotateX = (p: Vec3, deg: number): Vec3 => {
  const r = deg * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};
const rotateY = (p: Vec3, deg: number): Vec3 => {
  const r = deg * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

function Digits({ value }: { value: number }) {
  return (
    <span className="circular-carousel__digits">
      {String(value)
        .padStart(2, "0")
        .split("")
        .map((digit, i) => (
          <span key={i} className="circular-carousel__digit">
            <span className="circular-carousel__reel" style={{ transform: `translateY(${-Number(digit) * 10}%)` }}>
              {"0123456789".split("").map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return reduced;
}

interface CircularCarouselProps {
  items: CarouselItem[];
  preset?: "cylinder" | "orbit";
  intro?: IntroType;
  cardWidth?: number;
  /** Rộng / cao của thẻ */
  aspectRatio?: number;
  gap?: number;
  autoplay?: "drift" | "step" | "off";
  /** Độ / giây khi tự xoay */
  speed?: number;
  interval?: number;
  direction?: "left" | "right";
  momentum?: number;
  pauseOnHover?: boolean;
  parallax?: number;
  stretch?: number;
  depthFade?: number;
  innerShade?: number;
  cornerRadius?: number;
  captions?: boolean;
  label?: string;
  onChange?: (index: number) => void;
  /** Bấm vào thẻ (sau khi thẻ được xoay ra trước) — `isActive`: thẻ đã ở trước từ trước khi bấm */
  onItemClick?: (item: CarouselItem, index: number, isActive: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

type Leaving = { id: number; items: CarouselItem[]; delays: number[] } | null;

export function CircularCarousel({
  items,
  preset = "cylinder",
  intro = "rise",
  cardWidth = 220,
  aspectRatio = 1,
  gap = 25,
  autoplay = "drift",
  speed = 14,
  interval = 3,
  direction = "left",
  momentum = 0.6,
  pauseOnHover = true,
  parallax = 0.3,
  stretch = 0.5,
  depthFade = 0.55,
  innerShade = 0.6,
  cornerRadius = 4,
  captions = false,
  label = "Băng chuyền ảnh",
  onChange,
  onItemClick,
  className = "",
  style,
}: CircularCarouselProps) {
  const [list, setList] = useState<CarouselItem[]>(items);
  const [leaving, setLeaving] = useState<Leaving>(null);
  const count = list.length;
  const layout = PRESETS[preset] ?? PRESETS.cylinder;
  const tiltValue = layout.tilt;
  const curveValue = layout.billboard ? 0 : clamp(layout.curve, 0, 1);
  const reduced = usePrefersReducedMotion();

  const cardW = Math.max(40, cardWidth);
  const cardH = cardW / clamp(aspectRatio, 0.2, 5);
  const along = cardW;
  const step = 360 / Math.max(1, count);

  const radius = useMemo(() => {
    const n = Math.max(count, 3);
    const pitch = (along + gap) * layout.spread;
    const chord = pitch / (2 * Math.sin(Math.PI / n));
    const arc = (n * pitch) / (2 * Math.PI);
    return Math.max(chord + (arc - chord) * curveValue, along * 0.6);
  }, [count, along, gap, curveValue, layout.spread]);

  const tiles = useMemo(() => {
    const total = curveValue > 0.001 ? TILES : 1;
    const length = along / total;
    const bend = curveValue > 0.001 ? radius / curveValue : 0;
    return Array.from({ length: total }, (_, index) => {
      const start = index * length - (index > 0 ? OVERLAP / 2 : 0);
      const end = (index + 1) * length + (index < total - 1 ? OVERLAP / 2 : 0);
      const center = (start + end) / 2 - along / 2;
      const alpha = bend ? center / bend : 0;
      const shift = bend ? bend * Math.sin(alpha) : center;
      const depth = bend ? -bend * (1 - Math.cos(alpha)) : 0;
      const turn = (alpha * 180) / Math.PI;
      return { index, total, start, end, size: end - start, move: `translate3d(${shift}px, 0px, ${depth}px) rotateY(${turn}deg)` };
    });
  }, [along, curveValue, radius]);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wakeRef = useRef<() => void>(() => {});
  const measureRef = useRef<() => void>(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const readyRef = useRef(false);

  const stateRef = useRef({
    angle: 0,
    velocity: 0,
    target: null as number | null,
    dir: 0,
    press: null as null | {
      id: number;
      x: number;
      y: number;
      angle: number;
      moved: boolean;
      origin: number;
      samples: { time: number; angle: number }[];
    },
    drag: false,
    hover: false,
    pointer: { inside: false, x: 0, y: 0 },
    yaw: 0,
    pitch: 0,
    intro: null as null | { type: IntroType; start: number },
    introDone: false,
    holdUntil: 0,
    stepAt: 0,
    suppressClick: false,
    wheelTimer: 0 as ReturnType<typeof setTimeout> | 0,
    fit: 1,
    shift: 0,
    drop: 0,
    last: 0,
  });

  const settings = {
    count,
    step,
    radius,
    layout,
    tilt: tiltValue,
    perspective: layout.perspective,
    cardW,
    cardH,
    intro: (reduced ? "none" : intro) as IntroType,
    autoplay: reduced ? "off" : autoplay,
    speed,
    interval: Math.max(0.5, interval),
    momentum: clamp(momentum, 0, 1),
    pauseOnHover,
    parallax: reduced ? 0 : clamp(parallax, 0, 1),
    stretch: reduced ? 0 : clamp(stretch, 0, 1),
    depthFade: clamp(depthFade, 0, 1),
    captions,
    reduced,
  };
  const settingsRef = useRef(settings);
  const onChangeRef = useRef(onChange);
  const incomingRef = useRef(items);
  const listRef = useRef(list);
  useLayoutEffect(() => {
    readyRef.current = ready;
    settingsRef.current = settings;
    onChangeRef.current = onChange;
    incomingRef.current = items;
    listRef.current = list;
  });

  const directionSign = direction === "right" ? 1 : -1;
  useEffect(() => {
    stateRef.current.dir = directionSign;
    wakeRef.current();
  }, [directionSign]);

  const sourcesKey = items.map((it) => it.src).join("|");

  // Nạp trước ảnh; đổi bộ ảnh cùng số lượng → hiệu ứng mờ chéo, khác số lượng → chạy lại intro
  useEffect(() => {
    let cancelled = false;
    const next = incomingRef.current;
    const smooth = readyRef.current && next.length === listRef.current.length;
    if (!smooth) {
      setReady(false);
      setLeaving(null);
      setList(next);
    }
    const load = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => (img.decode ? img.decode().then(() => resolve(), () => resolve()) : resolve());
        img.onerror = () => resolve();
        img.src = src;
      });
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2400));
    Promise.race([Promise.all(next.slice(0, 16).map((it) => load(it.src))), timeout]).then(() => {
      if (cancelled) return;
      const state = stateRef.current;
      if (smooth) {
        const previous = listRef.current;
        const s = settingsRef.current;
        if (!s.reduced && previous !== next) {
          setLeaving((cur) => ({
            id: (cur?.id || 0) + 1,
            items: previous,
            delays: previous.map((_, i) => (Math.abs(wrap(i * s.step + state.angle)) / 180) * SWAP_SPREAD),
          }));
        }
        setList(next);
        wakeRef.current();
        return;
      }
      state.introDone = false;
      state.intro = null;
      state.angle = 0;
      state.target = null;
      setReady(true);
      wakeRef.current();
    });
    return () => {
      cancelled = true;
    };
  }, [sourcesKey]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setLeaving(null), SWAP_LENGTH + SWAP_SPREAD + 80);
    return () => clearTimeout(timer);
  }, [leaving]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const ring = ringRef.current;
    if (!root || !stage || !camera || !ring) return;
    const state = stateRef.current;
    let raf = 0;
    let visible = true;

    const nearest = (a: number) => Math.round(a / settingsRef.current.step) * settingsRef.current.step;

    const measure = () => {
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const room = s.captions ? CAPTION_SPACE : 0;
      const width = rect.width * 0.94;
      const height = (rect.height - room) * 0.92;
      const P = s.perspective;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      const corners: [number, number][] = [
        [-s.cardW / 2, -s.cardH / 2],
        [s.cardW / 2, -s.cardH / 2],
        [-s.cardW / 2, s.cardH / 2],
        [s.cardW / 2, s.cardH / 2],
      ];
      for (let a = -180; a <= 180; a += 180 / 24) {
        for (const [cx, cy] of corners) {
          let p: Vec3;
          if (s.layout.billboard) {
            const c = rotateY([0, 0, s.radius], a);
            p = rotateX([c[0] + cx, cy, c[2]], s.tilt);
          } else {
            p = rotateX(rotateY([cx, cy, s.radius], a), s.tilt);
          }
          p = [p[0], p[1], p[2] - s.radius];
          if (p[2] >= P * 0.95) continue;
          const k = P / (P - p[2]);
          minX = Math.min(minX, p[0] * k);
          maxX = Math.max(maxX, p[0] * k);
          minY = Math.min(minY, p[1] * k);
          maxY = Math.max(maxY, p[1] * k);
        }
      }
      const fit = Math.min(1, width / Math.max(maxX - minX, 1), height / Math.max(maxY - minY, 1));
      state.fit = fit;
      state.shift = -((minY + maxY) / 2) * fit - room / 2;
      state.drop = (rect.height / fit) * 0.55 + s.cardH;
      stage.style.perspective = `${P}px`;
      stage.style.transform = `translate3d(0, ${state.shift}px, 0) scale(${fit})`;
    };
    measureRef.current = measure;

    const introCard = (elapsed: number, landing: number) => {
      if (!state.intro) return { radius: 1, lift: 0 };
      const type = state.intro.type;
      const reach = Math.abs(wrap(landing + state.angle));
      if (type === "assemble") {
        const p = easeOut(clamp((elapsed - (reach / 180) * 420) / 1080, 0, 1));
        return { radius: 1 + 0.6 * (1 - p), lift: 0 };
      }
      if (type === "rise") {
        const p = easeOutQuint(clamp((elapsed - (reach / 180) * 480) / 900, 0, 1));
        return { radius: 1, lift: (1 - p) * state.drop };
      }
      if (type === "spin") {
        const p = easeOut(clamp(elapsed / INTRO_LENGTH.spin, 0, 1));
        return { radius: 1 + 0.28 * (1 - p), lift: 0 };
      }
      return { radius: 1, lift: 0 };
    };

    const advance = (s: typeof settings, dt: number, now: number) => {
      if (!state.introDone && readyRef.current) {
        if (!state.intro) {
          if (s.intro === "none") state.introDone = true;
          else state.intro = { type: s.intro, start: now };
        }
        if (state.intro && now - state.intro.start >= INTRO_LENGTH[state.intro.type]) {
          state.intro = null;
          state.introDone = true;
        }
      }
      const paused = (s.pauseOnHover && state.hover) || state.drag || now < state.holdUntil;
      const cruise = s.autoplay === "drift" && !paused && !state.intro ? s.speed * state.dir : 0;
      let busy = Boolean(state.intro) || state.drag;

      if (state.drag || state.intro) {
        state.velocity = state.drag ? state.velocity : 0;
      } else if (state.target !== null) {
        let remaining = dt;
        const damping = 2 * Math.sqrt(SPRING);
        while (remaining > 0) {
          const h = Math.min(remaining, 1 / 240);
          const accel = SPRING * (state.target - state.angle) - damping * state.velocity;
          state.velocity += accel * h;
          state.angle += state.velocity * h;
          remaining -= h;
        }
        if (Math.abs(state.target - state.angle) < 0.004 && Math.abs(state.velocity) < 0.03) {
          state.angle = state.target;
          state.velocity = 0;
          state.target = null;
        }
        busy = true;
      } else {
        const tau = 0.18 + s.momentum * 1.5;
        state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / tau));
        state.angle += state.velocity * dt;
        if (cruise === 0 && Math.abs(state.velocity) < SETTLE_SPEED) state.target = nearest(state.angle);
        busy = busy || cruise !== 0 || Math.abs(state.velocity) > 0.01 || state.target !== null;
      }

      if (s.autoplay === "step" && !paused && !state.intro && state.introDone) {
        if (!state.stepAt) state.stepAt = now + s.interval * 1000;
        if (now >= state.stepAt) {
          state.target = (state.target ?? nearest(state.angle)) + s.step * state.dir;
          state.stepAt = now + s.interval * 1000;
        }
        busy = true;
      } else state.stepAt = 0;

      if (now < state.holdUntil) busy = true;

      const ease = 1 - Math.exp(-dt / 0.35);
      const aimYaw = state.pointer.inside ? state.pointer.x * s.parallax * 9 : 0;
      const aimPitch = state.pointer.inside ? -state.pointer.y * s.parallax * 6 : 0;
      state.yaw += (aimYaw - state.yaw) * ease;
      state.pitch += (aimPitch - state.pitch) * ease;
      if (Math.abs(aimYaw - state.yaw) > 0.01 || Math.abs(aimPitch - state.pitch) > 0.01) busy = true;
      return busy;
    };

    const render = (s: typeof settings, now: number) => {
      const elapsed = state.intro ? now - state.intro.start : 0;
      const swell = 1 + s.stretch * 0.12 * Math.min(1, Math.abs(state.velocity) / 420);
      let spinOffset = 0;
      if (state.intro?.type === "spin") spinOffset = -300 * state.dir * (1 - easeOut(clamp(elapsed / INTRO_LENGTH.spin, 0, 1)));
      else if (state.intro?.type === "assemble")
        spinOffset = -32 * state.dir * (1 - easeOut(clamp(elapsed / INTRO_LENGTH.assemble, 0, 1)));
      const angle = state.angle + spinOffset;
      const R = s.radius * swell;
      camera.style.transform = `translate3d(0, 0, ${-R}px) rotateX(${s.tilt + state.pitch}deg) rotateY(${state.yaw}deg)`;
      ring.style.transform = `rotateY(${angle}deg)`;

      for (let i = 0; i < s.count; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const base = i * s.step;
        const mod = introCard(elapsed, base);
        let transform = `rotateY(${base}deg) translateZ(${R * mod.radius}px)`;
        if (s.layout.billboard) transform += ` rotateY(${-(base + angle)}deg)`;
        if (mod.lift) transform += ` translateY(${mod.lift}px)`;
        card.style.transform = transform;
        const facing = Math.cos(wrap(base + angle) * TO_RAD);
        card.style.setProperty("--cc-depth", (s.depthFade * Math.pow((1 - facing) / 2, 1.25)).toFixed(3));
      }

      const index = ((Math.round(-state.angle / s.step) % s.count) + s.count) % s.count || 0;
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
        onChangeRef.current?.(index);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const s = settingsRef.current;
      const dt = state.last ? Math.min((now - state.last) / 1000, 0.05) : 1 / 60;
      state.last = now;
      const busy = advance(s, dt, now);
      render(s, now);
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        state.last = 0;
      } else wake();
    };

    const resize = new ResizeObserver(() => {
      measure();
      wake();
    });
    resize.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        state.last = 0;
      }
    });
    io.observe(root);

    // Cuộn ngang bằng touchpad để xoay vòng
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
      if (!delta) return;
      e.preventDefault();
      const s = settingsRef.current;
      const perPixel = 180 / (Math.PI * s.radius * state.fit);
      state.target = null;
      state.angle -= delta * perPixel;
      state.velocity = -delta * perPixel * 30;
      state.holdUntil = performance.now() + 1600;
      if (state.wheelTimer) clearTimeout(state.wheelTimer);
      state.wheelTimer = setTimeout(() => {
        state.target = nearest(state.angle + state.velocity * 0.12);
        wake();
      }, 140);
      wake();
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("visibilitychange", onVisibility);

    measure();
    render(settingsRef.current, performance.now());
    wake();

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      if (state.wheelTimer) clearTimeout(state.wheelTimer);
      root.removeEventListener("wheel", onWheel);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    measureRef.current();
    wakeRef.current();
  }, [radius, cardW, cardH, preset, captions, count]);

  useEffect(() => {
    wakeRef.current();
  });

  const focusIndex = useCallback((index: number) => {
    const state = stateRef.current;
    const s = settingsRef.current;
    let target = -index * s.step;
    target += 360 * Math.round((state.angle - target) / 360);
    state.target = target;
    state.holdUntil = performance.now() + 2800;
    wakeRef.current();
  }, []);

  const stepBy = useCallback((delta: number) => {
    const state = stateRef.current;
    const s = settingsRef.current;
    const base = state.target ?? Math.round(state.angle / s.step) * s.step;
    state.target = base - delta * s.step;
    state.holdUntil = performance.now() + 2800;
    wakeRef.current();
  }, []);

  const updatePointer = (e: ReactPointerEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointer = stateRef.current.pointer;
    pointer.x = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    pointer.y = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  };

  const handlePointerDown = (e: ReactPointerEvent) => {
    const state = stateRef.current;
    state.suppressClick = false;
    if (e.button !== 0) return;
    state.press = { id: e.pointerId, x: e.clientX, y: e.clientY, angle: state.angle, moved: false, origin: 0, samples: [{ time: performance.now(), angle: state.angle }] };
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    const state = stateRef.current;
    if (e.pointerType === "mouse") {
      state.pointer.inside = true;
      updatePointer(e);
    }
    const press = state.press;
    if (!press || press.id !== e.pointerId) {
      wakeRef.current();
      return;
    }
    const delta = e.clientX - press.x;
    const cross = e.clientY - press.y;
    if (!press.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      if (Math.abs(cross) > Math.abs(delta) * 1.2 && e.pointerType !== "mouse") {
        state.press = null;
        return;
      }
      press.moved = true;
      press.origin = delta;
      state.drag = true;
      state.target = null;
      state.velocity = 0;
      setDragging(true);
      try {
        rootRef.current?.setPointerCapture(e.pointerId);
      } catch {}
    }
    const s = settingsRef.current;
    const perPixel = 180 / (Math.PI * s.radius * state.fit);
    state.angle = press.angle + (delta - press.origin) * perPixel;
    const now = performance.now();
    press.samples.push({ time: now, angle: state.angle });
    while (press.samples.length > 2 && now - press.samples[0].time > 110) press.samples.shift();
    wakeRef.current();
  };

  const releasePointer = (e: ReactPointerEvent) => {
    const state = stateRef.current;
    const press = state.press;
    if (!press || press.id !== e.pointerId) return;
    state.press = null;
    if (!press.moved) return;
    state.drag = false;
    setDragging(false);
    state.suppressClick = true;
    const s = settingsRef.current;
    const first = press.samples[0];
    const last = press.samples[press.samples.length - 1];
    const span = (last.time - first.time) / 1000;
    const velocity = span > 0.008 ? clamp((last.angle - first.angle) / span, -1400, 1400) : 0;
    state.velocity = velocity;
    if (Math.abs(velocity) > 60) state.dir = Math.sign(velocity);
    const coasting = s.autoplay === "drift" && !(s.pauseOnHover && state.hover && e.pointerType === "mouse");
    if (!coasting) {
      const tau = 0.18 + s.momentum * 1.5;
      state.target = Math.round((state.angle + velocity * tau * 0.55) / s.step) * s.step;
    }
    wakeRef.current();
  };

  const handlePointerEnter = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    stateRef.current.hover = true;
    wakeRef.current();
  };

  const handlePointerLeave = (e: ReactPointerEvent) => {
    const state = stateRef.current;
    if (e.pointerType === "mouse") {
      state.hover = false;
      state.pointer.inside = false;
    }
    wakeRef.current();
  };

  const handleClick = (e: ReactMouseEvent) => {
    const state = stateRef.current;
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    const card = (e.target as HTMLElement).closest?.("[data-cc-index]");
    if (!card) return;
    const index = Number(card.getAttribute("data-cc-index"));
    const wasActive = index === activeRef.current;
    focusIndex(index);
    onItemClick?.(list[index], index, wasActive);
  };

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight") stepBy(1);
    else if (e.key === "ArrowLeft") stepBy(-1);
    else if (e.key === "Home") focusIndex(0);
    else if (e.key === "End") focusIndex(count - 1);
    else if (e.key === "Enter" || e.key === " ") onItemClick?.(list[activeRef.current], activeRef.current, true);
    else return;
    e.preventDefault();
  };

  const current = list[active] || list[0];
  const currentLabel = current ? current.title || current.alt : "";

  const renderTile = (item: CarouselItem, tile: (typeof tiles)[number], back: boolean, index: number) => {
    const strip = back ? tile.total - 1 - tile.index : tile.index;
    const first = strip === 0;
    const last = strip === tile.total - 1;
    const r = "var(--cc-radius)";
    const frameRadius = `${first ? r : 0} ${last ? r : 0} ${last ? r : 0} ${first ? r : 0}`;
    const offset = back ? along - tile.end : tile.start;
    const photoStyle: CSSProperties = { left: -offset, top: 0, width: cardW, height: cardH };
    const gone = leaving?.items[index];
    return (
      <div
        key={`${back ? "b" : "f"}${tile.index}`}
        className="circular-carousel__tile"
        style={{ left: -tile.size / 2, top: -cardH / 2, width: tile.size, height: cardH, transform: tile.move + (back ? " rotateY(180deg)" : "") }}
        aria-hidden="true"
      >
        <div className="circular-carousel__frame" style={{ height: cardH, borderRadius: frameRadius }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh đã tối ưu qua getImageProps; cần <img> thô để cắt thành dải cong */}
          <img className="circular-carousel__photo" src={item.src} alt="" draggable={false} decoding="async" style={photoStyle} />
          {gone && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`leaving-${leaving.id}`}
              className="circular-carousel__photo circular-carousel__photo--leaving"
              src={gone.src}
              alt=""
              draggable={false}
              decoding="async"
              style={{ ...photoStyle, animationDelay: `${Math.round(leaving.delays[index])}ms` }}
            />
          )}
          {back && <div className="circular-carousel__inner" />}
          <div className="circular-carousel__shade" />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={`circular-carousel ${className}`.trim()}
      style={
        {
          ...style,
          "--cc-radius": `${Math.max(0, cornerRadius)}px`,
          "--cc-inner": (1 - clamp(innerShade, 0, 1)).toFixed(3),
        } as CSSProperties
      }
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      data-ready={ready ? "" : undefined}
      data-draggable=""
      data-dragging={dragging ? "" : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="circular-carousel__view">
        <div ref={stageRef} className="circular-carousel__stage">
          <div ref={cameraRef} className="circular-carousel__camera">
            <div ref={ringRef} className="circular-carousel__ring">
              {list.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="circular-carousel__card"
                  data-cc-index={index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${item.title || item.alt}, ${index + 1} / ${count}`}
                >
                  {tiles.map((tile) => renderTile(item, tile, false, index))}
                  {layout.backfaces && tiles.map((tile) => renderTile(item, tile, true, index))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {captions && current && (
        <div className="circular-carousel__caption" aria-hidden="true">
          <span key={active} className="circular-carousel__title">
            {current.title || current.alt}
            {current.subtitle && <span className="circular-carousel__subtitle">{current.subtitle}</span>}
          </span>
          <span className="circular-carousel__count">
            <Digits value={active + 1} />
            <span>/</span>
            <span>{String(count).padStart(2, "0")}</span>
          </span>
        </div>
      )}
      <div className="circular-carousel__live" aria-live="polite" aria-atomic="true">
        {`${currentLabel}, ${active + 1} / ${count}`}
      </div>
    </div>
  );
}
