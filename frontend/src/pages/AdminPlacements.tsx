import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Clock, Loader2 } from "lucide-react";
import api from "@/lib/api";
import Loader from "@/components/Loader";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  status: string;
  createdAt: string;
}

export default function AdminPlacements() {
  const [placements, setPlacements] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await api.get("/admin/applications");
      const list = res.data?.success ? res.data.data : [];
      if (Array.isArray(list)) {
        const mapped = list.map((a: any) => ({
          id: a.applicationId || a.id,
          candidateName: a.seeker?.name || "Unknown Candidate",
          company: a.job?.company?.name || a.company || "Unknown Company",
          jobTitle: a.jobTitle || "Unknown Role",
          status: a.status === "hired" ? "confirmed" : "pending",
          createdAt: a.appliedAt || a.createdAt || new Date().toISOString(),
        }));
        setPlacements(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch applications/placements", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <Loader message="Fetching placement records..." />;
  }

  const confirmedCount = placements.filter(
    (p) => p.status === "confirmed",
  ).length;
  const pendingCount = placements.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Placement <span className="text-primary">Tracking</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Track successful placements and applications across the platform
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card stat-card-purple">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Processed</p>
              <p className="text-2xl font-heading font-bold">
                {placements.length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-aqua">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confirmed Hires</p>
              <p className="text-2xl font-heading font-bold">
                {confirmedCount}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-orange">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10 text-warning">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Action</p>
              <p className="text-2xl font-heading font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="clean-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Candidate
                </th>
                <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left p-4 font-heading font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-primary/5 transition-colors"
                >
                  <td className="p-4 font-medium">{p.candidateName}</td>
                  <td className="p-4 text-muted-foreground">{p.company}</td>
                  <td className="p-4 text-muted-foreground">{p.jobTitle}</td>
                  <td className="p-4 text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${p.status === "confirmed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {placements.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No placement records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
