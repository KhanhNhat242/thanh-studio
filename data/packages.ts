import type { PricingPackage } from "@/types/content";

/**
 * Gói dịch vụ (F3). Bảng giá CHƯA CÓ (REQUIREMENTS mục 9) — không hiển thị số tiền.
 * TODO(content): thay hạng mục & giá khi khách gửi bảng giá chính thức.
 */
export const priceNotice = "Liên hệ để nhận báo giá";

export const packages: PricingPackage[] = [
  {
    id: "pre-wedding",
    name: "Gói Pre-wedding",
    summary: "Bộ ảnh cưới mang đúng câu chuyện của hai bạn.",
    items: [
      "Chụp ngoại cảnh Huế, Lăng Cô, Đà Nẵng",
      "Hoặc chụp tại phim trường, studio",
      "Tư vấn concept theo câu chuyện riêng",
      "Gợi ý lịch trình cho cặp đôi ở xa",
    ],
  },
  {
    id: "combo",
    name: "Gói Combo Trọn Gói",
    summary: "Chụp, make up và váy cưới — một ekip lo trọn.",
    items: [
      "Chụp ảnh cưới pre-wedding trọn vẹn",
      "Make up & làm tóc cô dâu",
      "Váy cưới, áo dài và vest",
      "Một ekip đồng hành từ đầu",
      "Tối ưu ngân sách và thời gian",
    ],
    highlighted: true,
  },
  {
    id: "phong-su-trang-phuc",
    name: "Gói Phóng Sự & Trang Phục",
    summary: "Lưu giữ ngày cưới và chỉn chu từng chi tiết.",
    items: [
      "Chụp phóng sự trọn ngày cưới",
      "Quay phim phóng sự ngày cưới",
      "Make up & làm tóc cô dâu",
      "Thuê váy cưới, áo dài, vest",
    ],
  },
];

/** Lựa chọn trong form đặt lịch (F4): các gói + tuỳ chọn cần tư vấn */
export const bookingPackageOptions = [
  ...packages.map((p) => ({ value: p.id, label: p.name })),
  { value: "can-tu-van", label: "Chưa chắc, cần tư vấn thêm" },
];
