import type { Album } from "@/types/content";
import { albumPhotos } from "./album-photos";

/**
 * Album theo cặp đôi / bối cảnh (F2).
 * TODO(content): xác nhận với khách bối cảnh thực tế từng bộ ảnh và tên album hiển thị.
 * Không dùng tên thật của cặp đôi khi chưa được đồng ý.
 */
export const albums: Album[] = [
  {
    slug: "may-nui-lang-co",
    title: "Mây Núi Lăng Cô",
    location: "lang-co",
    summary:
      "Mặt hồ phẳng lặng, núi mây trùng điệp và hai bạn giữa khoảng trời bao la của vịnh Lăng Cô.",
    photos: albumPhotos["may-nui-lang-co"],
    coverIndex: 0,
  },
  {
    slug: "ao-dai-do-lang-tam",
    title: "Áo Dài Đỏ Giữa Lăng Tẩm",
    location: "hue",
    summary:
      "Tà áo dài đỏ dạo bước qua cầu gỗ, đồi thông và tường đá rêu phong của cố đô Huế.",
    photos: albumPhotos["ao-dai-do-lang-tam"],
    coverIndex: 2,
  },
  {
    slug: "song-huong-khach-san-co-dien",
    title: "Sông Hương & Hành Lang Cổ Điển",
    location: "hue",
    summary:
      "Từ hành lang khách sạn cổ điển ấm áp đến chuyến thuyền trên sông Hương, ngang qua chùa Thiên Mụ.",
    photos: albumPhotos["song-huong-khach-san-co-dien"],
    coverIndex: 2,
  },
  {
    slug: "cung-dien-vang-son",
    title: "Sắc Vàng Cung Điện",
    location: "hue",
    summary:
      "Kiến trúc vàng son, ánh đèn chùm và nét sang trọng cổ kính trong từng khung hình.",
    photos: albumPhotos["cung-dien-vang-son"],
    coverIndex: 0,
  },
  {
    slug: "doi-thong-trong-gio",
    title: "Đồi Thông Trong Gió",
    location: "hue",
    summary:
      "Tà voan bay trong gió giữa rừng thông xanh thẫm, nhẹ nhàng và đầy tự do.",
    photos: albumPhotos["doi-thong-trong-gio"],
    coverIndex: 0,
  },
  {
    slug: "binh-minh-tren-bien",
    title: "Bình Minh Trên Ghềnh Đá",
    location: "da-nang",
    summary:
      "Nắng sớm trên biển, ghềnh đá và những đoá hoa rực rỡ cho buổi chụp đầy cảm xúc.",
    photos: albumPhotos["binh-minh-tren-bien"],
    coverIndex: 0,
  },
  {
    slug: "lua-do-giua-rung",
    title: "Lụa Đỏ Giữa Rừng Xanh",
    location: "da-nang",
    summary:
      "Dải lụa đỏ và hoa hồng giữa tán rừng xanh, một concept lãng mạn như thước phim.",
    photos: albumPhotos["lua-do-giua-rung"],
    coverIndex: 0,
  },
  {
    slug: "nang-rung-nhiet-doi",
    title: "Nắng Rừng Nhiệt Đới",
    location: "da-nang",
    summary:
      "Ánh nắng xuyên qua tán lá, bó hoa đồng nội và những nụ cười rạng rỡ nhất.",
    photos: albumPhotos["nang-rung-nhiet-doi"],
    coverIndex: 0,
  },
  {
    slug: "studio-trang-tinh-khoi",
    title: "Studio Trắng Tinh Khôi",
    location: "phim-truong",
    summary:
      "Phông rèm trắng, ánh sáng chuẩn chỉnh và trọn vẹn thần thái của hai bạn.",
    photos: albumPhotos["studio-trang-tinh-khoi"],
    coverIndex: 0,
  },
];

/** Ảnh nổi bật trang chủ khi chọn "Tất cả" — [slug, vị trí ảnh trong album] */
export const featuredPicks: [string, number][] = [
  ["may-nui-lang-co", 2],
  ["ao-dai-do-lang-tam", 2],
  ["song-huong-khach-san-co-dien", 2],
  ["binh-minh-tren-bien", 0],
  ["studio-trang-tinh-khoi", 2],
  ["lua-do-giua-rung", 1],
  ["cung-dien-vang-son", 0],
  ["doi-thong-trong-gio", 0],
];
