export default function Footer() {
  return (
    <footer className="bg-[#020617] text-gray-400 py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Logo + intro */}
        <div>
          <h3 className="text-2xl font-extrabold tracking-wide">
            <span className="text-orange-500">Fit</span>
            <span className="text-white">Link</span>
            <span className="text-orange-500">.</span>
          </h3>
          <p className="mt-3 leading-relaxed text-sm">
            Nền tảng kết nối bạn với huấn luyện viên cá nhân, lộ trình tập luyện
            và dinh dưỡng khoa học để đạt được body mơ ước.
          </p>
          <div className="mt-4 flex gap-4 text-gray-300">
            {/* Facebook */}
            <a href="#" className="hover:text-orange-500">
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            {/* Instagram */}
            <a href="#" className="hover:text-orange-500">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            {/* YouTube */}
            <a href="#" className="hover:text-orange-500">
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
        </div>

        {/* Column 2: Programs */}
        <div>
          <h4 className="text-white font-semibold mb-4">Chương trình</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/programs" className="hover:text-orange-500">Giảm mỡ toàn thân</a></li>
            <li><a href="/programs" className="hover:text-orange-500">Tăng cơ &amp; sức mạnh</a></li>
            <li><a href="/programs" className="hover:text-orange-500">Gói Online Coaching</a></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/contact" className="hover:text-orange-500">Liên hệ &amp; đặt lịch</a></li>
            <li><a href="/pricing" className="hover:text-orange-500">Bảng giá &amp; gói tập</a></li>
            <li><a href="#" className="hover:text-orange-500">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Thông tin liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>📞</span> 1900 888 999
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span> support@fitlink.vn
            </li>
            <li className="flex items-center gap-2">
              <span>📍</span>  Việt Nam
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs md:text-sm">
        © {new Date().getFullYear()} FitLink. All rights reserved.
      </div>
    </footer>
  );
}
