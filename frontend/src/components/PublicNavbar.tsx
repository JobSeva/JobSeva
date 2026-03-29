import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-card/90 backdrop-blur-xl border-b border-primary/5 shadow-sm shadow-primary/5">
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between relative">
        <Link to="/" className="flex items-center logo-hover relative z-10">
          <img
            src="/JobSeva.png"
            alt="JobSeva"
            className="h-[65px] sm:h-[95px] w-auto object-contain transition-all duration-300 hover:scale-105 drop-shadow-sm"
          />
        </Link>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-sm text-foreground/70 hover:text-primary nav-link-hover font-semibold tracking-tight transition-colors">Home</Link>
          <Link to="/jobs" className="text-sm text-foreground/70 hover:text-primary nav-link-hover font-semibold tracking-tight transition-colors">Jobs</Link>
          <Link to="/companies" className="text-sm text-foreground/70 hover:text-primary nav-link-hover font-semibold tracking-tight transition-colors">Companies</Link>
          <Link to="/about" className="text-sm text-foreground/70 hover:text-primary nav-link-hover font-semibold tracking-tight transition-colors">About Us</Link>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <ThemeToggle />
          <Link to="/login" className="btn-primary py-2 px-6 text-sm font-bold shadow-primary/20 hover:shadow-primary/40">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
