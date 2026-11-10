/**
 * Thông tin liên hệ & thương hiệu — NGUỒN DUY NHẤT (AGENTS.md R1).
 * Giá trị chép đúng từng ký tự từ docs/REQUIREMENTS.md mục 2. Không hard-code ở nơi khác.
 */
export const siteConfig = {
  name: "Thanh Studio Wedding",
  legalName: "THANH STUDIO WEDDING - HUẾ",
  slogan: "Làm cho đúng, cho đủ tình",
  tagline: "Ảnh cưới chuyên nghiệp – Make up thời thượng – Lưu giữ khoảnh khắc",
  contactPerson: "Thanh",
  phone: "0905661736",
  phoneDisplay: "0905 661 736",
  email: "thanhstudio121dn@gmail.com",
  openingHours: "Mở cửa tất cả các ngày",
  branches: {
    hue: {
      name: "Chi nhánh Huế",
      address: "Lô CM4, căn 08, Lê Đức Anh, KĐT Ecogarden, TP Huế",
      mapsUrl: "https://maps.app.goo.gl/nyuKuRj85g3ExT2f7",
      // TODO(content): kiểm tra lại vị trí ghim trên bản đồ nhúng với khách
      mapsEmbedUrl:
        "https://www.google.com/maps?q=" +
        encodeURIComponent("KĐT Ecogarden, Lê Đức Anh, Vỹ Dạ, Huế") +
        "&z=16&output=embed",
    },
    daNang: {
      name: "Khu vực Đà Nẵng",
      // [CẦN XÁC NHẬN] chưa có địa chỉ — không bịa địa chỉ, không ghim bản đồ (REQUIREMENTS mục 9)
      note: "Liên hệ để hẹn lịch tư vấn",
    },
  },
  links: {
    tel: "tel:0905661736",
    zalo: "https://zalo.me/0905661736",
    messenger: "https://m.me/thanh.studiowedding",
    facebook: "https://www.facebook.com/thanh.studiowedding",
    email: "mailto:thanhstudio121dn@gmail.com",
  },
} as const;

export const homeNav = [
  { label: "Câu chuyện", href: "#cau-chuyen" },
  { label: "Dịch vụ", href: "#dich-vu" },
  { label: "Bối cảnh", href: "#boi-canh" },
  { label: "Album", href: "#album" },
  { label: "Bảng giá", href: "#bang-gia" },
  { label: "Liên hệ", href: "#dat-lich" },
] as const;
