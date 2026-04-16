import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  UserCheck,
  Trophy,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import Loader from "@/components/Loader";
import { Link } from "react-router-dom";

const stages = [
  {
    key: "applied",
    label: "Applied",
    icon: Clock,
    color: "text-muted-foreground bg-muted",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    icon: CheckCircle2,
    color: "text-warning bg-warning/10",
  },
  {
    key: "interview",
    label: "Interview",
    icon: UserCheck,
    color: "text-primary bg-primary/10",
  },
  {
    key: "hired",
    label: "Hired",
    icon: Trophy,
    color: "text-success bg-success/10",
  },
];

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
        if (res.data?.success) {
          setApplications(res.data.data?.items || []);
        } else {
          setError(res.data?.error?.message || "Failed to load applications");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error?.message ||
          "An error occurred while loading applications",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  if (isLoading) {
    return <Loader message="Retrieving your applications..." />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center flex-col gap-2">
        <p className="text-destructive font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
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
          My <span className="text-primary">Applications</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your application progress
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stages.map((stage, i) => {
          const count = applications.filter(
            (a) => a.status === stage.key,
          ).length;
          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="clean-card p-4 text-center"
            >
              <div
                className={`w-10 h-10 rounded-xl ${stage.color} flex items-center justify-center mx-auto`}
              >
                <stage.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-heading font-bold mt-2">{count}</p>
              <p className="text-xs text-muted-foreground">{stage.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        {applications.length === 0 ? (
          <div className="clean-card p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              You haven't applied to any jobs yet.
            </p>
          </div>
        ) : (
          applications.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="clean-card-hover p-5 cursor-pointer block"
            >
              <Link to={`/app/job/${app.jobId}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                    {app.companyLogo || app.company.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold">
                      {app.jobTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {app.company}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    {stages.map((stage, si) => {
                      const currentIndex = stages.findIndex(
                        (s) => s.key === app.status,
                      );
                      const isCompleted = si <= currentIndex;
                      return (
                        <div
                          key={stage.key}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${isCompleted
                                ? stage.color
                                : "bg-muted text-muted-foreground"
                              }`}
                          >
                            <stage.icon className="w-4 h-4" />
                          </div>
                          {si < stages.length - 1 && (
                            <div
                              className={`w-8 h-0.5 ${si < currentIndex ? "bg-primary" : "bg-muted"}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {formatDate(app.appliedAt)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-4" />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
