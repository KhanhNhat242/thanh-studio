import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AlbumGallery } from "@/components/sections/AlbumGallery";
import { buttonClass } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { locationNames } from "@/data/locations";
import { getAlbum, getAlbumCover, getAlbums, getLocation, toAlbumPhotos } from "@/lib/albums";
import { nb } from "@/lib/text";

export function generateStaticParams() {
  return getAlbums().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/album/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const album = getAlbum(slug);
  if (!album) return {};
  return { title: album.title, description: album.summary };
}

/** Nhãn chương: album được kể theo thứ tự bối cảnh → khoảnh khắc → lời kết */
function ChapterLabel({ index, title }: { index: number; title: string }) {
  return (
    <p className="text-[14px] font-medium text-champagne-deep">
      Chương {index} · {title}
    </p>
  );
}

/** Album theo cặp đôi — kể theo từng chương: bối cảnh → khoảnh khắc → lời kết. */
export default async function AlbumDetailPage(props: PageProps<"/album/[slug]">) {
  const { slug } = await props.params;
  const album = getAlbum(slug);
  if (!album) notFound();

  const location = getLocation(album.location);
  const photos = toAlbumPhotos(album);
  // Ảnh minh hoạ chương "Bối cảnh": lấy ảnh khác ảnh bìa
  const sceneIndex = album.coverIndex === 1 ? 0 : 1;
  const scene = photos[sceneIndex] ?? photos[0];
  const others = getAlbums()
    .filter((a) => a.slug !== album.slug)
    .slice(0, 3);

  return (
    <>
      <SiteHeader variant="overlay" basePath="/" />
      <main>
        {/* Mở đầu */}
        <section className="on-dark relative isolate flex h-[86svh] min-h-[560px] items-end overflow-hidden bg-ink text-cream">
          <Image
            src={getAlbumCover(album)}
            alt={`Ảnh bìa album ${album.title}`}
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="ken-burns object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink/75 via-ink/30 via-45% to-transparent"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/40 to-transparent" />
          <Container className="relative pb-14 md:pb-20">
            <Link
              href="/album"
              className="inline-flex min-h-11 items-center gap-2 text-[15px] text-cream/90 hover:text-champagne"
            >
              <ArrowLeftIcon className="size-4" />
              Tất cả album
            </Link>
            <p className="mt-4 text-[15px] text-cream text-shadow-soft">
              {locationNames[album.location]} · {album.photos.length} ảnh
            </p>
            <h1 className="mt-3 font-serif text-[48px] leading-[1] font-light tracking-[-0.015em] text-shadow-soft md:text-[72px] xl:text-[96px]">
              {nb(album.title)}
            </h1>
          </Container>
        </section>

        {/* Chương 01 — Bối cảnh */}
        <section className="chapter bg-cream">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div data-reveal="up" className="lg:col-span-5">
                <ChapterLabel index={1} title="Bối cảnh" />
                <h2 className="mt-4 font-serif text-[38px] leading-[1.08] font-light sm:text-[46px] md:text-[56px]">
                  {location?.name ?? locationNames[album.location]}
                </h2>
                <p className="mt-6 text-[16px] leading-[1.85] text-ink/85 md:text-[17px]">
                  {nb(album.summary)}
                </p>
                {location && (
                  <p
                    className="mt-5 text-[16px] leading-[1.85] text-muted md:text-[17px]"
                  >
                    {nb(location.description)}
                  </p>
                )}
              </div>
              <figure data-reveal="up" className="lg:col-span-6 lg:col-start-7">
                <div className="relative aspect-[4/5] overflow-hidden bg-line">
                  <Image
                    src={scene.src}
                    alt={scene.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="reveal-zoom object-cover"
                  />
                </div>
                {location && (
                  <figcaption className="mt-3 text-[14px] leading-[1.6] text-muted">
                    {nb(location.itinerary)}
                  </figcaption>
                )}
              </figure>
            </div>
          </Container>
        </section>

        {/* Chương 02 — Khoảnh khắc */}
        <section className="chapter bg-ivory">
          <Container>
            <div data-reveal="up" className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-7">
                <ChapterLabel index={2} title="Khoảnh khắc" />
                <h2 className="mt-4 font-serif text-[38px] leading-[1.08] font-light sm:text-[46px] md:text-[56px]">
                  {nb("Từng khung hình của hai bạn")}
                </h2>
              </div>
              <p
                className="text-[16px] leading-[1.8] text-ink/80 lg:col-span-4 lg:col-start-9 lg:pb-2"
              >
                {nb(
                  `${album.photos.length} khoảnh khắc — chạm vào ảnh để xem lớn, vuốt hoặc dùng phím mũi tên để xem tiếp.`,
                )}
              </p>
            </div>
            <AlbumGallery photos={photos} />
          </Container>
        </section>

        {/* Chương 03 — Lời kết.
            TODO(content): khi có cảm nhận thật của chính cặp đôi trong album (được đồng ý), đổi chương này thành "Cảm nhận". */}
        <section className="chapter bg-cream">
          <Container>
            <div data-reveal="up" className="mx-auto max-w-[640px] text-center">
              <ChapterLabel index={3} title="Viết tiếp câu chuyện" />
              <h2 className="mt-4 font-serif text-[34px] leading-[1.15] font-light md:text-[48px]">
                {nb("Hai bạn muốn có một bộ ảnh như thế này?")}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.8] text-ink/85 md:text-[17px]">
                {nb("Kể cho Thanh Studio nghe về ngày vui của hai bạn — ngày cưới, nơi muốn chụp và phong cách yêu thích.")}
              </p>
              <Link href="/#dat-lich" className={buttonClass("primary", "mt-8")}>
                Đặt lịch tư vấn
              </Link>
            </div>
          </Container>
        </section>

        {/* Những câu chuyện khác */}
        <section className="chapter bg-ivory">
          <Container>
            <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-serif text-[36px] leading-tight font-light md:text-[48px]">
                {nb("Những câu chuyện khác")}
              </h2>
              <Link
                href="/album"
                className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-ink underline decoration-champagne underline-offset-[6px] hover:text-champagne-deep"
              >
                Tất cả album
                <ArrowRightIcon className="size-4 text-champagne-deep" />
              </Link>
            </div>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((a) => (
                <li key={a.slug}>
                  <Link href={`/album/${a.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-line">
                      <Image
                        src={getAlbumCover(a)}
                        alt={`Ảnh bìa album ${a.title}`}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="hover-zoom object-cover transition-transform duration-[1400ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-5 text-[14px] font-medium text-champagne-deep">
                      {locationNames[a.location]}
                    </p>
                    <p className="mt-2 font-serif text-[28px] leading-tight font-light group-hover:text-champagne-deep">
                      {a.title}
                      <ArrowRightIcon className="ml-2 inline-block size-4 align-middle transition-transform group-hover:translate-x-1" />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
    </>
  );
}
