import type { StaticImageData } from "next/image";
import { albumPhotos } from "./album-photos";

export interface HeroSlide {
  id: string;
  mood: string;
  place: string;
  desktop: StaticImageData;
  mobile: StaticImageData;
  desktopPosition: string;
  mobilePosition: string;
  alt: string;
}

/** 3 ảnh giàu cảm xúc nhất cho Hero (F1) — theo thứ tự trong brief thiết kế. */
export const heroSlides: HeroSlide[] = [
  {
    id: "lang-co",
    mood: "Kỳ vĩ",
    place: "Vịnh Lăng Cô",
    desktop: albumPhotos["may-nui-lang-co"][0],
    mobile: albumPhotos["may-nui-lang-co"][1],
    desktopPosition: "50% 55%",
    mobilePosition: "50% 50%",
    alt: "Cặp đôi giữa non nước Lăng Cô, mây trắng phủ đỉnh núi",
  },
  {
    id: "hue",
    mood: "Hoài niệm cố đô",
    place: "Cố đô Huế",
    desktop: albumPhotos["ao-dai-do-lang-tam"][4],
    mobile: albumPhotos["ao-dai-do-lang-tam"][1],
    desktopPosition: "50% 60%",
    mobilePosition: "50% 50%",
    alt: "Cô dâu áo dài đỏ nắm tay chú rể dạo bước bên đồi thông và tường đá",
  },
  {
    id: "nang-am",
    mood: "Lãng mạn cận cảnh",
    place: "Nắng rừng nhiệt đới",
    desktop: albumPhotos["nang-rung-nhiet-doi"][0],
    mobile: albumPhotos["nang-rung-nhiet-doi"][0],
    desktopPosition: "50% 18%",
    mobilePosition: "50% 30%",
    alt: "Cô dâu ôm hoa tươi cười hạnh phúc bên chú rể trong nắng ấm",
  },
];
