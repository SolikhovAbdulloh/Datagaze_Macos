import { CircularProgress } from "@mui/material";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "~/utils";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const token = getToken();
    const newSocket = io("https://d.dev-baxa.me/computer", {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` }
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.connected), setReady(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket || !ready) return <div>Socket connecting...</div>;

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

// Custom hook
export function useComputersSocket() {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("SocketContext not found");
  return socket;
}
