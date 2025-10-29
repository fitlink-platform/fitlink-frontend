import { io } from "socket.io-client";
import { env } from "../config/env"; // nếu có file .env config riêng

// Kết nối socket đến backend
const socket = io(env.VITE_API_URL || "http://localhost:8000", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
