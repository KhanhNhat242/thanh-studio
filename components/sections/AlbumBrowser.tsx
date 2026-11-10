"use client";

import { getImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BounceCards } from "@/components/ui/BounceCards";
import { CircularCarousel, type CarouselItem } from "@/components/ui/CircularCarousel";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Lightbox } from "@/components/ui/Lightbox";
import { locationNames, type LocationFilter } from "@/data/locations";
import type { AlbumCard } from "@/types/content";

/**
 * Album theo cặp đôi (F2) — nằm ngay trên trang chủ, không có trang riêng.
 * Ảnh bìa xếp thành vòng 3D (React Bits CircularCarousel): tự xoay, kéo để xoay, lọc theo nơi chụp.
 * Bấm album bên cạnh → xoay ra giữa; bấm album đang ở giữa / Enter / nút "Xem album" → lightbox trọn bộ ảnh.
 * Tab theo nơi chụp (Huế / Lăng Cô / Đà Nẵng / Phim trường): ảnh xòe như quạt (React Bits BounceCards) —
 * ≥ 2 album: mỗi thẻ là ảnh bìa một album · 1 album: 5 ảnh của album đó. Bấm thẻ → lightbox.
 */

const optimized = (src: AlbumCard["cover"], width: number) => getImageProps({ src, alt: "", width, quality: 75 }).props.src;
export function AlbumBrowser({ albums }: { albums: AlbumCard[] }) {
  const [filter, setFilter] = useState<LocationFilter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  const shown = useMemo(
    () => (filter === "all" ? albums : albums.filter((a) => a.location === filter)),
    [albums, filter],
  );

  // Ảnh bìa qua bộ tối ưu của next/image (vòng 3D cắt mỗi thẻ thành nhiều dải — không dùng ảnh gốc 2048px)
  const items: CarouselItem[] = useMemo(
    () =>
      shown.map((a) => ({
        src: getImageProps({ src: a.cover, alt: "", width: 640, quality: 75 }).props.src,
        alt: `Ảnh bìa album ${a.title}`,
        title: a.title,
        subtitle: `${locationNames[a.location]} · ${a.photos.length} ảnh`,
      })),
    [shown],
  );

  // Thẻ cho dạng "quạt" ở các tab nơi chụp
  const fan = useMemo(() => {
    if (filter === "all" || shown.length === 0) return [];
    if (shown.length >= 2)
      return shown.slice(0, 5).map((a) => ({ src: optimized(a.cover, 640), alt: `Xem album ${a.title}`, slug: a.slug, photo: 0 }));
    const a = shown[0];
    return a.photos.slice(0, 5).map((p, i) => ({ src: optimized(p.src, 640), alt: `${a.title} — xem ảnh ${i + 1}`, slug: a.slug, photo: i }));
  }, [filter, shown]);

  // Cỡ thẻ theo bề ngang màn hình
  const [vw, setVw] = useState(1280);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const card = vw < 640 ? 132 : vw < 1024 ? 200 : 260;

  const openAlbum = (slug: string, photo = 0) => {
    setOpenSlug(slug);
    setPhotoIndex(photo);
  };
  const open = albums.find((a) => a.slug === openSlug);

  return (
    <>
      <FilterTabs
        value={filter}
        onChange={setFilter}
      />

      {filter === "all" ? (
        <>
          <div className="relative mt-6 h-[200px] sm:h-[400px] lg:mt-8 lg:h-[490px]">
            <CircularCarousel
              items={items}
              preset="cylinder"
              intro="rise"
              cardWidth={vw < 1024 ? 280 : 340}
              aspectRatio={0.8}
              speed={6}
              label="Album ảnh cưới theo cặp đôi"
              onItemClick={(_, index, isActive) => {
                if (isActive && shown[index]) openAlbum(shown[index].slug);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-8 flex justify-center lg:mt-10">
            <BounceCards
              key={filter}
              images={fan.map(({ src, alt }) => ({ src, alt }))}
              containerWidth="100%"
              containerHeight={Math.round(card * 1.25 * 1.45)}
              cardSize={card}
              spread={Math.round(card * 0.55)}
              rotation={10}
              pushDistance={Math.round(card * 0.6)}
              hoverScale={1.06}
              bounciness={0.6}
              animationDelay={0.2}
              animationStagger={0.06}
              borderWidth={vw < 640 ? 4 : 6}
              onCardClick={(i) => fan[i] && openAlbum(fan[i].slug, fan[i].photo)}
            />
          </div>
        </>
      )}

      <Lightbox
        photos={open?.photos ?? []}
        index={open ? photoIndex : null}
        onChange={(i) => {
          setPhotoIndex(i);
          if (i === null) setOpenSlug(null);
        }}
      />
    </>
  );
}
