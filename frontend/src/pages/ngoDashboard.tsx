import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, ArrowRight, Plus, GraduationCap, ClipboardList, UserCheck } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { getNgoCourses } from "@/services/api";
import { Link } from "react-router-dom";

export default function NgoDashboard() {
    const { user } = useAppContext();
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalEnrollments: 0
    });
    const [loading, setLoading] = useState(true);

    const ngoId = user?.id || "ngo-mock-id";

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await getNgoCourses(ngoId);
            const courses = res.data || [];
            const enrollmentCount = courses.reduce((sum: number, c: any) => sum + (c._count?.enrollments || 0), 0);

            setStats({
                totalCourses: courses.length,
                totalEnrollments: enrollmentCount
            });
        } catch {
            setStats({ totalCourses: 0, totalEnrollments: 0 });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Active Programs", value: stats.totalCourses, icon: BookOpen, color: "text-primary", bg: "bg-primary/10", link: "/app/ngo/courses" },
        { label: "Total Students", value: stats.totalEnrollments, icon: Users, color: "text-secondary text-orange-500", bg: "bg-orange-500/10", link: "/app/ngo/enrollments" },
    ];

    const quickActions = [
        { title: "Post New Training", desc: "Launch a new professional course", icon: GraduationCap, link: "/app/ngo/post-training", color: "bg-primary" },
        { title: "Manage Courses", desc: "Edit or update existing programs", icon: ClipboardList, link: "/app/ngo/courses", color: "bg-secondary" },
        { title: "View Enrollments", desc: "Track student progress and info", icon: UserCheck, link: "/app/ngo/enrollments", color: "bg-green-500" },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold">NGO <span className="text-primary tracking-tight">Dashboard</span></h1>
                    <p className="text-muted-foreground mt-1 font-medium">Platform overview and quick management</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-foreground truncate uppercase tracking-wider">NGO Profile Active</span>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="clean-card p-8 flex items-center justify-between group hover:border-primary/20 transition-all duration-300"
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-4xl font-heading font-bold text-foreground">
                                {loading ? "..." : stat.value}
                            </p>
                            <Link to={stat.link} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-2">
                                View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className={`w-16 h-16 rounded-3xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions Sections */}
            <div className="space-y-6">
                <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                    Quick <span className="text-primary">Management</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((action, i) => (
                        <Link
                            key={action.title}
                            to={action.link}
                            className="bg-card border border-border rounded-3xl p-6 group hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${action.color} text-white flex items-center justify-center mb-4 shadow-lg shadow-black/5`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-heading font-bold text-lg mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{action.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Platform Banner */}
            <div className="clean-card p-8 bg-gradient-to-r from-primary/5 via-background to-secondary/5 border-primary/10 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-heading font-bold">Empower More <span className="text-primary">Students</span></h3>
                        <p className="text-muted-foreground font-medium max-w-md">Your programs help local job seekers gain critical skills and secure better futures.</p>
                    </div>
                    <Link to="/app/ngo/post-training" className="btn-primary py-4 px-10 rounded-2xl shadow-xl shadow-primary/20">
                        Launch New Program
                    </Link>
                </div>
                {/* Decorative blob */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            </div>
        </div>
    );
}
