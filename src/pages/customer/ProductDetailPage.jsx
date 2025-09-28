import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Product Image */}
      <div className="flex justify-center">
        <img
          src="https://flowercorner.b-cdn.net/image/cache/catalog/products/Winter_2024/say-anh-mat.jpg.webp"
          alt="Say Anh Mat"
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Right: Product Info */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">Hoa Khai Trương </h1>
        <p className="text-pink-600 text-xl font-bold mb-3">190,000 VND</p>
        <p className="text-gray-500 mb-2">Giá đã bao gồm 8% VAT</p>

        {/* Promotions */}
        <div className="flex gap-2 mb-4">
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded text-sm font-medium">
            Giảm 50K
          </span>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded text-sm font-medium">
            Giảm 25K
          </span>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded text-sm font-medium">
            Giảm 10%
          </span>
        </div>

        {/* Hotline + Chat */}
        <div className="flex items-center gap-4 mb-4">
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600">
            <FaPhoneAlt /> 1900 633 045
          </button>
          <div className="flex gap-2">
            {/* <FaZalo className="text-blue-500 text-3xl cursor-pointer" />
            <FaZalo className="text-blue-500 text-3xl cursor-pointer" /> */}
          </div>
        </div>

        {/* Shipping */}
        <div className="mb-4">
          <p className="text-gray-600 mb-1">
            Vận chuyển: Miễn phí giao hoa khu vực nội thành Đà Nẵng
          </p>
          <div className="flex gap-3">
            <select className="border rounded-md px-3 py-2">
              <option>TP.HCM</option>
              <option>Đà Nẵng</option>
            </select>
            <select className="border rounded-md px-3 py-2">
              <option>Phường Thanh Khê</option>
              <option>Phường Sơn Trà</option>
            </select>
          </div>
        </div>

        {/* Quantity + Order Button */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="number"
            value={qty}
            min={1}
            onChange={(e) => setQty(e.target.value)}
            className="w-20 border rounded-md px-2 py-2"
          />
          <Link to="/order">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md shadow hover:bg-orange-600">
              ĐẶT HÀNG
            </button>
          </Link>
          <button className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600">
            ĐẶT NHANH
          </button>
        </div>

        {/* Extra info */}
        <div className="flex items-center gap-6 mb-6">
          <p className="flex items-center gap-2 text-gray-600 text-sm">
            🚚 Giao hoa NHANH trong 60 phút
          </p>
          <p className="flex items-center gap-2 text-gray-600 text-sm">
            🎁 Tặng miễn phí thiệp hoặc banner
          </p>
        </div>

        {/* Product description */}
        <div className="border-t pt-4">
          <h2 className="font-semibold mb-2">Mô tả sản phẩm</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm">
            <li>Hoa thạch thảo trắng: 1 bó</li>
            <li>Hoa hồng kem: 1 cành</li>
            <li>Các loại hoa lá phụ trang trí khác: Có đồng tiền</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">Lưu ý: ...</p>
        </div>
      </div>
    </div>
  );
}
