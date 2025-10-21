import { Storage } from "@/lib/storage";
import { createContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SOCKET_URL, CONSTANT } from "@/config";
import { useUser } from "@/hooks/useUser";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  shouldConnect: boolean;
}

export const socketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
  shouldConnect: true,
});

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [shouldConnect, setShouldConnect] = useState(true);

  const { user } = useUser();

  const socket = useMemo(() => {
    if (!shouldConnect || !user?.id) return null;

    const socketInstance = io(SOCKET_URL, {
      auth: {
        user_id: user?.id,
      },
      reconnection: false, // handle reconnection manually
      timeout: 2000, //a single try after 2s
      autoConnect: true,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected successfully");
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setConnectionError(error.message);
      setIsConnected(false);

      // Stop polling if it's a route not found error
      if (
        error.message.includes("No route matches") ||
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        console.log(
          "Stopping socket connection - server doesn't have Socket.IO routes"
        );
        setShouldConnect(false);
        socketInstance.disconnect();
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);

      // Don't reconnect if we manually stopped due to route errors
      if (
        reason === "io server disconnect" &&
        connectionError?.includes("No route matches")
      ) {
        setShouldConnect(false);
      }
    });

    return socketInstance;
  }, [user?.id, shouldConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Retry connection after a delay if it's not a route error
  useEffect(() => {
    if (
      connectionError &&
      !connectionError.includes("No route matches") &&
      !connectionError.includes("404")
    ) {
      const retryTimer = setTimeout(() => {
        console.log("Retrying socket connection...");
        setShouldConnect(true);
      }, 10000); // Retry after 10 seconds

      return () => clearTimeout(retryTimer);
    }
  }, [connectionError]);

  const contextValue = {
    socket,
    isConnected,
    connectionError,
    shouldConnect,
  };

  return (
    <socketContext.Provider value={contextValue}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
