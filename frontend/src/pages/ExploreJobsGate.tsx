import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, LogIn, Briefcase, Sparkles, ArrowLeft, Shield,
  MapPin, Clock, Bell, Users, Building2, CheckCircle, Star, Zap, TrendingUp,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import PublicNavbar from "@/components/PublicNavbar";

const features = [
  { icon: Search, label: "Smart Search", desc: "Filter by role, location, salary & more" },
  { icon: Sparkles, label: "AI Matching", desc: "Jobs matched to your skills & preferences" },
  { icon: Zap, label: "One-Click Apply", desc: "Apply instantly with saved resume" },
  { icon: Bell, label: "Real-time Alerts", desc: "Instant notifications on new openings" },
  { icon: TrendingUp, label: "Track Progress", desc: "Monitor all your applications live" },
  { icon: Shield, label: "Verified Only", desc: "Every company is vetted & verified" },
];

const floatingJobs = [
  { company: "Infosys", logo: "IN", color: "bg-blue-700", title: "Frontend Developer", location: "Bengaluru", salary: "₹12-18 LPA", tags: ["React", "TypeScript"] },
  { company: "Amazon", logo: "A", color: "bg-orange-500", title: "Product Manager", location: "Hyderabad", salary: "₹25-35 LPA", tags: ["Strategy", "Analytics"] },
  { company: "TCS", logo: "TC", color: "bg-indigo-600", title: "Data Analyst", location: "Mumbai", salary: "₹8-14 LPA", tags: ["Python", "SQL"] },
];

export default function ExploreJobsGate() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, hsl(210 100% 45% / 0.7), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 35, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -top-20 -right-32 w-[30rem] h-[30rem] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(195 90% 50% / 0.6), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(210 100% 70% / 0.5), transparent 70%)" }}
        />
      </div>

      {/* Top nav bar */}
      <PublicNavbar />

      {/* Floating blurred job cards - desktop only */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block z-0">
        {floatingJobs.map((job, i) => (
          <motion.div
            key={job.company}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.25, duration: 0.7 }}
            className={`absolute ${i === 0 ? "top-32 left-10" : i === 1 ? "top-56 right-10" : "bottom-32 left-16"}`}
          >
            <motion.div
              animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              className={`w-56 rounded-2xl bg-card/70 backdrop-blur-md border border-border/50 p-4 shadow-xl ${i === 0 ? "rotate-[-5deg]" : i === 1 ? "rotate-[4deg]" : "rotate-[-3deg]"}`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`w-9 h-9 rounded-xl ${job.color} flex items-center justify-center text-white text-[10px] font-heading font-bold`}>
                  {job.logo}
                </div>
                <div>
                  <p className="text-xs font-heading font-semibold text-foreground">{job.title}</p>
                  <p className="text-[10px] text-muted-foreground">{job.company}</p>
                </div>
              </div>
              <div className="space-y-1 mb-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Briefcase className="w-3 h-3" /> {job.salary}
                </div>
              </div>
              <div className="flex gap-1.5">
                {job.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-[9px] rounded-md bg-primary/10 text-primary font-medium">{tag}</span>
                ))}
              </div>
              {/* Lock overlay */}
              <div className="absolute inset-0 rounded-2xl bg-background/30 backdrop-blur-[2px] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-card shadow-md flex items-center justify-center">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-12 sm:pt-40 sm:pb-16 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Main glassmorphism card */}
          <div
            className="relative rounded-3xl p-8 sm:p-12 border border-border/50 overflow-hidden text-center"
            style={{
              background: "linear-gradient(145deg, hsl(var(--card) / 0.85), hsl(var(--card) / 0.65))",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 12px 48px hsl(var(--primary) / 0.1), 0 4px 16px hsl(0 0% 0% / 0.05)",
            }}
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

            {/* Inner glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full opacity-8"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)" }}
            />

            {/* Icon with animated ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative w-20 h-20 mx-auto mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/20"
              />
              <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
                <Search className="w-9 h-9 text-primary" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-2xl sm:text-3xl font-heading font-bold mb-3"
            >
              Login to <span className="gradient-text">Explore Jobs</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto"
            >
              Sign in as a Job Seeker to browse thousands of opportunities, apply instantly, and track your applications.
            </motion.p>

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
            >
              {features.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="group relative p-3.5 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-default"
                >
                  <div className="w-9 h-9 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <p className="text-xs font-heading font-semibold text-foreground mb-0.5">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Lock badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-heading font-semibold border border-primary/15">
                <Shield className="w-3.5 h-3.5" /> Login required to explore jobs
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
            >
              <Link
                to="/login/user"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all duration-300 text-white overflow-hidden hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, hsl(239 84% 67%), hsl(210 100% 45%))",
                  boxShadow: "0 4px 24px hsl(239 84% 67% / 0.35)",
                }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <LogIn className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Login as Job Seeker</span>
              </Link>

              <Link
                to="/signup/user"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-heading font-semibold text-sm border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300 bg-card/50 hover:bg-primary/5"
              >
                <Users className="w-4 h-4" />
                Create Free Account
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-5 sm:gap-8 pt-5 border-t border-border/50"
            >
              {[
                { value: "12K+", label: "Jobs", icon: Briefcase },
                { value: "8K+", label: "Companies", icon: Building2 },
                { value: "50K+", label: "Candidates", icon: Users },
                { value: "4.8", label: "Rating", icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="w-3.5 h-3.5 text-primary/50" />
                  <div>
                    <span className="text-sm font-heading font-bold text-primary">{stat.value}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{stat.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Back link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
