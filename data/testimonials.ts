import type { Testimonial } from "@/types/content";

/**
 * Cảm nhận khách hàng (F5) — NỘI DUNG MẪU.
 * TODO(content): thay bằng đánh giá thật trên Facebook (được khách đồng ý). Không bịa tên thật.
 */
export const testimonials: Testimonial[] = [
  {
    id: "hue",
    quote:
      "Ekip chụp chậm rãi, kiên nhẫn chờ đúng khoảnh khắc chứ không hề vội vàng. Xem album, tụi mình thấy rõ câu chuyện của chính mình.",
    author: "Cặp đôi tại Huế",
    note: "Pre-wedding · Cố đô Huế",
  },
  {
    id: "lang-co",
    quote:
      "Ở xa nên tụi mình lo lắm, nhưng Thanh Studio lo trọn từ váy đến make up. Bộ ảnh Lăng Cô đẹp hơn cả tụi mình tưởng tượng.",
    author: "Cặp đôi từ TP.HCM về Lăng Cô",
    note: "Combo trọn gói · Lăng Cô",
  },
  {
    id: "da-nang",
    quote:
      "Lớp make up trong trẻo, giữ đẹp suốt cả ngày dài chụp ngoài trời. Ekip vui vẻ, tinh tế nên hai đứa cười rất tự nhiên.",
    author: "Cặp đôi tại Đà Nẵng",
    note: "Make up & chụp ngoại cảnh",
  },
];
