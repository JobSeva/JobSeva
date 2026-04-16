import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  ArrowRight,
  Plus,
  Loader2,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { getCompanyJobs } from "@/services/api";
import { toast } from "sonner";
import Loader from "@/components/Loader";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
};

interface DashboardData {
  activeJobs: number;
  totalApplicants: number;
  shortlistedApplicants: number;
  interviewApplicants: number;
  hiredApplicants: number;
  hireRate: number;
  chartData?: any[];
  hiringData?: any[];
}

interface ApplicantView {
  applicationId: string;
  name: string;
  email: string;
  headline: string;
  skills: string[];
  status: string;
  matchScore: number;
  appliedAt: string;
}

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  applicants: number;
  postedAt: string;
  active: boolean;
}

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentCandidates, setRecentCandidates] = useState<ApplicantView[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const dashRes = await api.get("/company/dashboard");

      if (dashRes.data?.success) {
        const d = dashRes.data.data;
        setData(d);
        setRecentJobs(d.recentJobs || []);
        setRecentCandidates(d.recentCandidates || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await api.delete(`/company/jobs/${id}`);
      toast.success("Job deleted successfully");
      setRecentJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (isLoading) {
    return <Loader message="Loading company dashboard..." />;
  }

  const stats = [
    {
      label: "Active Jobs",
      value: data.activeJobs.toString(),
      change: "Currently posted",
      icon: Briefcase,
      variant: "purple" as const,
    },
    {
      label: "Total Applicants",
      value: data.totalApplicants.toString(),
      change: "All time total",
      icon: Users,
      variant: "orange" as const,
    },
    {
      label: "Hire Rate",
      value: `${data.hireRate?.toFixed(1) || 0}%`,
      change: "Selection efficiency",
      icon: TrendingUp,
      variant: "aqua" as const,
    },
    {
      label: "Pipeline Active",
      value: (data.interviewApplicants + data.shortlistedApplicants).toString(),
      change: "Shortlisted & Interviews",
      icon: Eye,
      variant: "purple" as const,
    },
  ];

  const chartData = data.chartData || [];
  const hiringData = data.hiringData || [];

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">
            Company <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Visualize your recruiting impact & performance
          </p>
        </div>
        <Link
          to="/app/company/post-job"
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`stat-card stat-card-${stat.variant}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-heading font-bold mt-1">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 mt-1">
                  {stat.change}
                </p>
              </div>
              <div
                className={`p-2.5 rounded-xl ${stat.variant === "purple"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : stat.variant === "orange"
                    ? "bg-warning/10 text-warning border border-warning/20"
                    : "bg-success/10 text-success border border-success/20"
                  }`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-6"
        >
          <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Application Velocity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="applications"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-6"
        >
          <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-secondary" /> Hiring Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hiringData}>
              <defs>
                <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--secondary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--secondary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                allowDecimals={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="hired"
                stroke="hsl(var(--secondary))"
                fill="url(#hiringGrad)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg">
              Recent Job Postings
            </h3>
            <Link
              to="/app/company/jobs"
              className="text-sm text-primary hover:underline flex items-center gap-1 font-bold"
            >
              Manage All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentJobs.length === 0 ? (
              <div className="clean-card p-12 text-center text-muted-foreground bg-muted/20 border-dashed border-2">
                No jobs posted yet. Start hiring today!
              </div>
            ) : (
              recentJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="clean-card-hover p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base">{job.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applicants} Applicants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <Link
                      to={`/app/company/post-job/${job.id}`}
                      className="p-2 rounded-lg bg-muted hover:bg-warning/10 hover:text-warning transition-colors"
                      title="Edit Job"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/app/company/applicants?jobId=${job.id}`}
                      className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
                    >
                      Pipeline <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg">
              Recent Candidates
            </h3>
            <Link
              to="/app/company/applicants"
              className="text-sm text-primary hover:underline flex items-center gap-1 font-bold"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="clean-card p-8 text-center text-muted-foreground bg-muted/20 border-dashed border-2">
              No recent applications found.
            </div>
          ) : (
            <div className="space-y-4">
              {recentCandidates.map((c, i) => (
                <motion.div
                  key={c.applicationId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="clean-card-hover p-4 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-heading font-bold text-primary group-hover:scale-110 transition-transform">
                        {c.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm truncate">
                          {c.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.headline || "Applicant"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {c.matchScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.skills.slice(0, 2).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    {c.skills.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{c.skills.length - 2}</span>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Latest
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

