import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedAlbums } from "@/components/sections/FeaturedAlbums";
import { getAlbum, getAlbumCover, getAllFeaturedGroups } from "@/lib/albums";
import { nb } from "@/lib/text";

const storySlugs = ["ao-dai-do-lang-tam", "may-nui-lang-co", "lua-do-giua-rung"];

export function AlbumsSection() {
  const stories = storySlugs.flatMap((slug) => {
    const a = getAlbum(slug);
    return a
      ? [
          {
            slug,
            title: a.title,
            summary: nb(a.summary),
            location: a.location,
            count: a.photos.length,
            cover: getAlbumCover(a),
          },
        ]
      : [];
  });

  return (
    <section id="album" className="chapter bg-ivory">
      <Container>
        <SectionHeading
          eyebrow="Album"
          title="Mỗi album là chuyện của một cặp đôi"
          description="Xem trọn bộ ảnh của từng cặp đôi, hoặc lọc những khung hình theo nơi chụp."
          className="mb-14 lg:mb-20"
        />
        <FeaturedAlbums groups={getAllFeaturedGroups()} stories={stories} />
      </Container>
    </section>
  );
}
