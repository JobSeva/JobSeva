import { ReactNode, useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppContext } from "@/contexts/AppContext";
import api from "@/lib/api";
import {
  Bell,
  Search,
  LogOut,
  Settings as SettingsIcon,
  User,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { notifications, sidebarCollapsed, user, logout } = useAppContext();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (notificationsOpen) {
      api
        .get("/notifications")
        .then((res) => setNotificationsList(res.data.data.notifications || []))
        .catch(console.error);
    }
  }, [notificationsOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"}`}
      >
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          {/* Top Bar: Logo (mobile only) + Icons */}
          <div className="h-20 sm:h-24 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile Logo */}
              <div className="md:hidden flex items-center logo-hover">
                <img
                  src="/JobSeva.png"
                  alt="Logo"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
              {/* Desktop search (moved to below for mobile) */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border w-80 lg:w-96">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 font-body"
                />
                <kbd className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded font-mono border border-border">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />

              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-xl transition-all ${notificationsOpen ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-card" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <h4 className="font-heading font-bold text-sm">
                        Notifications
                      </h4>
                      <span
                        className="text-[10px] text-primary font-medium cursor-pointer hover:underline"
                        onClick={handleMarkAllRead}
                      >
                        Mark all as read
                      </span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto py-2">
                      {notificationsList.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        notificationsList.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-xl transition-colors cursor-pointer group ${n.isRead ? "hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"}`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary`}
                              >
                                <Bell className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold group-hover:text-primary transition-colors">
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                                  {n.body}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-border text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-muted-foreground hover:text-primary font-medium py-1 w-full inline-block"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-heading font-bold hover:scale-105 hover:shadow-lg cursor-pointer transition-all border-2 border-transparent hover:border-primary/20"
                >
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-border mb-1">
                      <p className="text-xs font-bold font-heading">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <Link
                      to="/app/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      to="/app/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all"
                    >
                      <SettingsIcon className="w-4 h-4" /> Settings
                    </Link>
                    <div className="h-[1px] bg-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-destructive/5 text-sm text-destructive hover:text-destructive transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar (Below top bar) */}
          <div className="md:hidden px-4 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 font-body"
              />
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8 mobile-content-padding">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
