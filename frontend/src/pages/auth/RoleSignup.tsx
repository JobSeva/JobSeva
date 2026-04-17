import { useState, useMemo } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Loader2,
  Users,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";

const roleConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    heading: string;
    sub: string;
    badge: string;
    badgeBg: string;
  }
> = {
  user: {
    label: "Job Seeker",
    icon: Users,
    heading: "Create Your Account",
    sub: "Join JobSeva to find your dream job",
    badge: "Job Seeker Signup",
    badgeBg: "bg-primary/10 text-primary",
  },
  company: {
    label: "Company",
    icon: Building2,
    heading: "Register Your Company",
    sub: "Start hiring the best talent today",
    badge: "Company Signup",
    badgeBg: "bg-secondary/10 text-secondary",
  },
  ngo: {
    label: "NGO",
    icon: GraduationCap,
    heading: "Join as NGO Partner",
    sub: "Launch programs and empower seekers",
    badge: "NGO Signup",
    badgeBg: "bg-green-500/10 text-green-500",
  },
};

// Password strength checker
function getPasswordStrength(password: string): {
  score: number; // 0–4
  label: string;
  color: string;
  bgColor: string;
} {
  if (!password) return { score: 0, label: "", color: "", bgColor: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Map score to 0-4
  const capped = Math.min(score, 4);

  const levels = [
    { label: "", color: "", bgColor: "" },
    { label: "Weak", color: "text-red-500", bgColor: "bg-red-500" },
    { label: "Fair", color: "text-orange-500", bgColor: "bg-orange-500" },
    { label: "Good", color: "text-yellow-500", bgColor: "bg-yellow-500" },
    { label: "Strong", color: "text-green-500", bgColor: "bg-green-500" },
  ];

  return { score: capped, ...levels[capped] };
}

export default function RoleSignup() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Touch tracking for real-time validation
  const [emailTouched, setEmailTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  if (!role || !roleConfig[role]) {
    return <Navigate to="/login" replace />;
  }

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const isEmailValid = email.includes("@") && email.includes(".");
  const passwordsMatch = password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailTouched(true);
    setConfirmTouched(true);

    // Validations
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (role === "company" && !companyName) {
      setError("Please enter your company name.");
      return;
    }
    if (role === "ngo" && !ngoName) {
      setError("Please enter your NGO name.");
      return;
    }
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        name: role === "ngo" ? ngoName : name,
        email,
        password,
        role: role === "user" ? "seeker" : role === "ngo" ? "ngo" : "company",
        companyName: role === "company" ? companyName : undefined,
      };

      await api.post("/auth/register", payload);

      toast.success("Account created! 🎉", {
        description: `Verification link sent to ${email}.`,
        duration: 5000,
      });

      setIsSuccess(true);
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Signup failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const emailError = emailTouched && email && !isEmailValid ? "Please enter a valid email address." : null;
  const confirmError = confirmTouched && confirmPassword && !passwordsMatch ? "Passwords do not match." : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] dark:bg-background relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse opacity-60" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse opacity-60" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative p-8 sm:p-12">
          {/* Top Gradient Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />

          {/* Header Glow Area */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[280px] h-[100px] bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
          {/* Success State */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto text-green-500">
                  <Mail className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-bold text-foreground">Check Your Email</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We've sent a verification link to <span className="text-foreground font-semibold font-mono">{email}</span>. Click the link to activate your account.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl border border-border flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Verification is required before you can log in. If you don't see the email, please check your spam folder.
                  </p>
                </div>
                <Link
                  to={`/login/${role}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
                >
                  Go to Login
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8 relative z-10">
                  <Link to="/" className="inline-block mb-4 logo-hover">
                    <img
                      src="/JobSeva.png"
                      alt="JobSeva"
                      className="h-20 sm:h-24 w-auto mx-auto drop-shadow-sm"
                    />
                  </Link>

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
                    {config.heading}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">{config.sub}</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4 relative z-10">
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
                        <div className="p-3.5 bg-destructive/[0.03] dark:bg-destructive/[0.1] border border-destructive/20 rounded-xl text-destructive text-sm text-center font-semibold flex items-start gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Rest of the form remains same... */}

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        id="signup-name"
                        type="text"
                        autoFocus
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 bg-muted/40 border border-border/60 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/60 shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Company Name (conditional) */}
                  <AnimatePresence>
                    {role === "company" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="block text-sm font-semibold text-foreground">
                          Company Name
                        </label>
                        <div className="relative group">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <input
                            id="signup-company"
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-muted/40 border border-border/60 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/60 shadow-sm"
                            placeholder="Acme Corp"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* NGO Name (conditional) */}
                  <AnimatePresence>
                    {role === "ngo" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="block text-sm font-semibold text-foreground">
                          NGO Name
                        </label>
                        <div className="relative group">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <input
                            id="signup-ngo"
                            type="text"
                            required
                            value={ngoName}
                            onChange={(e) => setNgoName(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-muted/40 border border-border/60 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/60 shadow-sm"
                            placeholder="Global Foundation"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        className={`block w-full pl-11 pr-11 py-3 bg-muted/40 border rounded-[1.25rem] text-sm font-medium focus:ring-4 outline-none transition-all duration-200 placeholder:text-muted-foreground/60 shadow-sm ${emailError
                          ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                          : "border-border/60 focus:ring-primary/10 focus:border-primary"
                          }`}
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                      {email && isEmailValid && !emailError && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 inset-y-0 flex items-center"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5 text-green-500 fill-green-500/5" />
                        </motion.div>
                      )}
                    </div>
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-destructive mt-1 ml-1"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-11 py-3 bg-muted/40 border border-border/60 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/60 shadow-sm"
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-1 hover:bg-muted rounded-full"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 space-y-1.5"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((seg) => (
                            <div
                              key={seg}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength.score >= seg
                                ? passwordStrength.bgColor
                                : "bg-muted"
                                }`}
                            />
                          ))}
                        </div>
                        {passwordStrength.label && (
                          <p className={`text-xs font-medium ${passwordStrength.color}`}>
                            Password strength: {passwordStrength.label}
                            {passwordStrength.score < 3 && (
                              <span className="text-muted-foreground font-normal">
                                {" "}— Add uppercase letters, numbers, or symbols
                              </span>
                            )}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setConfirmTouched(true)}
                        className={`block w-full pl-11 pr-11 py-3 bg-muted/40 border rounded-[1.25rem] text-sm font-medium focus:ring-4 outline-none transition-all duration-200 placeholder:text-muted-foreground/60 shadow-sm ${confirmError
                          ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                          : "border-border/60 focus:ring-primary/10 focus:border-primary"
                          }`}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-1 hover:bg-muted rounded-full"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {confirmError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-destructive mt-1 ml-1"
                        >
                          {confirmError}
                        </motion.p>
                      )}
                      {confirmTouched && confirmPassword && passwordsMatch && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-green-500 mt-1 ml-1 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Passwords match
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    className="w-full h-12 relative overflow-hidden rounded-[1.25rem] px-6 font-heading font-bold text-sm transition-all duration-300 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[length:100%_100%] text-primary-foreground shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-4 sm:mt-6"
                  >
                    {isLoading ? (
                      <Loader size="sm" message="Creating Account..." />
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link
                      to={`/login/${role}`}
                      className="font-semibold text-primary hover:underline transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Link
        to="/"
        className="fixed top-6 left-6 p-2.5 rounded-full bg-card/50 backdrop-blur-md border border-white/20 text-muted-foreground hover:text-foreground hover:bg-muted transition-all z-50 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
    </div>
  );
}
