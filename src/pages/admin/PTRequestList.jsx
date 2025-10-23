import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPTRequests } from "~/services/adminPTRequestService";
import { Loader2, ArrowLeft } from "lucide-react";

const PTRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAllPTRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách yêu cầu PT");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Đang tải danh sách yêu cầu...
      </div>
    );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm transition"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <h1 className="text-2xl font-bold">
            📋 Danh sách yêu cầu duyệt hồ sơ PT
          </h1>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto bg-white shadow border border-gray-200 rounded-xl">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">PT Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Ngày gửi</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr
                  key={req._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {req.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {req.user?.email || "—"}
                  </td>
                  <td
                    className={`px-4 py-3 text-center font-semibold ${
                      req.status === "approved"
                        ? "text-green-600"
                        : req.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {req.status}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {new Date(req.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/admin/pt-requests/${req._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Không có yêu cầu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PTRequestList;
