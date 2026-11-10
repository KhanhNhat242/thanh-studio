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
