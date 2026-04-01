import { useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Building2,
  Loader2,
  Users,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import api from "@/lib/api";

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

export default function RoleSignup() {
  const { role } = useParams<{ role: string }>();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const { setRole, setUser } = useAppContext();

  if (!role || !roleConfig[role]) {
    return <Navigate to="/login" replace />;
  }

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
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
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        name: role === "ngo" ? ngoName : name,
        email,
        password,
        role: role === "user" ? "seeker" : (role === "ngo" ? "ngo" : "company"),
        companyName: role === "company" ? companyName : undefined,
      };

      await api.post("/auth/register", payload);

      // We no longer log in immediately. We show the verification message.
      setIsLoading(false);
      setIsVerificationSent(true);
      return;
    } catch (err: any) {
      const message = err.response?.data?.error?.message || err.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md clean-card p-10 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            We've sent a verification link to <span className="text-foreground font-semibold">{email}</span>. Please click the link to activate your account.
          </p>
          <div className="space-y-4">
            <Link to="/login" className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all">
              Back to Login
            </Link>
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try logging in to resend it.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md clean-card p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />

        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-5 logo-hover">
            <img
              src="/JobSeva.png"
              alt="JobSeva"
              className="h-24 sm:h-28 w-auto mx-auto"
            />
          </Link>

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
            {config.heading}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{config.sub}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {role === "company" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                    placeholder="Acme Corp"
                    required={role === "company"}
                  />
                </div>
              </motion.div>
            )}

            {role === "ngo" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  NGO Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                    placeholder="Global Foundation"
                    required={role === "ngo"}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to={`/login/${role}`}
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>

      <Link
        to="/signup"
        className="fixed top-6 left-6 p-2 rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
    </div>
  );
}
