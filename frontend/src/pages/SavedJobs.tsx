import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, BookmarkCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import Loader from "@/components/Loader";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
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
        // Backend returns the array directly in 'data'
        setSavedJobs(res.data.data || []);
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

  const formatSalary = (min?: number, max?: number) => {
    if (min === undefined || max === undefined) return "Salary not disclosed";
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  if (isLoading) {
    return <Loader message="Retrieving your saved opportunities..." />;
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
                    {formatSalary(saved.job.salaryMin, saved.job.salaryMax)}
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
        <div className="clean-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <BookmarkCheck className="w-8 h-8 text-muted-foreground opacity-20" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">No saved jobs yet</h3>
            <p className="text-muted-foreground text-sm max-w-[250px] mx-auto mt-1">
              Start exploring and bookmarking opportunities that interest you!
            </p>
          </div>
          <Link to="/app/explore" className="btn-primary inline-flex items-center gap-2">
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
