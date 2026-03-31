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
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { getSeekerProfile } from "@/services/api";

export default function SeekerProfile() {
  const { user } = useAppContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getSeekerProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch seeker profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const skills = profile?.skillsRaw ? JSON.parse(profile.skillsRaw) : [];
  const experience = profile?.experiences || [];

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
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={user?.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg" />
            ) : (
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
            )}
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-heading font-bold">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base font-medium">
                  {profile?.headline || "Add a headline"}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" /> {profile?.location || "Location not set"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" />{" "}
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              </div>
              <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 shadow-lg shadow-primary/20">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Profile Strength
            </span>
            <span className="text-xs sm:text-sm text-primary font-black">
              {profile?.profileStrength || 0}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-background overflow-hidden border border-border/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profile?.profileStrength || 0}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary shadow-sm"
            />
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2.5 font-medium">
            {profile?.profileStrength < 100 ? "Complete your profile to increase your visibility to recruiters" : "Your profile is fully complete!"}
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Code className="w-5 h-5" />
              </div>
              Skills & Expertise
            </h3>
            <button className="text-xs sm:text-sm text-primary hover:underline font-bold">
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.length > 0 ? skills.map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-xs sm:text-sm font-bold border border-primary/10 hover:bg-primary/10 transition-colors"
              >
                {skill}
              </span>
            )) : (
              <p className="text-sm text-muted-foreground font-medium italic">No skills added yet</p>
            )}
            <button className="px-4 py-2 rounded-xl border border-dashed border-border text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all flex items-center gap-2 font-bold">
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                <Briefcase className="w-5 h-5" />
              </div>
              Work Experience
            </h3>
            <button className="text-xs sm:text-sm text-primary hover:underline font-bold">
              Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {experience.length > 0 ? experience.map((exp: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center font-heading font-black text-lg text-primary/40 group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                  {exp.company?.[0]?.toUpperCase() || "J"}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                    {exp.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-foreground/80 font-semibold mb-1">
                    {exp.company}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">
                    <Globe className="w-3 h-3" /> {exp.period}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 px-4 rounded-2xl border-2 border-dashed border-border bg-muted/10">
                <p className="text-sm text-muted-foreground font-medium italic">No work experience added yet</p>
                <button className="mt-3 text-xs font-bold text-primary hover:underline">Add your first job</button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <FileText className="w-5 h-5" />
              </div>
              Professional Resume
            </h3>
          </div>
          <div className="border-2 border-dashed border-border rounded-3xl p-8 sm:p-12 text-center bg-muted/10 hover:border-primary/50 hover:bg-primary/[0.02] transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            {profile?.resumeUrl ? (
              <div className="space-y-4">
                <p className="text-sm font-bold text-foreground">Resume uploaded successfully</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-primary py-2 px-6 text-xs font-bold">View Resume</a>
                  <button className="px-6 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors">Replace File</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-foreground mb-1">
                  Drop your resume here or click to upload
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                  PDF, DOCX up to 5MB
                </p>
                <button className="btn-primary mt-8 px-10 py-3 rounded-2xl shadow-lg shadow-primary/20 transform active:scale-95 transition-all">
                  Upload Resume
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
