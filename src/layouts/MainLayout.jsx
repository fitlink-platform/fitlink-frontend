
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header cố định */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>

      {/* 👇 Đẩy nội dung xuống để tránh bị che */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      {/* Footer luôn ở dưới cùng */}
      <Footer />
    </div>
  );
}

