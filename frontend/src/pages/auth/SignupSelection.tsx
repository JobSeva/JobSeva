import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Building2, GraduationCap, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const roles = [
    {
        key: "user",
        label: "Job Seeker",
        desc: "Find your dream job with AI-powered matching",
        icon: Users,
        color: "from-indigo-500 to-blue-400",
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-600",
    },
    {
        key: "company",
        label: "Company",
        desc: "Hire the best talent for your organization",
        icon: Building2,
        color: "from-secondary to-warning",
        iconBg: "bg-secondary/10",
        iconColor: "text-secondary",
    },
    {
        key: "ngo",
        label: "NGO / Training",
        desc: "Provide training and empower job seekers",
        icon: GraduationCap,
        color: "from-purple-500 to-orange-400",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SignupSelection() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
            >
                <Link to="/" className="inline-block mb-6 logo-hover">
                    <img src="/JobSeva.png" alt="JobSeva" className="h-14 w-auto mx-auto" />
                </Link>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                    Join <span className="text-primary">JobSeva</span>
                </h1>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-md mx-auto">
                    Choose your account type to get started
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl"
            >
                {roles.map((role) => (
                    <motion.div key={role.key} variants={cardVariants}>
                        <Link
                            to={`/signup/${role.key}`}
                            className="block clean-card-hover p-6 text-center group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className={`w-16 h-16 mx-auto rounded-2xl ${role.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <role.icon className={`w-8 h-8 ${role.iconColor}`} />
                            </div>

                            <h3 className="font-heading font-semibold text-lg text-foreground mb-1.5">
                                {role.label}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                                {role.desc}
                            </p>

                            <span className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-primary group-hover:gap-2.5 transition-all duration-300">
                                Register Now <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            <div className="mt-10 flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
                <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
