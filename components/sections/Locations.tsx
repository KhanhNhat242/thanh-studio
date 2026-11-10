import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocationsStack } from "@/components/sections/LocationsStack";
import { locations } from "@/data/locations";

/** Bối cảnh chụp — thẻ xếp chồng, cuộn để lần lượt xem Huế, Lăng Cô, Đà Nẵng, phim trường. */
export function Locations() {
  return (
    <section id="boi-canh" className="bg-cream">
      <LocationsStack
        locations={locations}
        heading={
          <Container className="locations-heading pt-[96px] md:pt-[112px]">
            <SectionHeading
              align="center"
              eyebrow="Bối cảnh"
              title="Huế, Lăng Cô, Đà Nẵng hay phim trường"
            />
          </Container>
        }
      />
    </section>
  );
}
