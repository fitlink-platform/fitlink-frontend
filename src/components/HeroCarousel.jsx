// src/components/HeroCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    title: "Shape Your Body,\nShape Your Destiny.",
    desc:
      "Transform your health and fitness with expert coaching, structured programs, and a schedule that fits your life.",
    cta: "Explore Our Programs",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop", // ảnh PT 1
    badge: "4.8★ Rated Coaches",
  },
  {
    title: "Train Smarter,\nNot Just Harder.",
    desc:
      "Personalized plans, weekly schedules, and nutrition notes for consistent progress—built together with your PT.",
    cta: "Find Your Coach",
    image:
      "https://images.unsplash.com/photo-1571907480495-3b4bff7b5b4a?q=80&w=1400&auto=format&fit=crop", // ảnh PT 2
    badge: "Nutrition + Workout",
  },
];

export default function HeroCarousel() {
  return (
    <Swiper
      autoplay={{ delay: 7000, disableOnInteraction: false }}
      loop
      modules={[Autoplay]}
      className="w-full h-[680px]"
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i}>
          <section className="relative h-[680px] overflow-hidden">
            {/* background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-orange-50" />
            {/* soft shapes / depth */}
            <div className="absolute -right-24 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-orange-200/60 to-amber-100 blur-2xl" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[58%] h-[120%] bg-gradient-to-l from-orange-100 via-orange-50 to-transparent rounded-l-[48px]" />

            {/* content */}
            <div className="relative z-10 mx-auto h-full max-w-[1200px] px-6 md:px-10 lg:px-14 flex items-center gap-8">
              {/* left text */}
              <div className="flex-1 max-w-2xl">
                {/* small badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold mb-4">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {s.badge}
                </div>

                <h1 className="whitespace-pre-line text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                  {s.title}
                </h1>

                <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl">
                  {s.desc}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <button className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md transition">
                    {s.cta}
                  </button>
                  <button className="px-6 py-3 rounded-full font-semibold text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition">
                    View Pricing
                  </button>
                </div>

                {/* quick tips bar */}
                <div className="mt-8 hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                  {["Get Adequate Sleep", "Include Rest Days", "Focus on Form", "Stay Consistent"].map(
                    (tip) => (
                      <div key={tip} className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {tip}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* right image */}
              <div className="hidden md:flex flex-1 justify-end pl-8">
                <div className="relative">
                  <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100" />
                  <img
                    src={s.image}
                    alt="Personal Trainer"
                    className="relative z-10 max-h-[520px] rounded-3xl object-cover shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
                  />
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
