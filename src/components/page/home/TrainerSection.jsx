// src/components/home/TrainerSection.jsx
import { motion } from "framer-motion";
import SectionWrapper from "~/components/SectionWrapper";

const trainerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45 },
  }),
};

export default function TrainerSection() {
  const trainers = [
    {
      name: "PT Hoàng Minh",
      img: "/images/trainers/tr1.jpg",
      exp: "5 năm kinh nghiệm",
      tag: "Strength & Hypertrophy",
    },
    {
      name: "PT Thu Uyên",
      img: "/images/trainers/tr2.jpg",
      exp: "Chuyên gia giảm mỡ – siết cân",
      tag: "Fat Loss & Conditioning",
    },
    {
      name: "PT Quốc Khánh",
      img: "/images/trainers/tr3.jpg",
      exp: "Chuyên sức mạnh – tăng cơ",
      tag: "Power & Performance",
    },
  ];

  return (
    <SectionWrapper className="py-20 bg-orange-50/40">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          Huấn luyện viên tiêu biểu
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Được kiểm duyệt bởi FitLink, chấm điểm bởi học viên thực tế.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((t, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={trainerVariants}
              className="rounded-2xl bg-white shadow-sm hover:shadow-2xl transition p-4 border border-orange-100/70 hover:-translate-y-2"
            >
              <div className="relative">
                <motion.img
                  src={t.img}
                  alt={t.name}
                  className="h-56 w-full object-cover rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
                  Top Rated
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-xl">{t.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{t.exp}</p>
                <p className="text-xs mt-2 inline-flex px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                  {t.tag}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
