import { motion } from "framer-motion";
import { BarChart3, Users, Briefcase, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", users: 1200, jobs: 340, placements: 45 },
  { month: "Feb", users: 1800, jobs: 420, placements: 62 },
  { month: "Mar", users: 2400, jobs: 510, placements: 78 },
  { month: "Apr", users: 3100, jobs: 580, placements: 95 },
  { month: "May", users: 3800, jobs: 670, placements: 112 },
  { month: "Jun", users: 4500, jobs: 750, placements: 128 },
];

const categoryData = [
  { name: "IT", value: 35 },
  { name: "Finance", value: 20 },
  { name: "HR", value: 15 },
  { name: "Sales", value: 18 },
  { name: "Others", value: 12 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--muted-foreground))"];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
};

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Reports & <span className="text-primary">Analytics</span>
        </h1>
        <p className="text-muted-foreground mt-1">Platform performance overview</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Users", value: "4,500", icon: Users, change: "+18%" },
          { label: "New Jobs", value: "750", icon: Briefcase, change: "+12%" },
          { label: "Placements", value: "128", icon: TrendingUp, change: "+14%" },
          { label: "Revenue", value: "₹12.5L", icon: BarChart3, change: "+22%" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="clean-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10"><s.icon className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-heading font-bold">{s.value}</p>
                <p className="text-xs text-success">{s.change}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="clean-card p-5">
          <h3 className="font-heading font-semibold mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="rpUserGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#rpUserGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="clean-card p-5">
          <h3 className="font-heading font-semibold mb-4">Job Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-xs text-muted-foreground">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="clean-card p-5">
        <h3 className="font-heading font-semibold mb-4">Monthly Placements</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="placements" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
