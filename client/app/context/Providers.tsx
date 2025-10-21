import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import SocketProvider from "./socket-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
        </SocketProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}
