import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
  Users,
  Building2,
  CheckCircle2,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loader from "@/components/Loader";

type Job = {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  remote: boolean;
  skills: string[];
  description: string;
  responsibilities: string[];
  applicants: number;
  postedAt: string;
};

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err: any) {
        console.error("Job details fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!job) return;
    setIsApplying(true);
    setError(null);
    try {
      await api.post("/applications", { jobId: job.id });
      setApplySuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumSignificantDigits: 3,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <Loader message="Opening job details..." />;
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-heading font-bold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-4">
          This job listing may have been removed.
        </p>
        <Link to="/app/explore" className="btn-primary px-6 py-2">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/app/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="clean-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-lg text-primary flex-shrink-0">
                {job.companyLogo || "CO"}
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-heading font-bold">
                  {job.title}
                </h1>
                <p className="text-muted-foreground mt-1">{job.company}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {formatDate(job.postedAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills?.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                >
                  {s}
                </span>
              ))}
              {job.remote && (
                <span className="px-3 py-1 rounded-lg bg-success/10 text-success text-xs font-medium">
                  Remote
                </span>
              )}
            </div>
          </div>

          <div className="clean-card p-6">
            <h2 className="font-heading font-semibold text-lg mb-3">
              About the Role
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="clean-card p-6">
              <h2 className="font-heading font-semibold text-lg mb-3">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="clean-card p-6">
            <h2 className="font-heading font-semibold text-lg mb-3">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((s) => (
                <span
                  key={s}
                  className="px-4 py-2 rounded-xl bg-muted text-sm text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="clean-card p-5 lg:sticky lg:top-20 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Salary</p>
              <p className="text-xl font-heading font-bold mt-1">
                {formatCurrency(job.salaryMin)} -{" "}
                {formatCurrency(job.salaryMax)}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{job.applicants} applicants</span>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            {applySuccess ? (
              <button
                className="btn-primary w-full py-3 text-center bg-success hover:bg-success/90"
                disabled
              >
                Applied Successfully ✓
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="btn-primary w-full py-3 text-center disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isApplying ? (
                  <Loader size="sm" />
                ) : (
                  "Apply Now"
                )}
              </button>
            )}

            <button className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Share Job
            </button>
          </div>

          <div className="clean-card p-5">
            <h3 className="font-heading font-semibold text-sm mb-3">
              About Company
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-sm text-primary">
                {job.companyLogo || "CO"}
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">
                  {job.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  Verified Employer
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Company Details
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {job.location}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
