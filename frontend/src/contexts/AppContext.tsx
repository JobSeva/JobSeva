import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

export type UserRole = "seeker" | "company" | "admin" | "ngo";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  notifications: number;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  logout: () => void;
  isAuthLoading: boolean;
}

const AppContext = createContext<AppContextType>({
  role: "seeker",
  setRole: () => { },
  user: null,
  setUser: () => { },
  notifications: 0,
  sidebarCollapsed: false,
  setSidebarCollapsed: () => { },
  logout: () => { },
  isAuthLoading: true,
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [role, setRole] = useState<UserRole>("seeker");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth < 1024,
  );
  const [notifications, setNotifications] = useState(0);

  // Load User Details Hook
  const loadUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      // /auth/me returns the user directly in data.data
      const u = data.data.user || data.data;
      setUser(u);
      setRole(u.role as UserRole);
    } catch (err) {
      console.error("Failed to load user info", err);
      // Clear invalid tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setSidebarCollapsed(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);

    // Check local storage init token
    const token = localStorage.getItem("accessToken");
    if (token) {
      loadUser();
    } else {
      setIsAuthLoading(false);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Poll for notifications if logged in
    if (user) {
      const fetchNotifs = () => {
        api
          .get("/notifications/unread")
          .then((res) => setNotifications(res.data.unreadCount))
          .catch(() => { });
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000); // Polling every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const logout = () => {
    api.post("/auth/logout").finally(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setRole("seeker");
      window.location.href = "/login";
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        notifications,
        sidebarCollapsed,
        setSidebarCollapsed,
        logout,
        isAuthLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
