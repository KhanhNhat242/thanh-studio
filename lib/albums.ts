import { albums } from "@/data/albums";
import { locationNames } from "@/data/locations";
import type { Album, AlbumCard, AlbumPhoto } from "@/types/content";

/**
 * Service layer cho album — UI chỉ gọi các hàm ở đây.
 * Sau này trang quản trị (F8) thay nguồn dữ liệu tại file này, không cần sửa UI.
 */
export function getAlbums(): Album[] {
  return albums;
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

/** Dữ liệu cho section Album trên trang chủ: mỗi thẻ = 1 cặp đôi, kèm toàn bộ ảnh để mở lightbox (F2). */
export function getAlbumCards(): AlbumCard[] {
  return albums.map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    location: a.location,
    cover: getAlbumCover(a),
    photos: toAlbumPhotos(a),
  }));
}
