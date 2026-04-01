import { useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  Users,
  Building2,
  Shield,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import api from "@/lib/api";
import { resendVerification } from "@/services/api";
import { toast } from "sonner";

const roleConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    welcome: string;
    badge: string;
    badgeBg: string;
  }
> = {
  user: {
    label: "Job Seeker",
    icon: Users,
    welcome: "Welcome back, Job Seeker",
    badge: "Job Seeker Login",
    badgeBg: "bg-primary/10 text-primary",
  },
  company: {
    label: "Company",
    icon: Building2,
    welcome: "Welcome back, Employer",
    badge: "Company Login",
    badgeBg: "bg-secondary/10 text-secondary",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    welcome: "Admin Portal",
    badge: "Admin Login",
    badgeBg: "bg-accent/10 text-accent",
  },
  ngo: {
    label: "NGO",
    icon: GraduationCap,
    welcome: "NGO Partner Portal",
    badge: "NGO Login",
    badgeBg: "bg-green-500/10 text-green-500",
  },
};

export default function RoleLogin() {
  const { role } = useParams<{ role: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole, setUser } = useAppContext();

  // Redirect if invalid role
  if (!role || !roleConfig[role]) {
    return <Navigate to="/login" replace />;
  }

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email,
        password,
        role: role === "user" ? "seeker" : role,
      };
      const res = await api.post("/auth/login", payload);
      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      setRole(user.role);

      navigate(user.role === "seeker" ? "/app/explore" : "/app");
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email to resend verification.");
      return;
    }
    const resendPromise = resendVerification(email);
    toast.promise(resendPromise, {
      loading: 'Sending verification email...',
      success: 'Verification email sent! Check your inbox.',
      error: (err: any) => err.response?.data?.error?.message || err.response?.data?.message || 'Failed to resend email'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md clean-card p-8 sm:p-10 relative overflow-hidden"
      >
        {/* Gradient top bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />

        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-5 logo-hover">
            <img
              src="/JobSeva.png"
              alt="JobSeva"
              className="h-24 sm:h-28 w-auto mx-auto"
            />
          </Link>

          {/* Role badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading font-semibold ${config.badgeBg}`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              {config.badge}
            </span>
          </motion.div>

          <h1 className="text-2xl font-heading font-bold text-foreground">
            {config.welcome}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center space-y-2"
            >
              <p>{error}</p>
              {error === "Please verify your email to login" && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary hover:underline block w-full text-xs"
                >
                  Resend Verification Email
                </button>
              )}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden rounded-xl px-6 py-3 font-heading font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-[1.02] hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 space-y-3 text-center text-sm text-muted-foreground">
          {role !== "admin" && (
            <p>
              New {config.label.toLowerCase()}?{" "}
              <Link
                to={`/signup/${role}`}
                className="text-primary font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          )}
          <p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to role selection
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
