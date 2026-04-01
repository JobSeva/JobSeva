import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    User,
    Building2,
    Loader2,
    GraduationCap,
    ArrowLeft,
    FileText,
    CheckCircle2
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import api from "@/lib/api";
import { resendVerification } from "@/services/api";

export default function NgoSignup() {
    const [name, setName] = useState("");
    const [ngoName, setNgoName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { setRole, setUser } = useAppContext();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !ngoName || !email || !password) {
            setError("Please fill in all required fields.");
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
            const payload = {
                name: ngoName, // Use NGO name as core name for display
                email,
                password,
                role: "ngo",
                description
            };

            await api.post("/auth/signup", payload);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await resendVerification(email);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || "Failed to resend verification email.");
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
                        <span
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading font-semibold bg-purple-500/10 text-purple-600"
                        >
                            <GraduationCap className="w-3.5 h-3.5" />
                            NGO Signup
                        </span>
                    </motion.div>

                    <h1 className="text-2xl font-heading font-bold text-foreground">
                        Register Your NGO
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">Start providing training opportunities</p>
                </div>

                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                            <Mail className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Check Your Email</h2>
                            <p className="text-muted-foreground">
                                We've sent a verification link to <span className="text-foreground font-semibold">{email}</span>. Please click the link to activate your NGO account.
                            </p>
                        </div>
                        <Link
                            to="/login/ngo"
                            className="w-full flex items-center justify-center py-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-orange-400 mt-8"
                        >
                            Back to Login
                        </Link>
                    </motion.div>
                ) : (
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
                                        className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
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
                                        className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                                        placeholder="Global Education Foundation"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Description (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 outline-none placeholder:text-muted-foreground/70 min-h-[80px]"
                                        placeholder="Briefly describe your NGO's mission..."
                                    />
                                </div>
                            </div>

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
                                        className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
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
                                        className="block w-full pl-10 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 outline-none placeholder:text-muted-foreground/70"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-orange-400 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                                to="/login/ngo"
                                className="font-medium text-purple-500 hover:text-purple-400 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                )}
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
