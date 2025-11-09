// src/contexts/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../api/socket";
import { useAuth } from "./AuthProvider";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // đăng ký user room sau khi connect / khi user thay đổi
  useEffect(() => {
    if (!user?._id) return;

    const register = () => socket.emit("registerUser", user._id);
    if (socket.connected) register();
    socket.on("connect", register);
    return () => socket.off("connect", register);
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
