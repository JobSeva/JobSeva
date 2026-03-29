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
import { Link } from "react-router-dom";
import api from "@/lib/api";

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

export default function CompanyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentCandidates, setRecentCandidates] = useState<ApplicantView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, jobsRes] = await Promise.all([
          api.get("/company/dashboard"),
          api.get("/company/jobs?limit=5"),
        ]);

        if (dashRes.data?.success) {
          setData(dashRes.data.data);
        }

        if (jobsRes.data?.success) {
          const jobsData = jobsRes.data.data.items || [];
          let allApplicants: ApplicantView[] = [];

          for (const job of jobsData) {
            try {
              const applicantsRes = await api.get(
                `/company/jobs/${job.id}/applicants`,
              );
              if (applicantsRes.data?.success && applicantsRes.data.data) {
                allApplicants = [...allApplicants, ...applicantsRes.data.data];
              }
            } catch (e) {
              // ignore individual job failure
            }
          }

          allApplicants.sort(
            (a, b) =>
              new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
          );
          setRecentCandidates(allApplicants.slice(0, 3));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      label: "Active Jobs",
      value: data.activeJobs.toString(),
      change: "+2 this month",
      icon: Briefcase,
      variant: "purple" as const,
    },
    {
      label: "Total Applicants",
      value: data.totalApplicants.toString(),
      change: "+34 this week",
      icon: Users,
      variant: "orange" as const,
    },
    {
      label: "Hire Rate",
      value: `${data.hireRate?.toFixed(1) || 0}%`,
      change: "+5% vs last month",
      icon: TrendingUp,
      variant: "aqua" as const,
    },
    {
      label: "Pipeline Active",
      value: (data.interviewApplicants + data.shortlistedApplicants).toString(),
      change: "+12 this week",
      icon: Eye,
      variant: "purple" as const,
    },
  ];

  // Using real chart data provided from backend
  const chartData = data.chartData || [];

  const hiringData = data.hiringData || [];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">
            Company <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your hiring pipeline
          </p>
        </div>
        <Link
          to="/app/company/post-job"
          className="btn-primary flex items-center gap-2"
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
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <div
                className={`p-2 rounded-xl ${
                  stat.variant === "purple"
                    ? "bg-primary/10 text-primary"
                    : stat.variant === "orange"
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-5"
        >
          <h3 className="font-heading font-semibold mb-4">
            Weekly Applications
          </h3>
          <ResponsiveContainer width="100%" height={200}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-5"
        >
          <h3 className="font-heading font-semibold mb-4">Hiring Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
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
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg">
            Recent Candidates
          </h3>
          <Link
            to="/app/company/applicants"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <div className="clean-card p-8 text-center text-muted-foreground">
            No recent candidates across your open positions.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCandidates.map((c, i) => (
              <motion.div
                key={c.applicationId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="clean-card-hover p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-heading font-bold text-primary">
                    {c.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-heading font-semibold text-sm truncate">
                      {c.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.headline || "Applicant"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1 overflow-hidden flex-wrap max-w-[70%]">
                    {c.skills.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground truncate max-w-full"
                      >
                        {s}
                      </span>
                    ))}
                    {c.skills.length > 2 && (
                      <span className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                        +{c.skills.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {c.matchScore}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
