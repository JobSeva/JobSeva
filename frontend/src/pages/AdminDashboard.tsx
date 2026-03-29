import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "@/lib/api";

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--warning))",
  "hsl(var(--muted-foreground))",
];

const typeIcons: Record<string, React.ElementType> = {
  info: Clock,
  warning: AlertTriangle,
  success: CheckCircle2,
  danger: XCircle,
};
const typeColors: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  danger: "bg-destructive/10 text-destructive",
};

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  placements: number;
  companiesCount: number;
  pieData: { name: string; value: number }[];
  userGrowth: { month: string; users: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      variant: "purple" as const,
    },
    {
      label: "Companies",
      value: stats.companiesCount.toString(),
      icon: Building2,
      variant: "orange" as const,
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs.toLocaleString(),
      icon: Briefcase,
      variant: "aqua" as const,
    },
    {
      label: "Placements",
      value: stats.placements.toString(),
      icon: Trophy,
      variant: "purple" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Admin <span className="text-primary">Overview</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform performance and user metrics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-5 lg:col-span-2"
        >
          <h3 className="font-heading font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.userGrowth || []}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-5 flex flex-col"
        >
          <h3 className="font-heading font-semibold mb-2">System Status</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats.pieData || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-2">
              <span className="text-3xl font-heading font-bold">
                {stats.totalJobs}
              </span>
              <span className="text-xs text-muted-foreground">Total Jobs</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs font-medium">
            {(stats.pieData || []).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index] }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
