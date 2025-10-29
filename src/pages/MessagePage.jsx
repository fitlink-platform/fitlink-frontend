import React, { useEffect, useState } from "react";
import MainLayout from "~/layouts/MainLayout";
import ChatSidebar from "~/components/chat/ChatSidebar";
import ChatWindow from "~/components/chat/ChatWindow";
import axios from "axios";
import { useAuth } from "~/contexts/AuthProvider";

export default function MessagePage() {
  const { user } = useAuth();
  const [pts, setPts] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`http://localhost:3000/api/student/me/pts`, { withCredentials: true })
      .then((res) => setPts(res.data.data || []))
      .catch((err) => console.error("❌ Lỗi khi tải PT:", err));
  }, [user?._id]);

  return (
    <MainLayout>
      <div className="pt-[100px] px-6 pb-10 bg-white h-screen overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">💬 Tin nhắn của bạn</h1>
          <p className="text-gray-500 text-sm mt-2">
            Trò chuyện trực tiếp với huấn luyện viên cá nhân của bạn
          </p>
        </div>

        {/* Chat box */}
        <div className="flex h-[calc(100vh-220px)] rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-white">
          {/* Sidebar */}
          <div className="w-[300px] border-r border-gray-100 bg-gray-50 overflow-y-auto">
            <ChatSidebar
              list={pts}
              role="student"
              activeId={active?._id}
              onSelect={setActive}
            />
          </div>

          {/* Chat window */}
          <div className="flex-1 overflow-hidden">
            <ChatWindow self={user} peer={active} role="student" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
