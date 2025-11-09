import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  getPTRequestDetail,
  reviewPTRequest,
} from "~/services/adminPTRequestService";
import {
  Loader2,
  User,
  FileText,
  Camera,
  CarFront,
  Clock,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const PTRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getPTRequestDetail(id);
        setRequest(res.data);
      } catch (err) {
        toast.error("Không thể tải chi tiết yêu cầu");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleReview = async (action) => {
    setProcessing(true);
    const toastId = toast.loading("Đang xử lý...");
    try {
      await reviewPTRequest(id, action, reason);
      toast.dismiss(toastId);
      toast.success(
        action === "approve"
          ? "✅ Hồ sơ PT đã được duyệt thành công!"
          : "❌ Hồ sơ PT đã bị từ chối!"
      );
      navigate("/admin/pt-requests");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Lỗi khi xử lý yêu cầu!");
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Đang tải chi tiết yêu cầu...
      </div>
    );

  if (!request)
    return <p className="text-center text-gray-500">Không tìm thấy yêu cầu.</p>;

  const { user, submittedProfile, status, rejectReason, logs } = request;

  const statusColor =
    status === "approved"
      ? "bg-green-100 text-green-700 border-green-300"
      : status === "rejected"
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-yellow-100 text-yellow-700 border-yellow-300";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />

      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/pt-requests")}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm transition"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-sky-600" /> Chi tiết yêu cầu PT
          </h1>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColor}`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* --- Thông tin PT --- */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
          <User className="text-gray-600" size={18} /> Thông tin PT
        </h2>

        {user?.avatar && (
          <div className="flex items-center mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border border-gray-300 object-cover shadow-sm mr-4"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80x80?text=PT";
              }}
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-700">
          <p>
            <strong>Điện thoại:</strong> {user?.phone || "—"}
          </p>
          <p>
            <strong>Giới tính:</strong> {user?.gender || "—"}
          </p>
          <p>
            <strong>Ngày sinh:</strong>{" "}
            {user?.dob ? new Date(user.dob).toLocaleDateString("vi-VN") : "—"}
          </p>
        </div>
      </div>

      {/* --- Hồ sơ PT --- */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
          <ShieldCheck className="text-gray-600" size={18} /> Hồ sơ PT
        </h2>
        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <strong>Tiểu sử:</strong> {submittedProfile?.bio}
          </p>

          <div className="mt-3">
            <strong>📍 Khu vực làm việc:</strong>
            <div className="ml-2 text-gray-700">
              <p>
                <strong>Tên phòng gym:</strong>{" "}
                {submittedProfile?.primaryGym?.name || "—"}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{" "}
                {submittedProfile?.primaryGym?.address || "—"}
              </p>
              {submittedProfile?.primaryGym?.location?.coordinates?.length ===
                2 && (
                <p>
                  <strong>Tọa độ:</strong>{" "}
                  {submittedProfile.primaryGym.location.coordinates.join(", ")}
                </p>
              )}
            </div>
          </div>

          <p>
            <strong>Kinh nghiệm:</strong> {submittedProfile?.yearsExperience}{" "}
            năm
          </p>
          <p>
            <strong>Chuyên môn:</strong>{" "}
            {submittedProfile?.specialties?.join(", ")}
          </p>
        </div>
      </div>

      {/* --- Ảnh & Video --- */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
          <Camera className="text-gray-600" size={18} /> Ảnh & Video
        </h2>

        {/* Ảnh đại diện hồ sơ */}
        {submittedProfile?.coverImage ? (
          <img
            src={
              submittedProfile.coverImage.includes("google.com")
                ? "https://via.placeholder.com/400x250?text=Ảnh+không+hợp+lệ"
                : submittedProfile.coverImage
            }
            alt="Ảnh hồ sơ"
            className="rounded-lg mb-3 max-w-sm border border-gray-200 object-cover shadow-sm"
          />
        ) : (
          <div className="w-64 h-40 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 rounded-lg mb-3">
            Không có ảnh bìa
          </div>
        )}

        {/* Gallery ảnh phòng gym */}
        {submittedProfile?.primaryGym?.photos?.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">
              📸 Hình ảnh phòng gym
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {submittedProfile.primaryGym.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Gym Photo ${i + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:scale-[1.02] transition-transform shadow-sm"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x100?text=No+Image";
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Không có ảnh phòng gym nào.
          </p>
        )}

        {/* Video giới thiệu */}
        {submittedProfile?.videoIntroUrl && (
          <p className="mt-4">
            🎥{" "}
            <a
              href={submittedProfile.videoIntroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Xem video giới thiệu
            </a>
          </p>
        )}
      </div>

      {/* --- Chính sách di chuyển --- */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
          <CarFront className="text-gray-600" size={18} /> Chính sách di chuyển
        </h2>
        <div className="grid md:grid-cols-2 gap-x-10 text-sm text-gray-700">
          <p>
            <strong>Kích hoạt:</strong>{" "}
            {submittedProfile?.travelPolicy?.enabled ? "✅ Có" : "❌ Không"}
          </p>
          <p>
            <strong>Bán kính miễn phí:</strong>{" "}
            {submittedProfile?.travelPolicy?.freeRadiusKm} km
          </p>
          <p>
            <strong>Tối đa di chuyển:</strong>{" "}
            {submittedProfile?.travelPolicy?.maxTravelKm} km
          </p>
          <p>
            <strong>Phí/km:</strong>{" "}
            {submittedProfile?.travelPolicy?.feePerKm?.toLocaleString()}đ
          </p>
        </div>
      </div>

      {/* --- Lý do từ chối --- */}
      {status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h2 className="text-red-700 font-semibold mb-1">❌ Lý do từ chối</h2>
          <p className="text-sm text-gray-700">
            {rejectReason || "Không rõ lý do"}
          </p>
        </div>
      )}

      {/* --- Lịch sử thao tác --- */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
          <Clock className="text-gray-600" size={18} /> Lịch sử thao tác
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-2 px-3">Hành động</th>
                <th className="py-2 px-3">Thực hiện bởi</th>
                <th className="py-2 px-3">Ghi chú</th>
                <th className="py-2 px-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((log, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{log.action}</td>
                  <td className="py-2 px-3">{log.by}</td>
                  <td className="py-2 px-3">{log.note || "—"}</td>
                  <td className="py-2 px-3 text-gray-500">
                    {new Date(log.at).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Thao tác duyệt hồ sơ --- */}
      {status === "pending" && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-10">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-gray-700">
              <ShieldCheck className="text-gray-600" size={18} /> Thao tác duyệt
              hồ sơ
            </h2>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Lý do từ chối (nếu có):
              </label>
              <textarea
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập lý do nếu bạn muốn từ chối..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>

              <div className="flex gap-3 pt-2">
                <button
                  disabled={processing}
                  onClick={() => setConfirmAction("approve")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 transition"
                >
                  <ShieldCheck size={16} /> Duyệt hồ sơ
                </button>

                <button
                  disabled={processing}
                  onClick={() => setConfirmAction("reject")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 transition"
                >
                  ❌ Từ chối hồ sơ
                </button>
              </div>
            </div>
          </div>

          {/* Modal xác nhận */}
          {confirmAction && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <ShieldCheck
                    className={
                      confirmAction === "approve"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                    size={20}
                  />
                  {confirmAction === "approve"
                    ? "Xác nhận duyệt hồ sơ"
                    : "Xác nhận từ chối hồ sơ"}
                </h3>

                <p className="text-gray-600 mb-4">
                  {confirmAction === "approve"
                    ? "Bạn có chắc muốn duyệt hồ sơ này? Sau khi duyệt, PT sẽ được kích hoạt và hiển thị trên hệ thống."
                    : "Bạn có chắc muốn từ chối hồ sơ này? Hãy đảm bảo đã nhập lý do phù hợp trước khi xác nhận."}
                </p>

                {confirmAction === "reject" && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Lý do từ chối:
                    </label>
                    <textarea
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Nhập lý do từ chối..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>
                  <button
                    disabled={processing}
                    onClick={() => handleReview(confirmAction)}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                      confirmAction === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {processing ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PTRequestDetail;
