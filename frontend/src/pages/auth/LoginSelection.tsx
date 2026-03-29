import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Building2, Shield, ArrowRight } from "lucide-react";
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
    key: "admin",
    label: "Admin",
    desc: "Manage platform operations and oversight",
    icon: Shield,
    color: "from-accent to-primary",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
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

export default function LoginSelection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative">
      {/* Theme toggle */}
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
          Welcome to <span className="text-primary">JobSeva</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-md mx-auto">
          Choose how you'd like to sign in
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
              to={`/login/${role.key}`}
              className="block clean-card-hover p-6 text-center group relative overflow-hidden"
            >
              {/* Gradient top bar */}
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
                Continue <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-xs text-muted-foreground"
      >
        <Link to="/" className="hover:text-foreground transition-colors">← Back to Home</Link>
      </motion.p>
    </div>
  );
}
