import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AlbumBrowser } from "@/components/sections/AlbumBrowser";
import { getAlbumCards } from "@/lib/albums";

export function AlbumsSection() {
  return (
    <section id="album" className="chapter bg-ivory">
      <Container>
        <SectionHeading
          align="center"
          eyebrow=""
          title="Mỗi album là chuyện của một cặp đôi"
          description=""
          className="mb-12 lg:mb-16"
        />
        <AlbumBrowser albums={getAlbumCards()} />
      </Container>
    </section>
  );
}
