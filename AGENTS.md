<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RULES DỰ ÁN — THANH STUDIO WEDDING (HUẾ)

> Áp dụng cho **mọi** thay đổi: thêm trang, sửa code, sửa nội dung, thêm thư viện — dù do người hay AI agent thực hiện.
> Thứ tự ưu tiên khi mâu thuẫn: **`docs/REQUIREMENTS.md` > file này > thói quen/giả định cá nhân.**

## R0. Trước khi làm bất cứ việc gì

1. **Đọc `docs/REQUIREMENTS.md`** — đó là nguồn sự thật duy nhất về nội dung, phạm vi, phong cách.
2. Đọc guide liên quan trong `node_modules/next/dist/docs/` trước khi dùng API Next.js (Next 16.4 — khác bản cũ; dự án bật `cacheComponents`, `partialPrefetching`).
3. Việc sắp làm phải gắn được với một mục trong REQUIREMENTS (dịch vụ mục 4, chức năng F1–F8 mục 7, …). Nếu **không gắn được** → đó là ngoài phạm vi: hỏi lại, không tự thêm.
4. Nếu yêu cầu mới **mâu thuẫn** với REQUIREMENTS → dừng lại, nêu rõ chỗ mâu thuẫn và hỏi. Khi đã được chốt, **cập nhật `docs/REQUIREMENTS.md` trước**, rồi mới code.

## R1. Nội dung (quan trọng nhất)

- **Tiếng Việt có dấu đầy đủ** cho mọi text hiển thị (kể cả label form, thông báo lỗi, alt ảnh, metadata). Không để sót tiếng Anh của template.
- **Không bịa thông tin**: giá, địa chỉ chi nhánh Đà Nẵng, năm thành lập, số khách, giải thưởng, review, tên khách hàng. Thiếu dữ liệu → làm đúng **mục 9 của REQUIREMENTS** và gắn `// TODO(content): <mô tả>`.
- Thông tin liên hệ (SĐT `0905661736` / hiển thị `0905 661 736`, email `thanhstudio121dn@gmail.com`, địa chỉ CN Huế, link FB/Maps/Zalo/Messenger) **chỉ được khai báo một lần** trong `lib/site-config.ts` và import ở mọi nơi. Cấm hard-code lặp lại.
- Danh sách dịch vụ đúng **5 mục, đúng thứ tự** ở REQUIREMENTS mục 4. Slogan chuẩn: **“Làm cho đúng, cho đủ tình”**.
- Ngôn từ: lãng mạn, ấm áp, xưng "đôi bạn" / "Thanh Studio"; tránh văn quảng cáo phô trương, tránh câu sáo kiểu "hàng đầu", "số 1".

## R2. Thiết kế & phong cách

- Đúng brief: **editorial, lãng mạn, tinh tế** · nền **trắng kem** · nhấn **vàng champagne / hồng phấn nhạt** · tiêu đề **serif** · **ảnh lớn tràn màn hình**.
- Màu **chỉ** dùng qua token trong `app/globals.css` (`@theme`: cream, ivory, champagne, blush, ink, muted, line — giá trị ở REQUIREMENTS mục 6). Cấm mã hex rải rác trong component, cấm màu Tailwind mặc định lệch tông (blue, indigo, green… và đen tuyền `#000`).
- **Không dark mode** — bỏ block `prefers-color-scheme: dark`; site luôn sáng.
- Font qua `next/font/google`, **bắt buộc subset `vietnamese`**: serif cho tiêu đề, sans cho nội dung. Không dùng font không hỗ trợ tiếng Việt.
- Hiệu ứng: dùng hệ `data-reveal` / `.reveal-zoom` / `.deco-float` / `.lightbox-fade` đã có trong `globals.css`; không thêm thư viện animation khi chưa cần. Luôn tôn trọng `prefers-reduced-motion`.
- **Mobile-first**: kiểm tra ở 360 / 768 / 1280 / 1920px, không cuộn ngang, chữ ≥ 16px cho body trên mobile, vùng bấm ≥ 44px.
- Nút Gọi / Zalo / Messenger cố định (F7) không được che nút submit form hay CTA.

## R3. Kỹ thuật

