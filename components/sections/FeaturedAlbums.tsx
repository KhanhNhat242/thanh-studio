"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/ButtonLink";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Lightbox } from "@/components/ui/Lightbox";
import { locationNames, type LocationFilter } from "@/data/locations";
import type { AlbumPhoto, LocationKey } from "@/types/content";

export interface AlbumStoryCard {
  slug: string;
  title: string;
  summary: string;
  location: LocationKey;
  count: number;
  cover: AlbumPhoto["src"];
}

interface FeaturedAlbumsProps {
  groups: Record<LocationFilter, AlbumPhoto[]>;
  stories: AlbumStoryCard[];
}

/** Câu chuyện theo cặp đôi (trình bày như bài viết) + lưới ảnh masonry có lọc & lightbox (F2) */
export function FeaturedAlbums({ groups, stories }: FeaturedAlbumsProps) {
  const [filter, setFilter] = useState<LocationFilter>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = groups[filter];

  return (
    <>
      {/* Câu chuyện theo từng cặp đôi — bài đầu lớn, hai bài sau xếp cột */}
      <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
        {stories.map((s, i) => {
          const lead = i === 0;
          return (
            <li
              key={s.slug}
              data-reveal="up"
              className={lead ? "md:col-span-2 lg:col-span-7 lg:row-span-2" : "lg:col-span-5 lg:col-start-8"}
            >
              <Link
                href={`/album/${s.slug}`}
                className={`group grid gap-6 ${lead ? "" : "sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:items-center"}`}
              >
                <div className={`relative overflow-hidden bg-line ${lead ? "aspect-[4/5] sm:aspect-[5/4]" : "aspect-[4/5]"}`}>
                  <Image
                    src={s.cover}
                    alt={`Ảnh bìa album ${s.title}`}
                    fill
                    placeholder="blur"
                    sizes={lead ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw"}
                    className="hover-zoom object-cover transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-champagne-deep">
                    {locationNames[s.location]} · {s.count} ảnh
                  </p>
                  <h3
                    className={`mt-3 font-serif leading-[1.08] font-light transition-colors group-hover:text-champagne-deep ${
                      lead ? "text-[36px] md:text-[48px]" : "text-[28px] md:text-[30px]"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[520px] text-[15.5px] leading-[1.75] text-muted">{s.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium whitespace-nowrap text-ink underline decoration-champagne underline-offset-[6px] group-hover:text-champagne-deep">
                    Xem album
                    <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Thư viện khoảnh khắc — lọc theo bối cảnh */}
      <div className="mt-24 md:mt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h3 className="font-serif text-[30px] leading-tight font-light md:text-[40px]">
            Khung hình theo nơi chụp
          </h3>
          <FilterTabs value={filter} onChange={setFilter} />
        </div>

        <ul key={filter} className="mt-10 columns-2 gap-4 md:columns-3 md:gap-6 lg:columns-4">
          {photos.map((p, i) => (
            <li key={`${p.src.src}-${i}`} className="mb-4 break-inside-avoid md:mb-6">
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Xem lớn: ${p.alt}`}
                className="lightbox-fade group relative block w-full overflow-hidden bg-line"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="hover-zoom h-auto w-full transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-4 text-left text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="block text-[13px] text-champagne">{locationNames[p.location]}</span>
                  <span className="mt-1 block font-serif text-[18px] leading-tight">{p.albumTitle}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link href="/album" className={buttonClass("outline")}>
            Xem toàn bộ album
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>

      <Lightbox photos={photos} index={lightbox} onChange={setLightbox} />
    </>
  );
}
