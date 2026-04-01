import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import api from "@/lib/api";
import { resendVerification } from "@/services/api";

export default function NgoLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole, setUser } = useAppContext();

  const handleLogin = async (e) => {
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
        role: "ngo",
      };
      const res = await api.post("/auth/login", payload);
      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      setRole(user.role);

      navigate("/app");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");
    try {
      await resendVerification(email);
      alert("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to resend verification email.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md clean-card p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-orange-400" />

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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading font-semibold bg-purple-500/10 text-purple-600">
              <GraduationCap className="w-3.5 h-3.5" />
              NGO Login
            </span>
          </motion.div>

          <h1 className="text-2xl font-heading font-bold text-foreground">
            Welcome back, NGO
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
              className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20"
            >
              <div className="flex gap-3 text-left">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="space-y-2">
                  <p>{error}</p>
                  {(error.toLowerCase().includes("verify") ||
                    error.toLowerCase().includes("verified")) && (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-purple-500 hover:underline font-bold block"
                    >
                      {isLoading ? "Sending..." : "Resend Verification Email"}
                    </button>
                  )}
                </div>
              </div>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-purple-500 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden rounded-xl px-6 py-3 font-heading font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center text-sm text-muted-foreground">
          <p>
            New NGO?{" "}
            <Link
              to="/signup/ngo"
              className="text-purple-500 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
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