- Stack cố định: **Next.js 16.4 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Ant Design 6**. Không đổi/thêm framework UI khác. Thêm dependency mới → phải nêu lý do.
- **Phân vai UI**: trang public dùng **Tailwind** (tự thiết kế theo brief editorial); **Ant Design dùng cho `/admin`** và component phức tạp (DatePicker, Select, Form, Modal). Khi dùng antd ở trang public phải theme lại bằng `ConfigProvider` theo token màu/font ở R2.
- Server Component mặc định; chỉ thêm `'use client'` ở component lá thật sự cần state/event (slideshow, lightbox, form, nút floating). **Không** đặt `'use client'` cho cả trang.
- Ảnh: luôn dùng `next/image`, có `alt` tiếng Việt mô tả, `sizes` hợp lý; ảnh hero `priority`. Ảnh lưu ở `public/images/<nhóm>/` (vd. `hero/`, `albums/<slug>/`, `services/`, `logo/`), tên file `kebab-case` không dấu.
- **Dữ liệu tách khỏi giao diện**: dịch vụ, gói giá, album, testimonial, bối cảnh nằm trong `data/*.ts` có type ở `types/`. Component chỉ nhận props. Truy cập dữ liệu qua `lib/` (service layer) để sau này thay bằng DB/API cho trang quản trị (F8) mà không sửa UI.
- Form đặt lịch (F4): validate cả client và server (Server Action hoặc Route Handler); SĐT VN `^(0|\+84)(3|5|7|8|9)\d{8}$`; 3 trường bắt buộc: **ngày cưới, gói, SĐT**.
- `/admin`: không được để lộ public khi có dữ liệu thật — phải có bảo vệ đăng nhập trước khi bàn giao bản chính thức; `noindex`.
- SEO: `metadata` từng trang bằng tiếng Việt, `<html lang="vi">`, Open Graph với ảnh đẹp nhất, JSON-LD `LocalBusiness` (chỉ dùng dữ liệu có trong REQUIREMENTS).
- TypeScript strict, không `any` khi tránh được. Component `PascalCase.tsx`, hàm/biến `camelCase`, route/thư mục `kebab-case`.

### Cấu trúc thư mục chuẩn

```
app/                    # routes (App Router)
  (site)/               # trang public: page.tsx, album/, album/[slug]/
  admin/                # trang quản trị (F8)
components/
  sections/             # Hero, About, Services, Albums, Pricing, Locations, Testimonials, Booking, Contact
  ui/                   # nút, tiêu đề section, lightbox, floating-contact…
data/                   # nội dung tĩnh: services.ts, packages.ts, albums.ts, testimonials.ts, locations.ts
lib/                    # site-config.ts (liên hệ), services truy cập dữ liệu, validate
types/                  # kiểu dữ liệu dùng chung
public/images/          # ảnh theo nhóm
docs/REQUIREMENTS.md    # yêu cầu — nguồn sự thật
```

## R4. Quy trình mỗi lần thay đổi

1. Đối chiếu REQUIREMENTS (R0).
2. Làm theo R1–R3.
3. Chạy **`npm run lint`** và **`npm run build`** — phải sạch lỗi trước khi báo xong.
4. Tự kiểm theo checklist **REQUIREMENTS mục 11** cho phần vừa đụng tới.
5. Báo cáo: đã làm gì, gắn với mục nào trong REQUIREMENTS, còn `TODO(content)` / `[CẦN XÁC NHẬN]` nào.
6. Nếu thay đổi làm đổi phạm vi/nội dung đã chốt → cập nhật `docs/REQUIREMENTS.md` cùng lúc.

## R5. Những điều CẤM

- Bịa giá, địa chỉ, số liệu, review, tên người thật.
- Hard-code thông tin liên hệ ngoài `lib/site-config.ts`.
- Thêm dịch vụ/tính năng không có trong REQUIREMENTS mà không hỏi.
- Dùng tiếng Anh hoặc tiếng Việt không dấu ở text hiển thị.
- Bỏ phong cách brief (nền tối, màu chói, font sans cho tiêu đề, ảnh nhỏ lẻ tẻ ở hero).
- Để lại dấu vết template cũ ("Booking Homestay", "Create Next App", Geist làm font chính, `lang="en"`).
- Xoá hoặc sửa block `nextjs-agent-rules` ở đầu file này.
