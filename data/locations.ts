import type { Location, LocationKey } from "@/types/content";
import { albumPhotos } from "./album-photos";

export const locationNames: Record<LocationKey, string> = {
  hue: "Huế",
  "lang-co": "Lăng Cô",
  "da-nang": "Đà Nẵng",
  "phim-truong": "Phim trường",
};

export type LocationFilter = LocationKey | "all";

/** Bộ lọc album theo bối cảnh (F2) — dùng chung cho trang chủ và /album */
export const locationFilters: { key: LocationFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "hue", label: "Huế" },
  { key: "lang-co", label: "Lăng Cô" },
  { key: "da-nang", label: "Đà Nẵng" },
  { key: "phim-truong", label: "Phim trường" },
];

/** Bối cảnh chụp đặc trưng (REQUIREMENTS mục 4–5). TODO(content): xác nhận gợi ý hành trình với khách. */
export const locations: Location[] = [
  {
    key: "hue",
    name: "Cố Đô Huế",
    shortName: "Huế",
    description:
      "Nét trầm mặc, cổ kính của đồi Vọng Cảnh, lăng tẩm và kiến trúc xưa.",
    itinerary:
      "Gợi ý: sáng dạo lăng tẩm, chiều đón hoàng hôn trên đồi thông.",
    image: albumPhotos["ao-dai-do-lang-tam"][3],
    imageAlt: "Cô dâu áo dài đỏ và chú rể trên cầu gỗ trong khuôn viên lăng tẩm Huế",
  },
  {
    key: "lang-co",
    name: "Vịnh Lăng Cô",
    shortName: "Lăng Cô",
    description:
      "Không gian biển hồ bao la, mây trời giao hoà đầy phóng khoáng.",
    itinerary:
      "Gợi ý: chụp lúc sớm khi mặt hồ phẳng lặng, kết hợp nghỉ dưỡng biển.",
    image: albumPhotos["may-nui-lang-co"][2],
    imageAlt: "Cô dâu chú rể đứng bên mặt hồ Lăng Cô, phía xa là núi mây trùng điệp",
  },
  {
    key: "da-nang",
    name: "Đà Nẵng",
    shortName: "Đà Nẵng",
    description:
      "Giao thoa giữa biển xanh hiện đại và những khu rừng nhiệt đới ngập nắng.",
    itinerary:
      "Gợi ý: bình minh trên ghềnh đá, buổi chiều giữa rừng cây xanh mát.",
    image: albumPhotos["nang-rung-nhiet-doi"][2],
    imageAlt: "Cô dâu chú rể giữa khu rừng nhiệt đới ngập nắng",
  },
  {
    key: "phim-truong",
    name: "Phim Trường & Studio",
    shortName: "Studio",
    description:
      "Ánh sáng chuẩn chỉnh, tối giản, tập trung trọn vẹn vào thần thái hai bạn.",
    itinerary:
      "Gợi ý: phù hợp ngày mưa nắng thất thường, chủ động trọn thời gian.",
    image: albumPhotos["studio-trang-tinh-khoi"][0],
    imageAlt: "Cô dâu chú rể trong studio phông rèm trắng tinh khôi",
  },
];
