import { SiteHeader } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { AlbumsSection } from "@/components/sections/AlbumsSection";
import { Booking } from "@/components/sections/Booking";
import { Hero } from "@/components/sections/Hero";
import { Locations } from "@/components/sections/Locations";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { siteConfig } from "@/lib/site-config";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.legalName,
  slogan: siteConfig.slogan,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lô CM4, căn 08, Lê Đức Anh, KĐT Ecogarden",
    addressLocality: "TP Huế",
    addressCountry: "VN",
  },
  openingHours: "Mo-Su 00:00-23:59",
  sameAs: [siteConfig.links.facebook],
};

export default function HomePage() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <main>
        <Hero />
        <About />
        <Services />
        <Locations />
        <AlbumsSection />
        <Pricing />
        <Testimonials />
        <Booking />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
