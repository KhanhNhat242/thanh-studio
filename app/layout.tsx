import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site-config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} Huế – Ảnh cưới, Make up, Váy cưới trọn gói`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Thanh Studio Wedding – “Làm cho đúng, cho đủ tình”. Chụp ảnh cưới pre-wedding tại Huế, Lăng Cô, Đà Nẵng, phóng sự ngày cưới, trang điểm cô dâu, cho thuê váy cưới, áo dài, vest và gói combo trọn gói.",
  // TODO(content): đặt metadataBase khi có tên miền chính thức
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <AntdRegistry>{children}</AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
