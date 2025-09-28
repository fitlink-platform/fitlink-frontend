import MainLayout from "~/layouts/MainLayout";
import HeroCarousel from "~/components/HeroCarousel";
import { Link } from "react-router-dom";
export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: "Hoa Khai Trương",
      price: "190.000 VNĐ",
      image:
        "https://flowercorner.b-cdn.net/image/cache/catalog/products/Winter_2024/say-anh-mat.jpg.webp",
    },
    {
      id: 2,
      name: "Hoa Tặng Người Yêu ",
      price: "500.000 VNĐ",
      image:
        "https://flowercorner.b-cdn.net/image/cache/catalog/products/Autumn_2024/hoi-ngo.jpg.webp",
    },
    {
      id: 3,
      name: "Hoa Chúc Mừng",
      price: "250.000 VNĐ",
      image:
        "https://flowercorner.b-cdn.net/image/cache/catalog/products/August%202023/bo-hoa-hong-pastel-khoe-sac.jpg.webp",
    },
    {
      id: 4,
      name: "Hoa Tặng 8/3",
      price: "300.000 VNĐ",
      image:
        "https://flowercorner.b-cdn.net/image/cache/catalog/products/Winter_2024/nu-hoa-xuan.jpg.webp",
    },
  ];

  return (
    <MainLayout>
      <HeroCarousel />

      {/* Shop Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.price}</p>
                <Link to={`/products/${product.id}`}>
                  <button className="mt-4 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
                    Đặt Hàng
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
