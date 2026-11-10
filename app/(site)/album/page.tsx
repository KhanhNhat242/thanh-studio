import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AlbumGrid } from "@/components/sections/AlbumGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAlbumCover, getAlbums } from "@/lib/albums";
import { nb } from "@/lib/text";

export const metadata: Metadata = {
  title: "Album ảnh cưới",
  description:
    "Thư viện album ảnh cưới của Thanh Studio Wedding tại Huế, Lăng Cô, Đà Nẵng và phim trường.",
};

export default function AlbumIndexPage() {
  const albums = getAlbums().map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: nb(a.summary),
    location: a.location,
    count: a.photos.length,
    cover: getAlbumCover(a),
  }));

  return (
    <>
      <SiteHeader variant="solid" basePath="/" />
      <main className="bg-cream pt-[140px] pb-20 md:pt-[180px] md:pb-32">
        <Container>
          <SectionHeading
            as="h1"
            title="Album ảnh cưới"
            description="Mỗi album là câu chuyện của một cặp đôi. Chọn nơi chụp để xem những bộ ảnh ở Huế, Lăng Cô, Đà Nẵng hoặc phim trường."
            className="mb-12 lg:mb-16"
          />
          <AlbumGrid albums={albums} />
        </Container>
      </main>
    </>
  );
}
