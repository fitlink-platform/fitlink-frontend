// src/components/home/FeaturesSection.jsx
export default function FeaturesSection() {
  const features = [
    {
      title: "50+ Huấn luyện viên chứng nhận",
      desc: "PT có bằng cấp & được kiểm duyệt kỹ lưỡng.",
    },
    {
      title: "Lộ trình cá nhân hóa",
      desc: "Thiết kế theo mục tiêu & lịch sinh hoạt của bạn.",
    },
    {
      title: "Theo dõi tiến trình",
      desc: "Xem báo cáo hằng tuần & chỉ số cải thiện.",
    },
    {
      title: "Tập online hoặc trực tiếp",
      desc: "Linh hoạt theo nhu cầu & lịch làm việc.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50/20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Vì sao chọn FitLink?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
