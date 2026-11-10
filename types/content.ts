import type { StaticImageData } from "next/image";

export type LocationKey = "hue" | "lang-co" | "da-nang" | "phim-truong";

export interface Location {
  key: LocationKey;
  name: string;
  /** Nhãn ngắn trên ảnh/bộ lọc */
  shortName: string;
  description: string;
  itinerary: string;
  image: StaticImageData;
  imageAlt: string;
  /** object-position cho thẻ ngang (ảnh dọc bị cắt) — giữ mặt cô dâu chú rể trong khung */
  imagePosition?: string;
  /** Khối chữ trên thẻ (desktop): mặc định trái; "right" khi người trong ảnh đứng bên trái */
  textSide?: "left" | "right";
  /** object-position riêng cho thẻ mobile (gần vuông) */
  imagePositionMobile?: string;
  /** Khối chữ trên thẻ mobile: mặc định "top" (vùng trời/cây/rèm), "bottom" khi người đứng cao trong ảnh */
  mobileText?: "top" | "bottom";
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  objectPosition?: string;
  badge?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  summary: string;
  items: string[];
  highlighted?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  note: string;
}

export interface Album {
  slug: string;
  title: string;
  location: LocationKey;
  summary: string;
  photos: StaticImageData[];
  coverIndex: number;
}

export interface AlbumPhoto {
  src: StaticImageData;
  alt: string;
  albumSlug: string;
  albumTitle: string;
  location: LocationKey;
}

/** Thẻ album theo cặp đôi trên trang chủ — bấm vào mở lightbox với toàn bộ `photos` */
export interface AlbumCard {
  slug: string;
  title: string;
  summary: string;
  location: LocationKey;
  cover: StaticImageData;
  photos: AlbumPhoto[];
}
