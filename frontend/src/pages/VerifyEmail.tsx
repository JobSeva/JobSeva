import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { verifyEmail } from "@/services/api";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email address...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        const performVerification = async () => {
            try {
                const res = await verifyEmail(token);
                if (res.success) {
                    setStatus("success");
                    setMessage("Your email has been verified successfully. You can now log in to your account.");
                } else {
                    setStatus("error");
                    setMessage(res.error?.message || res.message || "Verification failed. The link may be invalid or expired.");
                }
            } catch (err: any) {
                setStatus("error");
                setMessage(err.response?.data?.error?.message || err.response?.data?.message || "An error occurred during verification. Please try again later.");
            }
        };

        performVerification();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md clean-card p-10 text-center relative z-10"
            >
                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Verifying Email</h1>
                                <p className="text-muted-foreground">{message}</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto text-green-500">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Verification Successful!</h1>
                                <p className="text-muted-foreground">{message}</p>
                            </div>
                            <Link
                                to="/login"
                                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                            >
                                Go to Login
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto text-destructive">
                                <XCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Verification Failed</h1>
                                <p className="text-muted-foreground">{message}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    className="btn-primary w-full py-4 bg-muted text-foreground hover:bg-muted/80"
                                >
                                    Back to Login
                                </Link>
                                <p className="text-xs text-muted-foreground mt-4 italic">
                                    Need a new link? Try logging in to resend the verification email.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Footer Branding */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                <img src="/JobSeva.png" alt="JobSeva" className="h-10 w-auto object-contain" />
            </div>
        </div>
    );
}
