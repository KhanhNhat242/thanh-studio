import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { albumPhotos } from "@/data/album-photos";
import { nb } from "@/lib/text";

/** Câu chuyện thương hiệu — lưới bất đối xứng kiểu tạp chí, drop cap cho đoạn mở đầu. */
export function About() {
  return (
    <section id="cau-chuyen" className="chapter bg-cream">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Ảnh lớn bên trái */}
          <figure data-reveal="up" className="lg:col-span-6 xl:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={albumPhotos["song-huong-khach-san-co-dien"][0]}
                alt="Cô dâu chú rể nắm tay bước dọc hành lang khách sạn cổ điển"
                fill
                placeholder="blur"
                sizes="(min-width: 1280px) 56vw, (min-width: 1024px) 48vw, 100vw"
                className="reveal-zoom object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[14px] text-muted">
              Hành lang khách sạn cổ điển bên sông Hương, Huế
            </figcaption>
          </figure>

          {/* Cột chữ bên phải, lệch xuống như trang tạp chí */}
          <div data-reveal="up" className="lg:col-span-6 lg:pt-16 xl:col-span-5 xl:pt-24">
            <p className="text-[14px] font-medium text-champagne-deep">Câu chuyện</p>
            <h2 className="mt-4 font-serif text-[38px] leading-[1.08] font-light tracking-[-0.01em] sm:text-[46px] md:text-[56px]">
              {nb("Chụp chậm, để ảnh kể đúng chuyện của hai bạn")}
            </h2>
            {/* TODO(content): thay bằng đoạn câu chuyện thương hiệu nguyên văn trong bài đăng Facebook */}
            <p
              className="drop-cap mt-8 text-[16px] leading-[1.85] text-ink/85 md:text-[17px]"
            >
              {nb(
                "Tại Thanh Studio, chúng mình chọn cách chụp chậm rãi, lắng nghe câu chuyện riêng của từng cặp đôi để mỗi bộ ảnh mang đúng câu chuyện của đôi bạn — tự nhiên, ấm áp và đong đầy tình cảm qua năm tháng.",
              )}
            </p>
            <p
              className="mt-5 text-[16px] leading-[1.85] text-ink/85 md:text-[17px]"
            >
              {nb(
                "Từ buổi chụp pre-wedding giữa cố đô Huế hay vịnh Lăng Cô, lớp trang điểm, bộ váy cưới cho tới khoảnh khắc trong ngày trọng đại, Thanh Studio đồng hành trọn vẹn cùng hai bạn.",
              )}
            </p>

            <div
              className="relative mt-10 ml-auto aspect-[3/4] w-[62%] overflow-hidden sm:w-[48%] lg:w-[58%]"
            >
              <Image
                src={albumPhotos["studio-trang-tinh-khoi"][1]}
                alt="Chân dung cận mặt cô dâu chú rể với lớp trang điểm trong trẻo"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 24vw, 50vw"
                className="reveal-zoom object-cover object-top"
              />
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}
