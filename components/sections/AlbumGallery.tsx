"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import type { AlbumPhoto } from "@/types/content";

/** Lưới masonry toàn bộ ảnh của một album + lightbox */
export function AlbumGallery({ photos }: { photos: AlbumPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3">
        {photos.map((p, i) => (
          <li key={p.src.src} className="mb-4 break-inside-avoid md:mb-6">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Xem lớn: ${p.alt}`}
              className="group block w-full overflow-hidden bg-line"
            >
              <Image
                src={p.src}
                alt={p.alt}
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="hover-zoom h-auto w-full transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={index} onChange={setIndex} />
    </>
  );
}
