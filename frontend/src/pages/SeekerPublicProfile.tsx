import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  MapPin,
  Briefcase,
} from "lucide-react";

import Loader from "@/components/Loader";
import { getPublicSeekerProfile } from "@/services/api";

interface PublicSeekerProfile {
  userId: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  skills: string[];
  languages: string[];
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    period?: string;
    description?: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    field: string;
    school: string;
    period?: string;
    startYear: number;
    endYear: number;
  }>;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export default function SeekerPublicProfile() {
  const { seekerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicSeekerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!seekerId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getPublicSeekerProfile(seekerId);
        if (res?.success) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch public seeker profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [seekerId]);

  if (isLoading) {
    return <Loader message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="clean-card p-8 text-center">
        <h2 className="text-xl font-heading font-bold">Profile not found</h2>
        <p className="text-muted-foreground mt-2">
          This seeker profile is unavailable.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {profile.resumeUrl ? (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${profile.resumeUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Resume
          </a>
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clean-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold font-heading">
              {profile.name
                .split(" ")
                .map((item) => item[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold">{profile.name}</h1>
            <p className="text-muted-foreground mt-1">
              {profile.headline || "Seeker"}
            </p>
            <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {profile.location || "Location not specified"}
            </p>

            <div className="flex items-center gap-2 mt-4">
              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-[#0077b5] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              ) : null}
              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              ) : null}
              {profile.portfolioUrl ? (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {profile.bio ? (
          <div className="mt-6 pt-5 border-t border-border/60">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              About
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              {profile.bio}
            </p>
          </div>
        ) : null}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clean-card p-5"
        >
          <h3 className="font-heading font-bold text-lg inline-flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Skills
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills?.length ? (
              profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed</p>
            )}
          </div>

          <h4 className="mt-6 font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Languages
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.languages?.length ? (
              profile.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold"
                >
                  {lang}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No languages listed
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="clean-card p-5"
        >
          <h3 className="font-heading font-bold text-lg inline-flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Education
          </h3>
          <div className="mt-4 space-y-3">
            {profile.education?.length ? (
              profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-3 rounded-lg bg-muted/40 border border-border/50"
                >
                  <p className="text-sm font-semibold">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.school} |{" "}
                    {edu.period || `${edu.startYear} - ${edu.endYear}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No education listed
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="clean-card p-5"
      >
        <h3 className="font-heading font-bold text-lg inline-flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Experience
        </h3>
        <div className="mt-4 space-y-3">
          {profile.experiences?.length ? (
            profile.experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-lg bg-muted/40 border border-border/50"
              >
                <p className="text-sm font-semibold">{exp.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.company}
                  {exp.period ? ` | ${exp.period}` : ""}
                </p>
                {exp.description ? (
                  <p className="text-xs text-foreground/80 mt-2">
                    {exp.description}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No experience listed
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
