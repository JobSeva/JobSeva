import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, GraduationCap, ArrowRight, X, Sparkles, Shield } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "login" | "signup";
}

const roles = [
  {
    key: "user",
    label: "Job Seeker",
    desc: "Find your dream job with AI-powered matching",
    icon: Users,
    color: "from-indigo-500 to-blue-400",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
  },
  {
    key: "company",
    label: "Company",
    desc: "Hire the best talent for your organization",
    icon: Building2,
    color: "from-secondary to-warning",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    key: "ngo",
    label: "NGO / Training",
    desc: "Provide training and empower job seekers",
    icon: GraduationCap,
    color: "from-green-500 to-teal-400",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    key: "admin",
    label: "Admin",
    desc: "Manage platform operations and users",
    icon: Shield,
    color: "from-accent to-primary",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
];

export default function AuthModal({ isOpen, onClose, type = "signup" }: AuthModalProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalTypeHeader = type === "signup" ? "Create Account" : "Welcome Back";
  const modalTypeSub = type === "signup" ? "Join JobSeva's talent network" : "Log in to your account";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-2xl bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Decorative Blob */}
              <div
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-heading font-semibold mb-6 border border-primary/20">
                  <Sparkles className="w-4 h-4" /> Discover Your Potential
                </div>

                <h2 className="text-3xl sm:text-4xl font-heading font-bold gradient-text mb-2">
                  {modalTypeHeader}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {modalTypeSub}
                </p>
              </div>

              {/* Role Grid */}
              <div className={`grid grid-cols-1 ${type === "login" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"} gap-5 mb-8 relative z-10`}>
                {roles
                  .filter(role => type === "login" || role.key !== "admin")
                  .map((role, idx) => (
                  <motion.div
                    key={role.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      to={`/${type}/${role.key}`}
                      onClick={onClose}
                      className="block p-6 rounded-3xl border border-border bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 text-center group h-full relative overflow-hidden"
                    >
                      {/* Hover gradient line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                      <div className={`w-14 h-14 mx-auto rounded-2xl ${role.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <role.icon className={`w-7 h-7 ${role.iconColor}`} />
                      </div>

                      <h3 className="font-heading font-bold text-base mb-1.5 line-clamp-1">
                        {role.label}
                      </h3>
                      <p className="text-[11px] leading-relaxed text-muted-foreground mb-4 line-clamp-2">
                        {role.desc}
                      </p>

                      <div className="mt-auto pt-4 flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-primary text-[11px] font-extrabold uppercase tracking-widest text-white group-hover:scale-105 transition-all duration-300 shadow-md">
                          {type === "signup" ? "Join Now" : "Log In"} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-border mt-2 relative z-10">
                <p className="text-xs text-muted-foreground">
                  {type === "signup" ? "Already have an account?" : "New to JobSeva?"}{" "}
                  <button
                    onClick={() => {
                        // Normally we'd toggle modal type, but for now we close and redirect
                        // to the other selection portal or link
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    {type === "signup" ? (
                        <Link to="/login" onClick={onClose}>Sign in here</Link>
                    ) : (
                        <Link to="/signup" onClick={onClose}>Create one now</Link>
                    )}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
