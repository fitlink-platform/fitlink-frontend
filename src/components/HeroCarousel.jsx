import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useState } from "react";
import BMIWidget from "./student/BMIWidget";

const slides = [
  {
    title: "Shape Your Body,\nShape Your Destiny.",
    desc:
      "Transform your health and fitness with expert coaching, structured programs, and a schedule that fits your life.",
    primaryCta: "Explore Our Programs",
    secondaryCta: "View Pricing",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
    badge: "4.8★ Rated Coaches",
    tag: "Trusted by 500+ members",
  },
  {
    title: "Train Smarter,\nNot Just Harder.",
    desc:
      "Personalized plans, weekly schedules, and nutrition notes for consistent progress—built together with your PT.",
    primaryCta: "Find Your Coach",
    secondaryCta: "Talk to a PT",
    image:
      "/poster2.jpg",
    badge: "Nutrition + Workout",
    tag: "Science-based coaching",
  },
];

export default function HeroCarousel() {
  const [showBMI, setShowBMI] = useState(false);

  return (
    <>
      <Swiper
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        effect="fade"
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="w-full h-[620px] md:h-[680px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <section className="relative h-[620px] md:h-[680px] overflow-hidden">
              {/* background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-amber-50" />
              {/* soft shapes */}
              <div className="pointer-events-none absolute -right-24 -top-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-orange-200/60 to-amber-100 blur-2xl" />
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[58%] h-[120%] bg-gradient-to-l from-orange-100 via-orange-50 to-transparent rounded-l-[48px]" />

              {/* main content */}
              <div className="relative z-10 mx-auto h-full max-w-[1200px] px-6 md:px-10 lg:px-14 flex flex-col md:flex-row items-center gap-10 md:gap-8">
                {/* left text */}
                <div className="flex-1 max-w-2xl pt-10 md:pt-0">
                  {/* top tag */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
                      {s.badge}
                    </div>
                    <span className="hidden sm:inline text-xs font-medium text-gray-500">
                      {s.tag}
                    </span>
                  </div>

                  <h1 className="whitespace-pre-line text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                    {s.title}
                  </h1>

                  <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl">
                    {s.desc}
                  </p>

                  {/* CTA buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button className="px-7 py-3 rounded-full text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md transition">
                      {s.primaryCta}
                    </button>

                    <button className="px-7 py-3 rounded-full text-sm sm:text-base font-semibold text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition">
                      {s.secondaryCta}
                    </button>

                    {/* nhỏ nhưng nổi để mở BMI */}
                    <button
                      type="button"
                      onClick={() => setShowBMI(true)}
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
                    >
                      Quick BMI check
                    </button>
                  </div>

                  {/* quick tips bar */}
                  <div className="mt-8 hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                    {[
                      "Get Adequate Sleep",
                      "Include Rest Days",
                      "Focus on Form",
                      "Stay Consistent",
                    ].map((tip) => (
                      <div key={tip} className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {tip}
                      </div>
                    ))}
                  </div>

                  {/* stats row */}
                  <div className="mt-6 grid grid-cols-3 max-w-xs text-xs sm:text-sm text-gray-600">
                    <div>
                      <div className="font-semibold text-gray-900 text-base sm:text-lg">
                        50+
                      </div>
                      <div>Certified PTs</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-base sm:text-lg">
                        1.2k
                      </div>
                      <div>Active members</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-base sm:text-lg">
                        92%
                      </div>
                      <div>See progress in 8 weeks</div>
                    </div>
                  </div>
                </div>

                {/* right image / card */}
                <div className="flex-1 flex justify-center md:justify-end w-full">
                  <div className="relative w-full max-w-[480px]">
                    <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100" />
                    <img
                      src={s.image}
                      alt="Personal Trainer"
                      className="relative z-10 h-[320px] sm:h-[420px] lg:h-[480px] w-full object-cover rounded-3xl shadow-[0_30px_80px_rgba(15,23,42,0.45)]"
                    />

                    {/* small glass card */}
                    <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-lg font-bold">
                        PT
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today&apos;s focus</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Strength & form
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* BMI Popup (nhỏ gọn, không full màn) */}
      {showBMI && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-800">
                Quick BMI Check
              </h3>
              <button
                onClick={() => setShowBMI(false)}
                className="text-gray-400 hover:text-gray-600 text-lg px-2"
              >
                ×
              </button>
            </div>
            <div className="p-4 max-h-[420px] overflow-y-auto">
              <BMIWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
