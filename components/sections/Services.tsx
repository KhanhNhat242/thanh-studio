import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesStack } from "@/components/sections/ServicesStack";
import { services } from "@/data/services";

/** 5 dịch vụ chính — đúng thứ tự REQUIREMENTS mục 4; thẻ xếp chồng, cuộn để xem dịch vụ kế tiếp. */
export function Services() {
  return (
    <section id="dich-vu" className="bg-ivory">
      <ServicesStack
        services={services}
        heading={
          <Container className="services-heading pt-[96px] md:pt-[112px]">
            <SectionHeading
              align="center"
              title="Từ buổi chụp pre-wedding đến ngày cưới"
              description=""
            />
          </Container>
        }
      />
    </section>
  );
}
