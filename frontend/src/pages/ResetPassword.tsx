import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";
import { resetPassword } from "@/services/api";
import { toast } from "sonner";
import Loader from "@/components/Loader";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  ) {
    const response = (
      error as {
        response?: {
          data?: { error?: { message?: string }; message?: string };
        };
      }
    ).response;
    return (
      response?.data?.error?.message || response?.data?.message || fallback
    );
  }
  return fallback;
};

type ResetStatus = "form" | "success" | "error";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [status, setStatus] = useState<ResetStatus>(
    errorParam ? "error" : "form",
  );
  const [error, setError] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const derivedError = useMemo(() => {
    if (errorParam === "missing_token")
      return "Reset link is incomplete. Please request a new one.";
    if (errorParam)
      return "This reset link is invalid or has expired. Please request a new one.";
    return "";
  }, [errorParam]);

  useEffect(() => {
    if (status === "error" && derivedError) {
      setError(derivedError);
    }
  }, [status, derivedError]);

  useEffect(() => {
    if (!token && !errorParam) {
      setStatus("error");
      setError(
        "No reset token found. Please request a new password reset link.",
      );
    }
  }, [token, errorParam]);

  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) {
      window.location.href = "/login";
      return;
    }
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setError("Missing reset token. Please request a new link.");
      return;
    }

    if (nextPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (nextPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await resetPassword(token, nextPassword);
      setStatus("success");
      toast.success("Password reset successful. Redirecting to login.");
    } catch (err: unknown) {
      const message = getApiErrorMessage(
        err,
        "Unable to reset password with this link.",
      );
      setStatus("error");
      setError(message);
      toast.error("Password reset failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md clean-card p-8 sm:p-10"
      >
        {status === "form" && (
          <>
            <div className="text-center mb-7">
              <Link to="/" className="inline-block mb-4">
                <img
                  src="/JobSeva.png"
                  alt="JobSeva"
                  className="h-16 w-auto mx-auto"
                />
              </Link>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Set New Password
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Create a strong password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg border border-destructive/25 bg-destructive/5 text-sm text-destructive">
                  {error}
                </div>
              )}

              <label className="block text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={nextPassword}
                  onChange={(e) => setNextPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <label className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader size="sm" message="Updating..." />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </>
        )}

        {status === "success" && (
          <div className="text-center space-y-5">
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto" />
            <h2 className="text-xl font-heading font-bold text-foreground">
              Password Updated
            </h2>
            <p className="text-sm text-muted-foreground">
              Your password has been changed successfully. Redirecting to login
              in {countdown}s.
            </p>
            <Link
              to="/login"
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              Go to login now
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-5">
            <XCircle className="w-14 h-14 text-destructive mx-auto" />
            <h2 className="text-xl font-heading font-bold text-foreground">
              Reset Link Invalid
            </h2>
            <p className="text-sm text-muted-foreground">
              {error || "Please request a new password reset link."}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary hover:underline"
              >
                Request new link
              </Link>
              <Link
                to="/login"
                className="font-medium text-muted-foreground hover:text-foreground"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}

        <div className="mt-7 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
