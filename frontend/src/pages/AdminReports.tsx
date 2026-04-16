import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Building2,
  Download,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "@/lib/api";
import Loader from "@/components/Loader";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--warning))",
  "hsl(var(--muted-foreground))",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
};

interface ReportsResponse {
  range: string;
  kpis: {
    monthlyUsers: number;
    newJobs: number;
    placements: number;
    activeCompanies: number;
  };
  monthlyData: Array<{
    month: string;
    users: number;
    jobs: number;
    placements: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  placementsData: Array<{
    month: string;
    placements: number;
  }>;
}

export default function AdminReports() {
  const [range, setRange] = useState<"3m" | "6m" | "12m">("6m");
  const [reports, setReports] = useState<ReportsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async (selectedRange: "3m" | "6m" | "12m") => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/reports", {
        params: { range: selectedRange },
      });
      if (res.data?.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load admin reports", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(range);
  }, [range]);

  const statCards = useMemo(
    () => [
      {
        label: "Monthly Users",
        value: reports?.kpis.monthlyUsers.toLocaleString() ?? "0",
        icon: Users,
      },
      {
        label: "New Jobs",
        value: reports?.kpis.newJobs.toLocaleString() ?? "0",
        icon: Briefcase,
      },
      {
        label: "Placements",
        value: reports?.kpis.placements.toLocaleString() ?? "0",
        icon: TrendingUp,
      },
      {
        label: "Active Companies",
        value: reports?.kpis.activeCompanies.toLocaleString() ?? "0",
        icon: Building2,
      },
    ],
    [reports],
  );

  const exportCsv = () => {
    const rows = reports?.monthlyData ?? [];
    const header = "month,users,jobs,placements";
    const lines = rows.map(
      (r) => `${r.month},${r.users},${r.jobs},${r.placements}`,
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-reports-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !reports) {
    return <Loader message="Generating analytical reports..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Reports & <span className="text-primary">Analytics</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform performance overview
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="inline-flex rounded-lg border border-border p-1 bg-card">
          {(["3m", "6m", "12m"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="clean-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-heading font-bold">{s.value}</p>
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
          <h3 className="font-heading font-semibold mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={reports.monthlyData}>
              <defs>
                <linearGradient id="rpUserGrad" x1="0" y1="0" x2="0" y2="1">
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
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                fill="url(#rpUserGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="clean-card p-5"
        >
          <h3 className="font-heading font-semibold mb-4">
            Job Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={reports.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {reports.categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {reports.categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[i] }}
                />
                <span className="text-xs text-muted-foreground">
                  {d.name} ({d.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="clean-card p-5"
      >
        <h3 className="font-heading font-semibold mb-4">Monthly Placements</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={reports.placementsData}>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="placements"
              fill="hsl(var(--success))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
