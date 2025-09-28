import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "~/layouts/MainLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function OrderDetail() {
    const { id } = useParams();
    const [showMap, setShowMap] = useState(false);

    // Demo data
    const order = {
        id,
        createdAt: "28/09/2025 - 12:05",
        status: "Đang vận chuyển",
        timeline: [
            { step: "Tạo đơn", completed: true },
            { step: "Xác nhận", completed: true },
            { step: "Vận chuyển", completed: true },
            { step: "Giao hàng", completed: false },
        ],
        deliveryInfo: {
            expected: "30/09/2025",
            note: "Đang vận chuyển - Nhận tại Bưu cục Thăng Bình - Quảng Nam",
        },
    };

    // Vị trí shipper demo (Hà Nội)
    const shipperLocation = { lat: 21.0285, lng: 105.8542 };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Chi tiết đơn</h2>
                    <Link to="/orders" className="text-green-600 underline">
                        ← Quay lại
                    </Link>
                </div>

                {/* Order Info */}
                <div className="bg-white shadow rounded-lg p-5 mb-6">
                    <p>
                        <span className="font-semibold">Mã đơn:</span> #{order.id}
                    </p>
                    <p>
                        <span className="font-semibold">Ngày tạo:</span> {order.createdAt}
                    </p>
                </div>

                {/* Timeline */}
                <div className="bg-white shadow rounded-lg p-5 mb-6">
                    <h3 className="font-semibold mb-4">Trạng thái đơn hàng</h3>
                    <div className="flex items-center justify-between relative">
                        {order.timeline.map((s, i) => (
                            <div key={i} className="flex flex-col items-center w-full">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${s.completed
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "border-gray-300 text-gray-400"
                                        }`}
                                >
                                    {s.completed ? "✔" : i + 1}
                                </div>
                                <p className="text-sm mt-2">{s.step}</p>
                            </div>
                        ))}
                        {/* line progress */}
                        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                        <div
                            className="absolute top-4 left-0 h-0.5 bg-green-500 -z-10"
                            style={{
                                width: `${(order.timeline.filter((s) => s.completed).length - 1) *
                                    (100 / (order.timeline.length - 1))
                                    }%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white shadow rounded-lg p-5">
                    <h3 className="font-semibold mb-3">Thông tin vận chuyển</h3>
                    <p>
                        <span className="font-semibold">Dự kiến giao:</span>{" "}
                        {order.deliveryInfo.expected}
                    </p>
                    <p className="text-orange-600 mt-2">{order.deliveryInfo.note}</p>

                    {/* Nếu trạng thái đang vận chuyển thì hiển thị nút */}
                    {order.status === "Đang vận chuyển" && (
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            {showMap ? "Ẩn bản đồ" : "Xem vị trí Shipper"}
                        </button>
                    )}
                </div>

                {/* Map demo */}
                {showMap && (
                    <div className="mt-6 h-[400px]">
                        <MapContainer
                            center={[shipperLocation.lat, shipperLocation.lng]}
                            zoom={15}
                            scrollWheelZoom={false}
                            className="h-full w-full rounded-lg"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="© OpenStreetMap contributors"
                            />
                            <Marker position={[shipperLocation.lat, shipperLocation.lng]}>
                                <Popup>Shipper đang ở đây 🚴</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
