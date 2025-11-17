// src/components/chat/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { useSocket } from "~/contexts/SocketContext";
import { getMessagesByRoom } from "~/services/messageService";

const ChatWindow = ({ self, peer, role }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const prevLength = useRef(0);

  // auto scroll
  useEffect(() => {
    if (messages.length > prevLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLength.current = messages.length;
  }, [messages]);

  // join room + listeners
  useEffect(() => {
    if (!socket || !self?._id || !peer?._id) return;
    const roomId = [self._id, peer._id].sort().join("-");

    socket.emit("joinRoom", roomId);

    // dùng service load lịch sử
    getMessagesByRoom(roomId)
      .then((res) => setMessages(res.data.data || []))
      .catch((err) => console.error("❌ Load messages failed:", err));

    const handleReceive = (msg) => {
      if (msg.room === roomId) setMessages((prev) => [...prev, msg]);
    };

    const handleTyping = ({ roomId: r }) => {
      if (r === roomId) {
        setIsTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("userTyping", handleTyping);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("receiveMessage", handleReceive);
      socket.off("userTyping", handleTyping);
    };
  }, [socket, self?._id, peer?._id]);

  const handleTypingInput = (e) => {
    setText(e.target.value);
    if (!socket || !self?._id || !peer?._id) return;
    const roomId = [self._id, peer._id].sort().join("-");
    socket.emit("typing", roomId);
  };

  const sendMessage = () => {
    if (!text.trim() || !socket) return;
    const roomId = [self._id, peer._id].sort().join("-");
    const payload = { room: roomId, sender: self._id, text, senderRole: role };
    socket.emit("sendMessage", payload);
    setText("");
  };

  if (!peer)
    return (
      <div className="flex items-center justify-center flex-1 text-gray-500 bg-white">
        👈 Chọn {role === "pt" ? "học viên" : "huấn luyện viên"} để bắt đầu trò chuyện
      </div>
    );

  return (
    <div className="flex flex-col bg-white text-gray-800 w-full h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <img
          src={peer.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h2 className="font-semibold text-gray-900">{peer.name}</h2>
          {isTyping && (
            <p className="text-xs text-blue-500 animate-pulse">Đang nhập...</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => {
          const senderId = msg.sender?._id || msg.sender || msg.senderId;
          const mine = String(senderId) === String(self._id);
          return (
            <div
              key={idx}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                  mine
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 flex gap-2 bg-white flex-shrink-0">
        <input
          value={text}
          onChange={handleTypingInput}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 transition text-white rounded-full px-4 py-2 flex items-center justify-center"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
