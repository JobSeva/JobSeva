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
import { useAppContext } from "@/contexts/AppContext";
import { getUserApplications, getRecommendations } from "@/services/api";
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
  const { user } = useAppContext();
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [profileStats, setProfileStats] = useState({
    totalApplications: 0,
    savedJobs: 0,
    profileViews: 124, // Mocked for now
    activeInterviews: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/seeker/profile/dashboard");
        if (res.data?.success) {
          const d = res.data.data;
          setApplications(d.recentApplications || []);
          setRecommendedJobs(d.recommendations || []);
          setProfileStats({
            totalApplications: d.totalApplications,
            savedJobs: d.savedJobsCount,
            profileViews: 124, // Keep mocked for now as per schema
            activeInterviews: d.activeInterviews,
          });
          setChartData(d.chartData || []);
        }
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
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Seeker'}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Your application pipeline is looking active!
          </p>
        </div>
        <Link to="/app/explore" className="btn-primary flex items-center gap-2">
            Find Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Applications",
            value: profileStats.totalApplications.toString(),
            icon: Send,
            color: "text-primary bg-primary/10",
            trend: "Keep going!",
          },
          {
            label: "Saved Jobs",
            value: profileStats.savedJobs.toString(),
            icon: Bookmark,
            color: "text-warning bg-warning/10",
            trend: "Apply soon",
          },
          {
            label: "Active Interviews",
            value: profileStats.activeInterviews.toString(),
            icon: Briefcase,
            color: "text-success bg-success/10",
            trend: "Prepare well",
          },
          {
            label: "Profile Views",
            value: profileStats.profileViews.toString(),
            icon: Eye,
            color: "text-purple-500 bg-purple-500/10",
            trend: "Growing reach",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="clean-card p-4 sm:p-5 group hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <div
                className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  {stat.value}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium pt-2 border-t border-muted/50">
              <TrendingUp className="w-3 h-3 text-success" />
              <span>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-heading font-bold">
                Engagement Overview
              </h2>
              <p className="text-sm text-muted-foreground">
                Your profile visibility over the past week
              </p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.2}
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
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
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold">
              Recent Activity
            </h2>
            <Link
              to="/app/applications"
              className="text-sm text-primary hover:underline flex items-center gap-1 font-bold"
            >
              Full History <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {applications.slice(0, 5).map((app, i) => (
              <div
                key={app.id || i}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {app.companyLogo || app.company?.charAt(0) || "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate transition-colors">
                    {app.jobTitle || "Job Title"}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {app.company || "Company"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                      app.status === "hired"
                        ? "bg-success/20 text-success"
                        : app.status === "interview"
                          ? "bg-primary/20 text-primary"
                          : app.status === "shortlisted"
                            ? "bg-warning/20 text-warning"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-50 grayscale">
                <Send className="w-8 h-8 mb-2" />
                <p className="text-xs text-center">No applications yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-6 lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-heading font-bold">
                 Curated for You
              </h2>
              <p className="text-sm text-muted-foreground">
                Jobs that match your unique skill profile
              </p>
            </div>
            <Link
              to="/app/explore"
              className="text-sm text-primary hover:underline flex items-center gap-1 font-bold"
            >
              Explore Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.slice(0, 3).map((job, i) => (
              <Link
                key={job.id || i}
                to={`/app/job/${job.id}`}
                className="block"
              >
                <div className="group p-5 rounded-2xl border border-border hover:border-primary/20 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-heading font-bold text-primary group-hover:scale-110 transition-transform">
                      {job.companyLogo || job.company?.charAt(0) || "C"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5 font-medium">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 capitalize">
                      <Clock className="w-3.5 h-3.5" /> {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-lg bg-primary/5 text-[10px] font-bold text-primary/80 border border-primary/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
            {recommendedJobs.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10 bg-muted/10 rounded-2xl border-dashed border-2">
                Complete your profile to see tailored recommendations!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
