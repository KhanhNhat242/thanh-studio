const NBSP = " ";

/** Tên riêng nhiều chữ không được tách xuống dòng (vd. "Đà / Nẵng") */
const KEEP_TOGETHER = /(Đà|Lăng|Thanh|Phim) (Nẵng|Cô|Studio|trường|Trường)/g;

/**
 * Chống "rớt 1 chữ" xuống dòng cuối: nối 2 chữ cuối bằng khoảng trắng không ngắt,
 * nên dòng cuối luôn có ít nhất 2 chữ trên mọi kích thước màn hình.
 * Dùng cho MỌI đoạn text hiển thị (tiêu đề, đoạn văn, mô tả thẻ).
 */
export function nb(text: string): string {
  // Không ngắt dòng tại dấu gạch nối trong từ (vd. "pre-wedding")
  const trimmed = text
    .trim()
    .replace(/(\p{L})-(\p{L})/gu, "$1⁠-⁠$2")
    .replace(KEEP_TOGETHER, `$1${NBSP}$2`);
  const i = trimmed.lastIndexOf(" ");
  if (i <= 0) return trimmed;
  return trimmed.slice(0, i) + NBSP + trimmed.slice(i + 1);
}
