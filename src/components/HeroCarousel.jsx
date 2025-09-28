// src/components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function HeroCarousel() {
  return (
    <Swiper
      autoplay={{ delay: 8000 }}
      loop
      modules={[Autoplay]}
      className="w-full h-[680px]"
    >
      <SwiperSlide>
        <section className="relative h-[680px] overflow-hidden">
          {/* Gradient nền từ sáng → tối */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c2d24] via-[#11221b] to-[#0a1712]" />
          
          {/* Lớp phủ nhẹ để tạo chiều sâu */}
          <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_50%,rgba(255,255,255,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.2))]" />

          {/* Content */}
          <div className="relative z-10 mx-auto h-full max-w-[1200px] px-6 md:px-10 lg:px-14 flex items-center">
            {/* Left text */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-white font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-[56px]">
                A bouquet for
                <br />
                every occasion.
              </h1>

              <p className="mt-6 text-sm sm:text-base text-white/70 leading-relaxed">
                Want to send your congratulations, condolences, or your love and
                support? No matter the message you want to share, we have a
                bouquet for you.
              </p>

              <div className="mt-8">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-2.5 text-white hover:bg-white/10 transition"
                >
                  SHOP ALL FLOWERS
                </button>
              </div>
            </div>

            {/* Right image
            <div className="flex-1 hidden md:flex justify-end pl-8">
              <img
                src={heroImage}
                alt="Bouquet"
                className="max-h-[520px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]"
              />
            </div> */}
          </div>
        </section>
      </SwiperSlide>
    </Swiper>
  );
}
