import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "~/layouts/MainLayout";

export default function OrderHistoryPage() {
    const orders = [
        { id: "111968462323", date: "28/09/2025", status: "Đang vận chuyển", total: "530.000₫" },
        { id: "111968462324", date: "27/09/2025", status: "Hoàn thành", total: "720.000₫" },
    ];

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>
                <div className="bg-white shadow rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Mã đơn</th>
                                <th className="py-3 px-4 text-left">Ngày đặt</th>
                                <th className="py-3 px-4 text-left">Trạng thái</th>
                                <th className="py-3 px-4 text-left">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">#{o.id}</td>
                                    <td className="py-3 px-4">{o.date}</td>
                                    <td className="py-3 px-4">{o.status}</td>
                                    <td className="py-3 px-4">
                                        <Link
                                            to={`/customer/orders/${o.id}`}
                                            className="text-green-600 underline"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
