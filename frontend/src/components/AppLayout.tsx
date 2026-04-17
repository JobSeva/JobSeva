import { ReactNode, useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Building2,
  Users,
  GraduationCap,
  ClipboardList,
  UserCheck,
  BarChart3,
  PlusCircle,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const seekerLinks = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/training", icon: BookOpen, label: "Trainings" },
  { to: "/app/explore", icon: Search, label: "Explore Jobs" },
  { to: "/app/applications", icon: Briefcase, label: "Applications" },
  { to: "/app/saved", icon: FileText, label: "Saved Jobs" },
  { to: "/app/messages", icon: MessageSquare, label: "Messages" },
  { to: "/app/profile", icon: User, label: "Profile" },
];

const companyLinks = [
  { to: "/app/company", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/company/jobs", icon: Briefcase, label: "Posted Jobs" },
  { to: "/app/company/post-job", icon: FileText, label: "Post Job" },
  { to: "/app/company/applicants", icon: Users, label: "Applicants" },
  { to: "/app/company/messages", icon: MessageSquare, label: "Messages" },
  { to: "/app/company/profile", icon: Building2, label: "Company Profile" },
];

const ngoLinks = [
  { to: "/app", icon: LayoutDashboard, label: "Overview" },
  { to: "/app/ngo/post-training", icon: PlusCircle, label: "Post Training" },
  { to: "/app/ngo/courses", icon: BookOpen, label: "My Courses" },
  { to: "/app/ngo/enrollments", icon: ClipboardCheck, label: "Enrollments" },
  { to: "/app/messages", icon: MessageSquare, label: "Messages" },
  { to: "/app/profile", icon: User, label: "Profile" },
];

const adminLinks = [
  { to: "/app/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/admin/companies", icon: Building2, label: "Companies" },
  { to: "/app/admin/ngos", icon: GraduationCap, label: "NGOs" },
  { to: "/app/admin/users", icon: Users, label: "Users" },
  { to: "/app/admin/jobs", icon: ClipboardList, label: "Job Moderation" },
  { to: "/app/admin/placements", icon: UserCheck, label: "Placements" },
  { to: "/app/admin/reports", icon: BarChart3, label: "Reports" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { notifications, sidebarCollapsed, user, role, logout } = useAppContext();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const links =
    role === "seeker"
      ? seekerLinks
      : role === "company"
        ? companyLinks
        : role === "ngo"
          ? ngoLinks
          : adminLinks;

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

  useEffect(() => {
    // Close mobile menu on navigation
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-[70] md:hidden flex flex-col p-6 h-[100dvh]"
            >
              <div className="flex items-center justify-between mb-8">
                <img src="/JobSeva.png" alt="JobSeva" className="h-10 w-auto" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-muted text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                {links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-border mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user?.name?.[0] || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"}`}
      >
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="h-16 sm:h-20 md:h-24 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-card border border-border shadow-sm hover:bg-muted transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Logo */}
              <div className="md:hidden flex items-center logo-hover max-w-[100px]">
                <img
                  src="/JobSeva.png"
                  alt="Logo"
                  className="h-8 sm:h-12 w-auto object-contain"
                />
              </div>

              {/* Desktop search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border w-80 lg:w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 font-body"
                />
                <kbd className="hidden lg:block text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded font-mono border border-border">
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
                    <div className="max-h-[350px] overflow-y-auto py-2 custom-scrollbar">
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
                                <p className="text-xs font-bold group-hover:text-primary transition-colors">
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
                        to="/app/notifications"
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
        <main className="flex-1 p-4 sm:p-8 mobile-content-padding overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
