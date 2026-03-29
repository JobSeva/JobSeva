import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Bookmark,
  Send,
  Eye,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SeekerDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [profileStats, setProfileStats] = useState({
    totalApplications: 0,
    savedJobs: 0,
    profileViews: 124,
    activeInterviews: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes, savedJobsRes] = await Promise.all([
          api.get("/applications"),
          api.get("/jobs?limit=5"),
          api
            .get("/saved-jobs")
            .catch(() => ({ data: { data: { items: [] } } })),
        ]);

        const apps = appsRes.data?.success
          ? appsRes.data.data?.items || []
          : [];
        const jobs = jobsRes.data?.success
          ? jobsRes.data.data?.items || []
          : [];
        const savedJobsCount = savedJobsRes.data?.success
          ? savedJobsRes.data.data?.items?.length || 0
          : 0;

        setApplications(apps);
        setRecommendedJobs(jobs);

        setProfileStats((prev) => ({
          ...prev,
          totalApplications: apps.length,
          activeInterviews: apps.filter((a: any) => a.status === "interview")
            .length,
          savedJobs: savedJobsCount,
        }));

        // Compute chart data dynamically based on recent 7 days of applications
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const computedChartData = days.map((day) => ({
          name: day,
          applications: 0,
          views: 0,
        }));
        apps.forEach((app: any) => {
          if (app.createdAt) {
            const dayName = days[new Date(app.createdAt).getDay()];
            const stat = computedChartData.find((d) => d.name === dayName);
            if (stat) {
              stat.applications += 1;
              stat.views += 2;
            }
          }
        });
        setChartData(computedChartData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
          Welcome back, <span className="text-primary">Seeker</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Here's what's happening with your job search today.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Applications",
            value: profileStats.totalApplications.toString(),
            icon: Send,
            color: "text-primary bg-primary/10",
            trend: "+12% this week",
          },
          {
            label: "Saved Jobs",
            value: profileStats.savedJobs.toString(),
            icon: Bookmark,
            color: "text-warning bg-warning/10",
            trend: "3 closing soon",
          },
          {
            label: "Active Interviews",
            value: profileStats.activeInterviews.toString(),
            icon: Briefcase,
            color: "text-success bg-success/10",
            trend: "1 this week",
          },
          {
            label: "Profile Views",
            value: profileStats.profileViews.toString(),
            icon: Eye,
            color: "text-purple-500 bg-purple-500/10",
            trend: "+24% this month",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="clean-card p-4 sm:p-5"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <div
                className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.color}`}
              >
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  {stat.value}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-heading font-bold">
                Activity Overview
              </h2>
              <p className="text-sm text-muted-foreground">
                Your profile views and application trends
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold">
              Recent Applications
            </h2>
            <Link
              to="/app/applications"
              className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {applications.slice(0, 4).map((app, i) => (
              <div
                key={app.id || i}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                  {app.companyLogo || app.company?.charAt(0) || "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {app.jobTitle || "Job"}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {app.company || "Company"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium capitalize ${
                      app.status === "hired"
                        ? "bg-success/10 text-success"
                        : app.status === "interview"
                          ? "bg-primary/10 text-primary"
                          : app.status === "shortlisted"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {app.status || "Applied"}
                  </span>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No recent applications found.
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-6 lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-heading font-bold">
                Recommended Matches
              </h2>
              <p className="text-sm text-muted-foreground">
                Based on your skills & preferences
              </p>
            </div>
            <Link
              to="/app/explore"
              className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
            >
              Explore More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.slice(0, 3).map((job, i) => (
              <Link
                key={job.jobId || i}
                to={`/app/explore/${job.jobId}`}
                className="block"
              >
                <div className="group p-4 rounded-2xl border border-border hover:border-primary/20 bg-card hover:bg-primary/[0.02] transition-all duration-300 h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary font-heading">
                      {job.companyLogo || job.company?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
            {recommendedJobs.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No recommended jobs currently found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
