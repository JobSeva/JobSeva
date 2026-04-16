import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { forgotPassword } from "@/services/api";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
      toast.success("If your account is eligible, a reset link has been sent.");
    } catch (err: unknown) {
      const message = getApiErrorMessage(
        err,
        "Unable to process your request right now.",
      );
      setError(message);
      toast.error("Could not request password reset", { description: message });
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
        {!isSent ? (
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
                Forgot Password
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your email and we will send a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg border border-destructive/25 bg-destructive/5 text-sm text-destructive">
                  {error}
                </div>
              )}

              <label className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader size="sm" message="Sending..." />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-5">
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto" />
            <h2 className="text-xl font-heading font-bold text-foreground">
              Check your email
            </h2>
            <p className="text-sm text-muted-foreground">
              If an eligible account exists, we sent a reset link to{" "}
              <span className="font-semibold text-foreground">{email}</span>.
            </p>
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
