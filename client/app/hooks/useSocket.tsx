import { useContext } from "react";
import { socketContext } from "@/context/socket-provider";

const useSocket = () => {
  const context = useContext(socketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  if (context.connectionError || !context.isConnected) {
    console.error(context.connectionError);
  }

  return context.socket;
};

export default useSocket;
