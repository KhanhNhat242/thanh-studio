"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";
import { locationNames } from "@/data/locations";
import type { AlbumPhoto } from "@/types/content";

interface LightboxProps {
  photos: AlbumPhoto[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Lightbox xem ảnh lớn: phím ← → Esc, vuốt trái/phải trên mobile. */
export function Lightbox({ photos, index, onChange }: LightboxProps) {
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null && photos[index] !== undefined;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus();
    };
  }, [open, go, onChange]);

  if (!open) return null;
  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh lớn"
      className="on-dark fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={() => onChange(null)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 text-cream md:px-8">
        <p className="text-[14px] text-cream/80 tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onChange(null)}
          aria-label="Đóng"
          className="grid size-11 place-items-center rounded-full border border-cream/25 transition-colors hover:border-champagne hover:text-champagne"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-2 md:px-24">
        <Image
          key={photo.src.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          className="lightbox-fade object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Ảnh trước"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-champagne hover:text-champagne md:grid"
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Ảnh tiếp theo"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-champagne hover:text-champagne md:grid"
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 px-4 py-5 text-center text-cream">
        <p className="font-serif text-[24px] font-light">{photo.albumTitle}</p>
        <p className="mt-1 text-[14px] text-champagne">
          {locationNames[photo.location]}
          <span className="text-cream/75 md:hidden"> · Vuốt để xem tiếp</span>
        </p>
      </div>
    </div>
  );
}
