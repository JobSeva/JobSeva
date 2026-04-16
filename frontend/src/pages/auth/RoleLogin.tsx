import { useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Users,
  Building2,
  Shield,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
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
    accentColor: string;
  }
> = {
  user: {
    label: "Job Seeker",
    icon: Users,
    welcome: "Welcome back, Job Seeker",
    badge: "Job Seeker Login",
    badgeBg: "bg-primary/10 text-primary",
    accentColor: "hsl(var(--primary))",
  },
  company: {
    label: "Company",
    icon: Building2,
    welcome: "Welcome back, Employer",
    badge: "Company Login",
    badgeBg: "bg-secondary/10 text-secondary",
    accentColor: "hsl(var(--secondary))",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    welcome: "Admin Portal",
    badge: "Admin Login",
    badgeBg: "bg-accent/10 text-accent",
    accentColor: "hsl(var(--accent))",
  },
  ngo: {
    label: "NGO",
    icon: GraduationCap,
    welcome: "NGO Partner Portal",
    badge: "NGO Login",
    badgeBg: "bg-green-500/10 text-green-500",
    accentColor: "hsl(142, 71%, 45%)",
  },
};

export default function RoleLogin() {
  const { role } = useParams<{ role: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const navigate = useNavigate();
  const { setRole, setUser } = useAppContext();

  // Redirect if invalid role
  if (!role || !roleConfig[role]) {
    return <Navigate to="/login" replace />;
  }

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const isEmailValid = email.includes("@") && email.includes(".");

  const getEmailError = () => {
    if (!emailTouched || !email) return null;
    if (!isEmailValid) return "Please enter a valid email address.";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailTouched(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isEmailValid) {
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
      if (rememberMe) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        // Use sessionStorage for non-persistent session
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("refreshToken", refreshToken); // Also store for interceptor
      }

      setUser(user);
      setRole(user.role);

      toast.success(`Welcome back, ${user.name}! 🎉`, {
        description: "You have been logged in successfully.",
        duration: 3000,
      });

      // Redirect to main app dashboard
      setTimeout(() => {
        navigate("/app");
      }, 800);
    } catch (err: any) {
      const errorCode = err.response?.data?.error?.code;
      let msg = "Invalid email or password";

      if (errorCode === "EMAIL_NOT_VERIFIED") {
        msg = "Your account is not verified. Please check your email.";
      } else if (err.response?.status >= 500) {
        msg = "Something went wrong. Try again later";
      } else if (err.response?.data?.error?.message) {
        msg = err.response.data.error.message;
      }

      setError(msg);
      toast.error("Login Failed", { description: msg });
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
      loading: "Sending verification email...",
      success: "Verification email sent! Check your inbox.",
      error: (err: any) =>
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to resend email",
    });
  };

  const emailError = getEmailError();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] dark:bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse opacity-60" />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse opacity-60"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative p-8 sm:p-12">
          {/* Top Gradient Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />

          {/* Header Glow Area */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[250px] h-[100px] bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-5 logo-hover">
              <img
                src="/JobSeva.png"
                alt="JobSeva"
                className="h-20 sm:h-24 w-auto mx-auto drop-shadow-sm"
              />
            </Link>

            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
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
            <p className="text-sm text-muted-foreground mt-1.5">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Alert */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-[1.25rem] bg-destructive/[0.03] dark:bg-destructive/[0.1] text-destructive text-sm font-semibold border border-destructive/20 flex flex-col items-center gap-2 text-center mb-2 shadow-sm animate-in fade-in zoom-in duration-300">
                    <p className="flex items-center gap-2">{error}</p>
                    {error.toLowerCase().includes("verify") && (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs font-bold transition-all underline decoration-primary/30 underline-offset-4 bg-primary/5 px-3 py-1.5 rounded-full"
                      >
                        Resend Verification Link
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  id="login-email"
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className={`w-full pl-11 pr-11 py-3.5 rounded-[1.25rem] border bg-muted/40 focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium ${
                    emailError ||
                    (error &&
                      (error.toLowerCase().includes("email") ||
                        error.toLowerCase().includes("invalid")))
                      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                      : "border-border/60 focus:border-primary shadow-sm"
                  }`}
                />
                {/* Valid email indicator */}
                {email && isEmailValid && !emailError && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/5" />
                  </motion.div>
                )}
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive ml-1"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                {role === "admin" ? (
                  <span className="text-xs text-muted-foreground">
                    Password reset disabled for admin
                  </span>
                ) : (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-11 py-3.5 rounded-[1.25rem] border bg-muted/40 focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium ${
                    error &&
                    (error.toLowerCase().includes("password") ||
                      error.toLowerCase().includes("invalid"))
                      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                      : "border-border/60 focus:border-primary shadow-sm"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-1 hover:bg-muted rounded-full"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  rememberMe
                    ? "bg-primary border-primary"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {rememberMe && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M2 5l2.5 2.5L8 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </button>
              <span
                className="text-sm text-muted-foreground select-none cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me for 7 days
              </span>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className="w-full relative overflow-hidden rounded-[1.25rem] px-6 py-4 font-heading font-bold text-sm transition-all duration-300 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[length:100%_100%] text-primary-foreground shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="tracking-widest uppercase text-xs">
                    Authenticating
                  </span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">Sign In to JobSeva</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer links */}
          <div className="mt-8 space-y-3 text-center text-sm text-muted-foreground">
            {role !== "admin" && (
              <p>
                New {config.label.toLowerCase()}?{" "}
                <Link
                  to={`/signup/${role}`}
                  className="text-primary font-semibold hover:underline transition-colors"
                >
                  Create an account
                </Link>
              </p>
            )}
            {role !== "admin" && (
              <p>
                <Link
                  to="/login/admin"
                  className="text-accent font-semibold hover:underline transition-colors flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Sign in as Admin
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
        </div>
      </motion.div>
    </div>
  );
}
