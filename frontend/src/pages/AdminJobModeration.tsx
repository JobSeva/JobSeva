import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";
import api from "@/lib/api";
import Loader from "@/components/Loader";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  active: boolean;
  createdAt: string;
  applicants: number;
}

export default function AdminJobModeration() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/admin/jobs");
      // res.data could be success-wrapped or just an array based on adminController structure
      const jobsList = res.data?.success
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      // Sort by newest first
      setJobs(
        jobsList.sort(
          (a: Job, b: Job) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async (id: string, active: boolean) => {
    setProcessingId(id);
    try {
      const res = await api.put(`/admin/jobs/${id}/moderate`, { active });
      // Depending on structure, update locally
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, active } : j)));
    } catch (err) {
      console.error("Failed to moderate job", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this job post?"))
      return;
    setProcessingId(id);
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job", err);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Job <span className="text-primary">Moderation</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage job postings
        </p>
      </motion.div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <Loader message="Auditing job marketplace..." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="clean-card p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-lg">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${job.active
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                        }`}
                    >
                      {job.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {job.company} · {job.location}
                  </p>
                  <p className="text-xs text-muted-foreground flex gap-3">
                    <span>{job.applicants} applicants</span>
                    <span>
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:self-start">
                  {job.active ? (
                    <button
                      onClick={() => handleModerate(job.id, false)}
                      disabled={processingId === job.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-warning hover:bg-warning/10 border border-transparent hover:border-warning/20 transition-all disabled:opacity-50"
                      title="Hide from public"
                    >
                      {processingId === job.id ? (
                        <Loader size="sm" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>Hide</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(job.id, true)}
                      disabled={processingId === job.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-success hover:bg-success/10 border border-transparent hover:border-success/20 transition-all disabled:opacity-50"
                      title="Publish as Active"
                    >
                      {processingId === job.id ? (
                        <Loader size="sm" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Publish</span>
                    </button>
                  )}

                  <div className="w-px h-6 bg-border mx-1" />

                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={processingId === job.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all disabled:opacity-50"
                  >
                    {processingId === job.id && !job.active ? (
                      <Loader size="sm" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center clean-card mt-4">
              <AlertTriangle className="w-12 h-12 mb-3 text-muted-foreground/30" />
              <p>No jobs found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
