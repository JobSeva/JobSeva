import { Link, useLocation } from "react-router-dom";
import { Home, Search, Briefcase, User, Building2, BarChart3 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const seekerNav = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/app/explore", icon: Search, label: "Jobs" },
  { to: "/app/applications", icon: Briefcase, label: "Applied" },
  { to: "/app/profile", icon: User, label: "Profile" },
];

const companyNav = [
  { to: "/app/company", icon: Home, label: "Home" },
  { to: "/app/company/post-job", icon: Briefcase, label: "Post" },
  { to: "/app/company/applicants", icon: Building2, label: "Applicants" },
  { to: "/app/company/profile", icon: User, label: "Profile" },
];

const adminNav = [
  { to: "/app/admin", icon: Home, label: "Home" },
  { to: "/app/admin/companies", icon: Building2, label: "Companies" },
  { to: "/app/admin/users", icon: User, label: "Users" },
  { to: "/app/admin/reports", icon: BarChart3, label: "Reports" },
];

export default function MobileBottomNav() {
  const { role } = useAppContext();
  const location = useLocation();

  const nav = role === "seeker" ? seekerNav : role === "company" ? companyNav : adminNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {nav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
