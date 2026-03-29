import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: { min: number; max: number; currency: string };
}

interface SavedJob {
  savedAt: string;
  job: Job;
}

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/saved-jobs");
      if (res.data?.success) {
        setSavedJobs(res.data.data?.items || []);
      } else {
        setError(res.data?.error?.message || "Failed to load saved jobs");
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedJob = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs((prev) => prev.filter((sj) => sj.job.id !== jobId));
    } catch (err) {
      console.error("Failed to remove saved job", err);
    }
  };

  const formatSalary = (salary?: {
    min: number;
    max: number;
    currency: string;
  }) => {
    if (!salary) return "Salary not disclosed";
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center flex-col gap-2">
        <p className="text-destructive font-medium">{error}</p>
        <button
          onClick={fetchSavedJobs}
          className="text-primary hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold">
          Saved <span className="text-primary">Jobs</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Jobs you've bookmarked for later
        </p>
      </motion.div>

      <div className="space-y-3">
        {savedJobs.map((saved, i) => (
          <motion.div
            key={saved.job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/app/job/${saved.job.id}`}
              className="clean-card-hover p-5 cursor-pointer block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                  {saved.job.companyLogo || saved.job.company.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">
                    {saved.job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {saved.job.company} · {saved.job.location}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatSalary(saved.job.salary)}
                  </p>
                </div>
                <button
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors z-10 relative"
                  onClick={(e) => removeSavedJob(saved.job.id, e)}
                  title="Remove from saved jobs"
                >
                  <BookmarkCheck className="w-5 h-5 fill-current" />
                </button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {savedJobs.length === 0 && (
        <div className="clean-card p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No saved jobs yet. Start exploring!
          </p>
        </div>
      )}
    </div>
  );
}
