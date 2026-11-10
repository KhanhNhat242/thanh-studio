"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { locationNames, type LocationFilter } from "@/data/locations";
import type { LocationKey } from "@/types/content";

export interface AlbumCardData {
  slug: string;
  title: string;
  summary: string;
  location: LocationKey;
  count: number;
  cover: StaticImageData;
}

/** Danh sách album theo cặp đôi, lọc theo bối cảnh (trang /album) — lưới so le kiểu tạp chí */
export function AlbumGrid({ albums }: { albums: AlbumCardData[] }) {
  const [filter, setFilter] = useState<LocationFilter>("all");
  const shown = filter === "all" ? albums : albums.filter((a) => a.location === filter);

  return (
    <>
      <FilterTabs value={filter} onChange={setFilter} />

      <ul
        key={filter}
        className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:[&>li:nth-child(3n+2)]:mt-24"
      >
        {shown.map((a, i) => (
          <li key={a.slug} className="lightbox-fade" style={{ animationDelay: `${i * 50}ms` }}>
            <Link href={`/album/${a.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-line">
                <Image
                  src={a.cover}
                  alt={`Ảnh bìa album ${a.title}`}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="hover-zoom object-cover transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-[14px] font-medium text-champagne-deep">
                {locationNames[a.location]} · {a.count} ảnh
              </p>
              <h2 className="mt-2 font-serif text-[30px] leading-[1.1] font-light transition-colors group-hover:text-champagne-deep">
                {a.title}
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-muted">{a.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
