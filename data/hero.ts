import type { StaticImageData } from "next/image";
import { albumPhotos } from "./album-photos";

export interface HeroSlide {
  id: string;
  mood: string;
  place: string;
  /** Mô tả hiện khi thẻ được phóng to */
  description: string;
  desktop: StaticImageData;
  mobile: StaticImageData;
  /**
   * object-position cho ảnh desktop (ảnh ngang): chỉnh để đầu + thân cô dâu chú rể
   * nằm giữa màn hình theo chiều dọc khi ảnh phủ kín hero (màn rộng ~16:9 → 2:1)
   */
  desktopPosition: string;
  mobilePosition: string;
  alt: string;
}

/**
 * 5 thẻ ảnh cho Hero (F1) — slider hiện 3 thẻ mỗi lần; khi tải trang, thẻ giữa là Huế (bối cảnh đặc trưng).
 * Mô tả lấy lại từ dữ liệu bối cảnh / album đã có.
 * TODO(content): xác nhận câu mô tả hero với khách.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "lang-co",
    mood: "Kỳ vĩ",
    place: "Vịnh Lăng Cô",
    description: "Không gian biển hồ bao la, mây trời giao hoà đầy phóng khoáng.",
    desktop: albumPhotos["may-nui-lang-co"][0],
    mobile: albumPhotos["may-nui-lang-co"][1],
    desktopPosition: "50% 100%",
    mobilePosition: "50% 50%",
    alt: "Cặp đôi giữa non nước Lăng Cô, mây trắng phủ đỉnh núi",
  },
  {
    id: "hue",
    mood: "Hoài niệm cố đô",
    place: "Cố đô Huế",
    description: "Nét trầm mặc, cổ kính của đồi Vọng Cảnh, lăng tẩm và kiến trúc xưa.",
    desktop: albumPhotos["ao-dai-do-lang-tam"][4],
    mobile: albumPhotos["ao-dai-do-lang-tam"][1],
    desktopPosition: "62% 100%",
    mobilePosition: "50% 50%",
    alt: "Cô dâu áo dài đỏ nắm tay chú rể dạo bước bên đồi thông và tường đá",
  },
  {
    id: "nang-am",
    mood: "Lãng mạn cận cảnh",
    place: "Nắng rừng nhiệt đới",
    description: "Ánh nắng xuyên qua tán lá, bó hoa đồng nội và những nụ cười rạng rỡ nhất.",
    // Ảnh ngang (ảnh dọc cũ bị cắt mất mặt khi phủ màn hình rộng)
    desktop: albumPhotos["nang-rung-nhiet-doi"][3],
    mobile: albumPhotos["nang-rung-nhiet-doi"][0],
    desktopPosition: "50% 30%",
    mobilePosition: "50% 30%",
    alt: "Cô dâu ôm hoa tươi cười hạnh phúc bên chú rể trong nắng ấm",
  },
  {
    id: "cung-dien",
    mood: "Sang trọng cổ kính",
    place: "Sắc vàng cung điện",
    description: "Kiến trúc vàng son, ánh đèn chùm và nét sang trọng cổ kính trong từng khung hình.",
    desktop: albumPhotos["cung-dien-vang-son"][1],
    mobile: albumPhotos["cung-dien-vang-son"][0],
    desktopPosition: "50% 0%",
    mobilePosition: "50% 40%",
    alt: "Cô dâu váy ren và chú rể vest trắng trong sảnh cung điện vàng son",
  },
  {
    id: "lua-do",
    mood: "Lãng mạn như thước phim",
    place: "Lụa đỏ giữa rừng xanh",
    description: "Dải lụa đỏ và hoa hồng giữa tán rừng xanh, một concept lãng mạn như thước phim.",
    desktop: albumPhotos["lua-do-giua-rung"][1],
    mobile: albumPhotos["lua-do-giua-rung"][2],
    desktopPosition: "50% 10%",
    mobilePosition: "50% 40%",
    alt: "Cô dâu chú rể giữa rừng xanh bên dải lụa đỏ và hoa hồng",
  },
];
