// src/api/socket.js
import { io } from "socket.io-client";

const backendURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const socket = io(backendURL, {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
