import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCw,
  Shield,
} from "lucide-react";
import { verifyEmail, resendVerification } from "@/services/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";

type VerifyStatus = "loading" | "success" | "error" | "idle";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const successParam = searchParams.get("success"); // Set by backend GET redirect
  const errorParam = searchParams.get("error");   // Set by backend GET redirect

  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("This verification link is invalid or has expired.");
  const [countdown, setCountdown] = useState(5);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  useEffect(() => {
    // Case 1: Backend redirected here with ?success=true (GET link click flow)
    if (successParam === "true") {
      setStatus("success");
      return;
    }

    // Case 2: Backend redirected here with ?error=... (GET link click flow)
    if (errorParam) {
      setStatus("error");
      if (errorParam === "missing_token") setErrorMessage("No verification token was provided.");
      else setErrorMessage("This verification link is invalid or has expired.");
      return;
    }

    // Case 3: Frontend has the token — call POST endpoint
    if (token) {
      setStatus("loading");
      const performVerification = async () => {
        try {
          const res = await verifyEmail(token);
          if (res.success) {
            setStatus("success");
          } else {
            setStatus("error");
            setErrorMessage(res.error?.message || res.message || "Verification failed. The link may be invalid or expired.");
          }
        } catch (err: any) {
          setStatus("error");
          setErrorMessage(
            err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "An error occurred during verification. Please try again."
          );
        }
      };
      performVerification();
      return;
    }

    // No token and no params — show generic error
    setStatus("error");
    setErrorMessage("No verification token found in the link. Please check your email again.");
  }, [token, successParam, errorParam]);

  // Countdown auto-redirect on success
  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) {
      window.location.href = "/login";
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [status, countdown]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setIsResending(true);
    try {
      await resendVerification(resendEmail);
      toast.success("Verification email sent!", {
        description: `We've sent a new link to ${resendEmail}. Check your inbox.`,
      });
      setShowResendForm(false);
      setResendEmail("");
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to resend. Please try again.";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[45%] h-[45%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "0.7s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="clean-card relative overflow-hidden shadow-2xl">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

          <div className="p-10 text-center">
            {/* Logo */}
            <Link to="/" className="inline-block mb-8">
              <img src="/JobSeva.png" alt="JobSeva" className="h-16 w-auto mx-auto" />
            </Link>

            <AnimatePresence mode="wait">
              {/* ─── LOADING ─── */}
              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto relative">
                    <Mail className="w-10 h-10 text-primary" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 animate-ping opacity-60" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Verifying Your Account
                    </h1>
                    <p className="text-muted-foreground">
                      Please wait while we verify your email address...
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Loader size="sm" message="This will only take a moment" />
                  </div>
                </motion.div>
              )}

              {/* ─── SUCCESS ─── */}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="space-y-6"
                >
                  {/* Animated success icon */}
                  <div className="relative mx-auto w-24 h-24">
                    <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-green-500/10 animate-ping opacity-40" style={{ animationDuration: "2s" }} />
                  </div>

                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Email Verified! 🎉
                    </h1>
                    <p className="text-muted-foreground">
                      Your account has been successfully verified. You can now sign in to JobSeva.
                    </p>
                  </div>

                  {/* Countdown redirect */}
                  <div className="bg-muted/50 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    Redirecting to login in <span className="font-bold text-primary tabular-nums">{countdown}s</span>...
                  </div>

                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300 group"
                  >
                    Go to Login
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              )}

              {/* ─── ERROR ─── */}
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto">
                    <XCircle className="w-12 h-12 text-destructive" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Verification Failed
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300 group"
                    >
                      Back to Login
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setShowResendForm(!showResendForm)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Verification Email
                    </button>
                  </div>

                  {/* Resend form */}
                  <AnimatePresence>
                    {showResendForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleResend}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 space-y-3">
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="email"
                              value={resendEmail}
                              onChange={(e) => setResendEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isResending}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-all"
                          >
                            {isResending ? (
                              <Loader size="sm" />
                            ) : (
                              <>Send New Link</>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ─── IDLE (no params at all) ─── */}
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                    <Mail className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Check Your Email
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We've sent a verification link to your email. Click the link to activate your account.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
                  >
                    Back to Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer branding */}
        <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
          <img src="/JobSeva.png" alt="JobSeva" className="h-8 w-auto" />
        </div>
      </motion.div>
    </div>
  );
}
