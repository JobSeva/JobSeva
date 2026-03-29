import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Mail,
  Star,
  MoreHorizontal,
  Phone,
  Loader2,
  RefreshCw,
} from "lucide-react";
import api from "@/lib/api";

const columns = [
  { key: "applied", label: "Applied", color: "border-muted-foreground/30" },
  { key: "shortlisted", label: "Shortlisted", color: "border-warning/50" },
  { key: "interview", label: "Interview", color: "border-primary/50" },
  { key: "hired", label: "Hired", color: "border-success/50" },
];

interface ApplicantView {
  applicationId: string;
  seekerId: string;
  name: string;
  email: string;
  phone?: string;
  headline: string;
  skills: string[];
  experienceCount: number;
  status: string;
  matchScore: number;
  recruiterRating: number;
  appliedAt: string;
}

export default function CompanyApplicants() {
  const [candidates, setCandidates] = useState<ApplicantView[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<ApplicantView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const jobsRes = await api.get("/company/jobs?limit=100");
      if (jobsRes.data?.success) {
        const jobs = jobsRes.data.data?.items || [];
        let all: ApplicantView[] = [];

        for (const job of jobs) {
          try {
            const appRes = await api.get(`/company/jobs/${job.id}/applicants`);
            if (appRes.data?.success && appRes.data.data) {
              all = [...all, ...appRes.data.data];
            }
          } catch {
            // Ignore individual job failure
          }
        }

        all.sort(
          (a, b) =>
            new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
        );
        setCandidates(all);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    applicationId: string,
    newStatus: string,
  ) => {
    setIsUpdating(true);
    try {
      const res = await api.put(
        `/company/applications/${applicationId}/status`,
        { status: newStatus },
      );
      if (res.data?.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.applicationId === applicationId ? { ...c, status: newStatus } : c,
          ),
        );
        if (selectedCandidate?.applicationId === applicationId) {
          setSelectedCandidate((prev) =>
            prev ? { ...prev, status: newStatus } : null,
          );
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">
            Applicant <span className="text-primary">Pipeline</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage candidates through your hiring stages
          </p>
        </div>
        <button
          onClick={fetchCandidates}
          className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columns.map((col, ci) => {
          const items = candidates.filter((c) => c.status === col.key);
          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1 }}
              className={`kanban-column border-t-2 min-w-[280px] ${col.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-sm">
                  {col.label}
                </h3>
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((c, i) => (
                  <motion.div
                    key={c.applicationId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + ci * 0.1 + i * 0.05 }}
                    className="clean-card-hover p-4 cursor-pointer"
                    onClick={() => setSelectedCandidate(c)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs font-heading font-bold text-primary">
                          {c.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-medium truncate">
                            {c.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.headline || "Candidate"}
                          </p>
                        </div>
                      </div>
                      <button className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <div className="flex gap-1 overflow-hidden flex-wrap max-h-4">
                        {c.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground whitespace-nowrap"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-primary flex-shrink-0">
                        {c.matchScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
                      <a
                        href={`mailto:${c.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                      <button
                        className="p-1 rounded-md hover:bg-muted transition-colors text-warning/70 hover:text-warning"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Star
                          className="w-3.5 h-3.5"
                          fill={c.recruiterRating > 0 ? "currentColor" : "none"}
                        />
                      </button>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {c.experienceCount} exp entries
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="clean-card p-6 max-w-md w-full space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {isUpdating && (
              <div className="absolute inset-0 bg-background/50 rounded-xl backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-lg text-primary">
                {selectedCandidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">
                  {selectedCandidate.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCandidate.headline || "Applicant"}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {selectedCandidate.email}
              </div>
              {selectedCandidate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {selectedCandidate.phone}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Skills</p>
              <div className="flex gap-2 flex-wrap">
                {selectedCandidate.skills?.length > 0 ? (
                  selectedCandidate.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No specific skills listed
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <span className="text-sm font-medium">
                Stage:{" "}
                <span className="text-muted-foreground capitalize">
                  {selectedCandidate.status}
                </span>
              </span>
              <div className="flex gap-2 flex-wrap">
                {selectedCandidate.status === "applied" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedCandidate.applicationId,
                        "shortlisted",
                      )
                    }
                    className="btn-primary px-3 py-1.5 text-xs"
                  >
                    Shortlist
                  </button>
                )}
                {selectedCandidate.status === "shortlisted" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedCandidate.applicationId,
                        "interview",
                      )
                    }
                    className="btn-primary px-3 py-1.5 text-xs"
                  >
                    Interview
                  </button>
                )}
                {selectedCandidate.status === "interview" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedCandidate.applicationId,
                        "hired",
                      )
                    }
                    className="bg-success text-success-foreground hover:bg-success/90 rounded-xl px-3 py-1.5 text-xs font-semibold"
                  >
                    Hire
                  </button>
                )}
                {selectedCandidate.status !== "rejected" &&
                  selectedCandidate.status !== "hired" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedCandidate.applicationId,
                          "rejected",
                        )
                      }
                      className="px-3 py-1.5 rounded-xl border border-destructive/20 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Reject
                    </button>
                  )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
