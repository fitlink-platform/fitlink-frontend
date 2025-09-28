import { useEffect, useState } from "react";
import axios from "~/api/axiosClient";
import SidebarAdmin from "~/components/SidebarAdmin";
import { useNavigate } from "react-router-dom";

const ManagerUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      alert("Lỗi tải danh sách người dùng");
    }
    setLoading(false);
  };

  const handleBlockToggle = async (userId, isActive) => {
    try {
      await axios.patch(`/admin/users/${userId}/${isActive ? "block" : "unlock"}`);
      fetchUsers();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái người dùng");
    }
  };

  const handleDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <main className="flex-1 p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">Quản lý người dùng</h2>
          <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">Danh sách người dùng</h3>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 border text-center">STT</th>
                    <th className="px-3 py-2 border text-center">Tên</th>
                    <th className="px-3 py-2 border text-center">SĐT</th>
                    <th className="px-3 py-2 border text-center">Email</th>
                    <th className="px-3 py-2 border text-center">Trạng thái</th>
                    <th className="px-3 py-2 border text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-orange-50 transition">
                      <td className="px-3 py-2 border text-center">{idx + 1}</td>
                      <td className="px-3 py-2 border">{user.name}</td>
                      <td className="px-3 py-2 border">{user.phone}</td>
                      <td className="px-3 py-2 border">{user.email}</td>
                      <td className="px-3 py-2 border text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td className="px-3 py-2 border flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium"
                          onClick={() => handleDetail(user._id)}
                        >
                          Chi tiết
                        </button>
                        <button
                          className={`px-3 py-1 rounded text-white text-xs font-medium ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                          onClick={() => handleBlockToggle(user._id, user.isActive)}
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerUser; 