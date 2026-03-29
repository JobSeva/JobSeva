import { useLocation, Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import {
  LayoutDashboard, Search, Briefcase, User, Building2, Users, FileText,
  BarChart3, Bell, Settings, MessageSquare, ChevronLeft, ChevronRight,
  ClipboardList, UserCheck, LogOut
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const seekerLinks = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/explore", icon: Search, label: "Explore Jobs" },
  { to: "/app/applications", icon: Briefcase, label: "Applications" },
  { to: "/app/saved", icon: FileText, label: "Saved Jobs" },
  { to: "/app/messages", icon: MessageSquare, label: "Messages" },
  { to: "/app/profile", icon: User, label: "Profile" },
];

const companyLinks = [
  { to: "/app/company", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/company/post-job", icon: FileText, label: "Post Job" },
  { to: "/app/company/applicants", icon: Users, label: "Applicants" },
  { to: "/app/company/messages", icon: MessageSquare, label: "Messages" },
  { to: "/app/company/profile", icon: Building2, label: "Company Profile" },
];

const adminLinks = [
  { to: "/app/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/admin/companies", icon: Building2, label: "Companies" },
  { to: "/app/admin/users", icon: Users, label: "Users" },
  { to: "/app/admin/jobs", icon: ClipboardList, label: "Job Moderation" },
  { to: "/app/admin/placements", icon: UserCheck, label: "Placements" },
  { to: "/app/admin/reports", icon: BarChart3, label: "Reports" },
];

export default function AppSidebar() {
  const { role, setRole, notifications, sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useAppContext();
  const location = useLocation();

  const links = role === "seeker" ? seekerLinks : role === "company" ? companyLinks : adminLinks;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-card border-r border-border"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-28 border-b border-border">
        <Link to="/" className="flex items-center gap-3 logo-hover overflow-hidden">
          {!collapsed ? (
            <motion.img
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              src="/JobSeva.png" alt="JobSeva" className="h-20 sm:h-24 w-auto object-contain flex-shrink-0"
            />
          ) : (
            <img src="/JobSeva.png" alt="Job" className="h-14 w-14 object-cover object-left rounded-lg flex-shrink-0" />
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-muted-foreground hover:text-secondary hover:bg-muted"
                }`}
            >
              <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1">
        <Link
          to="/app/notifications"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <div className="relative flex-shrink-0">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
          {!collapsed && <span>Notifications</span>}
        </Link>
        <Link
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
