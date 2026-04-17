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
  GraduationCap,
  Linkedin,
  Github,
  Link as LinkIcon,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { getSeekerProfile, RAW_BASE_URL } from "@/services/api";
import EditProfileModal from "@/components/EditProfileModal";
import { uploadResume, deleteSeekerResume } from "@/services/api";
import { toast } from "sonner";
import {
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText as FileIcon,
  Loader2
} from "lucide-react";
import Loader from "@/components/Loader";

export default function SeekerProfile() {
  const { user } = useAppContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getSeekerProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch seeker profile", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a PDF, DOC, or DOCX file.",
      });
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      await uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });
      toast.success("Resume uploaded!", {
        description: "Your professional profile is now even stronger.",
      });
      fetchProfile();
    } catch (err: any) {
      toast.error("Upload failed", {
        description: err.response?.data?.error?.message || "Failed to upload resume. Please try again.",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    try {
      await deleteSeekerResume();
      toast.success("Resume deleted");
      fetchProfile();
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  if (loading) {
    return <Loader message="Loading profile..." />;
  }

  const skills = profile?.skills || [];
  const languages = profile?.languages || [];
  const experiences = profile?.experiences || [];
  const education = profile?.education || [];

  return (
    <div className="space-y-6 max-w-4xl w-full px-0 sm:px-0 mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          My <span className="text-primary">Profile</span>
        </h1>
        <div className="flex items-center gap-3">
          {profile?.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-[#0077b5] transition-all hover:bg-[#0077b5]/5">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {profile?.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-foreground/5">
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile?.portfolioUrl && (
            <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:bg-primary/5">
              <LinkIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="clean-card p-4 sm:p-6 overflow-hidden relative"
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
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 shadow-lg shadow-primary/20"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {profile?.bio && (
          <div className="mt-8 pt-6 border-t border-border/50">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">About Me</h4>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>
        )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Skills Section */}
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
                Skills
              </h3>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs sm:text-sm text-primary hover:underline font-bold"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] sm:text-xs font-bold border border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  {skill}
                </span>
              )) : (
                <p className="text-xs text-muted-foreground font-medium italic">No skills added</p>
              )}
            </div>
          </motion.div>

          {/* Languages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="clean-card p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Globe className="w-5 h-5" />
                </div>
                Languages
              </h3>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs sm:text-sm text-primary hover:underline font-bold"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.length > 0 ? languages.map((lang: string) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/5 text-indigo-500 text-[10px] sm:text-xs font-bold border border-indigo-500/10"
                >
                  {lang}
                </span>
              )) : (
                <p className="text-xs text-muted-foreground font-medium italic">No languages added</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Experience Section */}
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
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs sm:text-sm text-primary hover:underline font-bold"
            >
              Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {experiences.length > 0 ? experiences.map((exp: any, i: number) => (
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
                    {exp.period}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 px-4 rounded-2xl border-2 border-dashed border-border bg-muted/10">
                <p className="text-sm text-muted-foreground font-medium italic">No work experience added yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="clean-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <GraduationCap className="w-5 h-5" />
              </div>
              Education
            </h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs sm:text-sm text-primary hover:underline font-bold"
            >
              Add Education
            </button>
          </div>
          <div className="space-y-6">
            {education.length > 0 ? education.map((edu: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center font-heading font-black text-lg text-primary/40 group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                  <GraduationCap className="w-6 h-6 opacity-30" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-xs sm:text-sm text-foreground/80 font-semibold mb-1">
                    {edu.school}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">
                    {edu.period}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 px-4 rounded-2xl border-2 border-dashed border-border bg-muted/10">
                <p className="text-sm text-muted-foreground font-medium italic">No education history added yet</p>
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
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500">
                <FileText className="w-5 h-5" />
              </div>
              Professional Resume
            </h3>
          </div>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
              relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 group
              ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-muted/10 hover:border-primary/50 hover:bg-primary/[0.02]"}
              ${uploading ? "pointer-events-none opacity-80" : ""}
            `}
          >
            <div className={`
              w-16 h-16 rounded-2xl border shadow-sm flex items-center justify-center mx-auto mb-5 transition-all duration-500
              ${profile?.resumeUrl ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-card border-border text-muted-foreground group-hover:scale-110 group-hover:text-primary"}
            `}>
              {uploading ? <Loader size="sm" /> : profile?.resumeUrl ? <CheckCircle2 className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
            </div>

            {uploading ? (
              <div className="max-w-xs mx-auto space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-primary">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ) : profile?.resumeUrl ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1">Resume uploaded successfully</h4>
                  <p className="text-xs text-muted-foreground font-medium">Your resume is visible to recruiters looking for your skills.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`${RAW_BASE_URL}${profile.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary py-2.5 px-8 text-xs font-bold flex items-center gap-2"
                  >
                    <FileIcon className="w-4 h-4" /> View Resume
                  </a>
                  <button
                    onClick={() => document.getElementById("resume-upload-input")?.click()}
                    className="px-6 py-2.5 rounded-xl border border-border text-xs font-bold bg-card hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Replace
                  </button>
                  <button
                    onClick={handleDeleteResume}
                    className="w-10 h-10 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center p-0"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-foreground mb-2">
                  Drop your resume here or click to upload
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> PDF</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> DOCX</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> MAX 5MB</span>
                </div>
                <button
                  onClick={() => document.getElementById("resume-upload-input")?.click()}
                  className="btn-primary mt-8 px-10 py-3 rounded-2xl shadow-lg shadow-primary/20 transform active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" /> Upload Resume
                </button>
              </>
            )}

            <input
              id="resume-upload-input"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        </motion.div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={fetchProfile}
      />
    </div>
  );
}
