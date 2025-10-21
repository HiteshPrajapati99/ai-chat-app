import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet, useLocation } from "react-router";
import { AUTH_COOKIE } from "@/config/constant";
import ChatSidebar from "../components/chat/ChatSidebar";

export default function Protected() {
  const [cookies] = useCookies([AUTH_COOKIE]);
  const { user, getUserData } = useUser();
  const token = cookies[AUTH_COOKIE];
  const location = useLocation();

  useEffect(() => {
    if (user === null && token) {
      getUserData();
    }
  }, [token, user]);

  if (!token && !["/register", "/login"].includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="h-screen flex flex-col bg-gray-50 dark:bg-background">
     <div className="flex flex-1 overflow-hidden">
          {/* Chat Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-950 flex-shrink-0 overflow-y-auto">
            <ChatSidebar />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
    </main>
  );
}
