// src/components/home/ProgramSection.jsx
import { motion } from "framer-motion";
import SectionWrapper from "~/components/SectionWrapper";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45 },
  }),
};

export default function ProgramSection() {
  const programs = [
    { name: "Giảm mỡ toàn thân", img: "/images/programs/fatloss.jpg" },
    { name: "Tăng cơ – Sức mạnh", img: "/images/programs/muscle.jpg" },
    { name: "Tập luyện tại nhà", img: "/images/programs/home.jpg" },
  ];

  return (
    <SectionWrapper className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Chương trình tập nổi bật
          </h2>
          <p className="text-gray-600 max-w-md text-sm md:text-base">
            Chọn mục tiêu của bạn và FitLink sẽ gợi ý PT & lộ trình phù hợp nhất
            chỉ trong vài giây.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition cursor-pointer bg-neutral-900/90 relative"
              whileHover={{ y: -6 }}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-end">
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white">
                    {p.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    Lộ trình 6–12 tuần, theo dõi qua app FitLink.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
