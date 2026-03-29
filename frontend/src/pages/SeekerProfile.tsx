import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Edit3,
  Camera,
  Plus,
  Star,
  Award,
  Code,
  Globe,
} from "lucide-react";

import { useAppContext } from "@/contexts/AppContext";

const skills = [
  "React",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "Python",
  "AWS",
  "Docker",
  "Figma",
];
const experience = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    period: "2022 – Present",
    logo: "T",
  },
  {
    title: "Frontend Developer",
    company: "StartupXYZ",
    period: "2020 – 2022",
    logo: "S",
  },
  {
    title: "Junior Developer",
    company: "WebAgency",
    period: "2018 – 2020",
    logo: "W",
  },
];

export default function SeekerProfile() {
  const { user } = useAppContext();

  return (
    <div className="space-y-6 max-w-4xl w-full px-0 sm:px-0 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1"
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          My <span className="text-primary">Profile</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="clean-card p-4 sm:p-6 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary flex items-center justify-center text-2xl sm:text-3xl font-heading font-bold text-primary-foreground shadow-lg">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "U"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-heading font-bold">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Software Engineer
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" /> Remote
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-primary" />{" "}
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              </div>
              <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-2.5">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium">
              Profile Strength
            </span>
            <span className="text-xs sm:text-sm text-primary font-bold">
              78%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            Add a resume to improve your profile strength
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold flex items-center gap-2 text-base sm:text-lg">
              <Code className="w-5 h-5 text-primary" /> Skills
            </h3>
            <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-xs sm:text-sm font-medium border border-primary/10"
              >
                {skill}
              </span>
            ))}
            <button className="px-3 py-1.5 rounded-xl border border-dashed border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Skill
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold flex items-center gap-2 text-base sm:text-lg">
              <Briefcase className="w-5 h-5 text-orange-500" /> Experience
            </h3>
            <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
              Add
            </button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center font-heading font-bold text-sm sm:text-base flex-shrink-0">
                  {exp.logo}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base truncate">
                    {exp.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {exp.company}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {exp.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-4 sm:p-6"
        >
          <h3 className="font-heading font-semibold flex items-center gap-2 mb-4 text-base sm:text-lg">
            <FileText className="w-5 h-5 text-emerald-500" /> Resume
          </h3>
          <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-10 text-center bg-muted/20">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-xs sm:text-sm font-medium text-foreground">
              Drop your resume here or click to upload
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
              PDF, DOCX up to 5MB
            </p>
            <button className="btn-primary mt-6 w-full sm:w-auto">
              Upload Resume
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
