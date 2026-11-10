import type { Service } from "@/types/content";
import { albumPhotos } from "./album-photos";

/** Đúng 5 dịch vụ, đúng thứ tự REQUIREMENTS mục 4. */
export const services: Service[] = [
  {
    id: "pre-wedding",
    title: "Chụp ảnh cưới Pre-wedding",
    description:
      "Thực hiện các bộ ảnh giàu chất thơ tại Huế, Lăng Cô, Đà Nẵng và hệ thống phim trường.",
    image: albumPhotos["lua-do-giua-rung"][0],
    imageAlt: "Cặp đôi giữa rừng xanh với dải lụa đỏ và hoa hồng",
    objectPosition: "50% 45%",
  },
  {
    id: "phong-su",
    title: "Chụp và quay phóng sự ngày cưới",
    description:
      "Bắt trọn từng ánh mắt, nụ cười và giọt nước mắt hạnh phúc tự nhiên nhất trong ngày trọng đại.",
    image: albumPhotos["song-huong-khach-san-co-dien"][2],
    imageAlt: "Cô dâu chú rể hôn nhau ăn mừng dưới ánh đèn chùm ấm áp",
    objectPosition: "50% 35%",
  },
  {
    id: "make-up",
    title: "Trang điểm cô dâu (Make up)",
    description:
      "Phong cách trang điểm thời thượng, tôn nét thanh tú tự nhiên và giữ lớp nền bền đẹp.",
    image: albumPhotos["ao-dai-do-lang-tam"][0],
    imageAlt: "Cận cảnh cô dâu áo dài đỏ với lớp trang điểm trong trẻo",
    objectPosition: "50% 30%",
  },
  {
    id: "thue-vay",
    title: "Cho thuê váy cưới, áo dài, vest",
    description:
      "Tuyển chọn các thiết kế váy cưới thanh lịch, áo dài truyền thống và vest chỉn chu cho đôi bạn.",
    image: albumPhotos["cung-dien-vang-son"][1],
    imageAlt: "Cô dâu váy ren và chú rể vest trắng trong không gian cổ điển",
    objectPosition: "50% 35%",
  },
  {
    id: "combo",
    title: "Gói Combo trọn gói",
    description:
      "Giải pháp tối ưu ngân sách và thời gian, lo trọn mọi khâu để hai bạn thảnh thơi tận hưởng ngày vui.",
    image: albumPhotos["nang-rung-nhiet-doi"][1],
    imageAlt: "Cô dâu ôm bó hoa đồng nội rạng rỡ bên chú rể",
    objectPosition: "50% 22%",
    // TODO(content): xác nhận với khách nhãn "Được chọn nhiều nhất"
    badge: "Được chọn nhiều nhất",
  },
];
