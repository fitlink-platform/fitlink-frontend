import { useState } from "react";
import { Link } from "react-router-dom";
export default function OrderPage() {
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    city: "TP.HCM - Nội thành",
    district: "Quận 1",
    deliveryDate: "",
    deliveryTime: "Từ 8:00 - 20:00",
    message: "",
    note: "",
    hideSender: false,
    vat: false,
    staffCode: "",
    payment: "e-wallet",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Form */}
      <div className="md:col-span-2 space-y-6">
        {/* Sender Info */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Thông tin người gửi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="senderName"
              value={form.senderName}
              onChange={handleChange}
              placeholder="Họ tên"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="senderPhone"
              value={form.senderPhone}
              onChange={handleChange}
              placeholder="Điện thoại"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="email"
              name="senderEmail"
              value={form.senderEmail}
              onChange={handleChange}
              placeholder="Email"
              className="border rounded px-3 py-2 w-full md:col-span-2"
            />
          </div>
        </div>

        {/* Receiver Info */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Thông tin người nhận</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="receiverName"
              value={form.receiverName}
              onChange={handleChange}
              placeholder="Họ tên"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleChange}
              placeholder="Điện thoại"
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="receiverAddress"
              value={form.receiverAddress}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className="border rounded px-3 py-2 w-full md:col-span-2"
            />
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option>Đà Nẵng</option>
              <option>TP.HCM</option>
            </select>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option>Phường Thanh Khê</option>
              <option>Phường Sơn Trà</option>
            </select>
            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
            <select
              name="deliveryTime"
              value={form.deliveryTime}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option>Từ 8:00 - 20:00</option>
              <option>Từ 6:00 - 12:00</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Lời nhắn [Cho người nhận]"
            className="border rounded px-3 py-2 w-full mb-3"
          />
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Yêu cầu, lưu ý [cho shop]"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hideSender"
              checked={form.hideSender}
              onChange={handleChange}
            />{" "}
            Giấu thông tin người gửi
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="vat"
              checked={form.vat}
              onChange={handleChange}
            />{" "}
            Yêu cầu hoá đơn VAT
          </label>
        </div>

        <input
          type="text"
          name="staffCode"
          value={form.staffCode}
          onChange={handleChange}
          placeholder="Mã nhân viên"
          className="border rounded px-3 py-2 w-full"
        />

        <button className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600">
          Xác nhận và tiếp tục
        </button>
      </div>

      {/* Right Order Summary */}
      <div className="border rounded-md p-4 shadow-md h-fit">
        <h2 className="font-semibold text-lg mb-4">Chi tiết đơn hàng</h2>

        {/* Product */}
        <div className="flex items-center gap-4 mb-4 border-b pb-3">
          <img
            src="https://flowercorner.b-cdn.net/image/cache/catalog/products/Winter_2024/say-anh-mat.jpg.webp"
            alt="product"
            className="w-20 h-20 rounded"
          />
          <div>
            <p className="font-medium">2x Caffeine</p>
            <p className="text-gray-500 text-sm">190.000 VND</p>
            <p className="text-xs text-gray-400">Chưa gồm VAT: </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-1 text-sm text-gray-700">
          <p className="flex justify-between">
            <span>Tổng phụ</span>
            <span>190.000 VND</span>
          </p>
          <p className="flex justify-between text-green-600">
            <span>KH thân thiết LV1</span>
            <span> VND</span>
          </p>
          <p className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>0 VND</span>
          </p>
          <p className="flex justify-between">
            <span>VAT 8%</span>
            <span> VND</span>
          </p>
          <p className="flex justify-between font-semibold border-t pt-2">
            <span>Tổng cộng</span>
            <span>190.000 VND</span>
          </p>
        </div>

        {/* Discount */}
        <div className="flex mt-4 gap-2">
          <input
            type="text"
            placeholder="Mã giảm giá"
            className="border rounded px-3 py-2 w-full"
          />
          <button className="bg-pink-500 text-white px-4 rounded-md hover:bg-pink-600">
            Áp dụng
          </button>
        </div>

        {/* Payment */}
        <div className="mt-4 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="bank"
              checked={form.payment === "bank"}
              onChange={handleChange}
            />
            Chuyển khoản ngân hàng
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={form.payment === "card"}
              onChange={handleChange}
            />
            Visa, Master, JCB, UnionPay, Amex
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="e-wallet"
              checked={form.payment === "e-wallet"}
              onChange={handleChange}
            />
            Ví điện tử (Momo, ZaloPay, VNPay)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={form.payment === "cod"}
              onChange={handleChange}
            />
            Thanh toán khi giao hàng
          </label>
        </div>

        {/* Agree */}
        <label className="flex items-center gap-2 mt-3 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />{" "}
          Tôi đã đọc và đồng ý với{" "}
          <span className="text-pink-500 cursor-pointer">
            Điều khoản & Điều kiện
          </span>
        </label>

        <Link to="/orderSuccess">
          <button
            className={`mt-4 w-full py-2 rounded-md ${
              form.agree
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!form.agree}
          >
            Xác nhận đơn hàng
          </button>
        </Link>
      </div>
    </div>
  );
}
