import { useSocket } from "@/hooks/useSocket";

const SocketStatus = () => {
  const { isConnected, connectionError, shouldConnect } = useSocket();

  if (!shouldConnect) {
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        <span className="text-sm">Socket disabled - Server not configured</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Socket connected</span>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm">Connection error: {connectionError}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-yellow-600">
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
      <span className="text-sm">Connecting...</span>
    </div>
  );
};

export default SocketStatus;

