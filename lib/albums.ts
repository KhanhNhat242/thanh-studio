import { albums, featuredPicks } from "@/data/albums";
import { locationNames, locations } from "@/data/locations";
import type { Album, AlbumPhoto, Location, LocationKey } from "@/types/content";

/**
 * Service layer cho album — UI chỉ gọi các hàm ở đây.
 * Sau này trang quản trị (F8) thay nguồn dữ liệu tại file này, không cần sửa UI.
 */
export function getAlbums(): Album[] {
  return albums;
}

export function getAlbum(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}

export function getLocation(key: LocationKey): Location | undefined {
  return locations.find((l) => l.key === key);
}

export function getAlbumCover(album: Album) {
  return album.photos[album.coverIndex] ?? album.photos[0];
}

export function toAlbumPhotos(album: Album): AlbumPhoto[] {
  return album.photos.map((src, i) => ({
    src,
    alt: `${album.title} — ảnh ${i + 1}, bối cảnh ${locationNames[album.location]}`,
    albumSlug: album.slug,
    albumTitle: album.title,
    location: album.location,
  }));
}

const FEATURED_LIMIT = 8;

/** Ảnh nổi bật cho trang chủ, theo bộ lọc bối cảnh */
export function getFeaturedPhotos(location: LocationKey | "all"): AlbumPhoto[] {
  if (location === "all") {
    return featuredPicks.flatMap(([slug, index]) => {
      const album = getAlbum(slug);
      return album ? [toAlbumPhotos(album)[index]] : [];
    });
  }
  return albums
    .filter((a) => a.location === location)
    .flatMap(toAlbumPhotos)
    .slice(0, FEATURED_LIMIT);
}

export function getAllFeaturedGroups(): Record<LocationKey | "all", AlbumPhoto[]> {
  return {
    all: getFeaturedPhotos("all"),
    hue: getFeaturedPhotos("hue"),
    "lang-co": getFeaturedPhotos("lang-co"),
    "da-nang": getFeaturedPhotos("da-nang"),
    "phim-truong": getFeaturedPhotos("phim-truong"),
  };
}
