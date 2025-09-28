// src/pages/OrderSuccessPage.jsx
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn sẽ
          được xử lý và giao trong thời gian sớm nhất.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-xl shadow hover:bg-pink-700 transition"
        >
          Quay lại mua sắm
        </Link>
      </div>
    </div>
  );
}
