import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "~/api/axiosClient";
import SidebarAdmin from "~/components/SidebarAdmin";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/users`);
      const found = res.data.find(u => u._id === id);
      setUser(found || null);
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleBlockToggle = async () => {
    if (!user) return;
    setBlockLoading(true);
    try {
      await axios.patch(`/admin/users/${user._id}/${user.isActive ? "block" : "unlock"}`);
      fetchUser();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái người dùng");
    }
    setBlockLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  if (loading) return <div className="flex min-h-screen"><SidebarAdmin /><div className="flex-1 flex items-center justify-center">Đang tải...</div></div>;
  if (!user) return <div className="flex min-h-screen"><SidebarAdmin /><div className="flex-1 flex items-center justify-center text-red-500">Không tìm thấy người dùng</div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <main className="flex-1 p-8 flex flex-col items-center">
        <div className="w-full bg-white rounded-lg shadow p-8">
          <button className="mb-4 text-blue-500 hover:underline" onClick={() => navigate(-1)}>&larr; Quay lại</button>
          <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">Chi tiết người dùng</h2>
          <div className="flex flex-col items-center mb-6">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover mb-2 border" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-3xl">👤</div>
            )}
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-gray-500">{user.phone}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
          <div className="space-y-2 mb-6">
            <div><b>Họ tên:</b> {user.name}</div>
            <div><b>SĐT:</b> {user.phone}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Giới tính:</b> {user.gender}</div>
            <div><b>Địa chỉ:</b> {user.address || '-'}</div>
            <div><b>Trạng thái:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.isActive ? "Đang hoạt động" : "Đã bị khóa"}</span></div>
            <div><b>Xác thực:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${user.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.verified ? "Đã xác thực" : "Chưa xác thực"}</span></div>
            <div><b>Quyền:</b> {user.role}</div>
            <div><b>Ngày tạo:</b> {formatDate(user.createdAt)}</div>
            <div><b>Ngày cập nhật:</b> {formatDate(user.updatedAt)}</div>
          </div>
          {user.role !== "admin" && (
            <button
              className={`w-full py-2 rounded text-white font-semibold ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              onClick={handleBlockToggle}
              disabled={blockLoading}
            >
              {blockLoading ? "Đang xử lý..." : user.isActive ? "Block" : "Unblock"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDetail; 