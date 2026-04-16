import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mail, BookOpen, Calendar, Loader2, Search, Filter, Download, User } from "lucide-react";
import { getNgoCourses, getCourseEnrollments } from "@/services/api";
import { useAppContext } from "@/contexts/AppContext";
import Loader from "@/components/Loader";

export default function NgoEnrollments() {
    const { user } = useAppContext();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const ngoId = user?.id || "ngo-mock-id";

    useEffect(() => {
        fetchAllEnrollments();
    }, []);

    const fetchAllEnrollments = async () => {
        setLoading(true);
        try {
            // First get all courses by this NGO
            const res = await getNgoCourses(ngoId);
            const courses = res.data || [];

            // Then fetch enrollments for each course in parallel
            const allEnrollmentsPromises = courses.map((c: any) => getCourseEnrollments(c.id));
            const results = await Promise.all(allEnrollmentsPromises);

            // Flatten and add course info to each enrollment
            const flattened = results.flatMap((res: any, index) =>
                (res.data || []).map((e: any) => ({
                    ...e,
                    courseName: courses[index].title
                }))
            );

            // Sort by date descending
            flattened.sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());

            setEnrollments(flattened);
        } catch (err) {
            setEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = enrollments.filter(e =>
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Student <span className="text-primary">Enrollments</span></h1>
                    <p className="text-muted-foreground mt-1">Track and manage students across all your programs</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-card border border-border text-foreground font-heading font-bold hover:bg-muted transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search students or programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                </div>
                <button className="px-5 py-3 rounded-2xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filter by Date
                </button>
            </div>

            {loading ? (
                <Loader message="Syncing student enrollments..." />
            ) : filtered.length === 0 ? (
                <div className="clean-card p-16 text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-4">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-heading font-bold">No students found</h3>
                    <p className="text-muted-foreground">
                        {searchTerm ? "No enrollments match your current search criteria." : "Once students start enrolling in your courses, they will appear here with their details."}
                    </p>
                </div>
            ) : (
                <div className="clean-card overflow-hidden border border-border/60">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Info</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Course Name</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Enrollment Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map((enrollment) => (
                                    <motion.tr
                                        key={enrollment.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-muted/10 transition-colors group"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                                    {enrollment.user?.name?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{enrollment.user?.name || "Anonymous User"}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" /> {enrollment.user?.email || "No email provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-secondary text-orange-500" />
                                                <span className="text-sm font-medium text-foreground">{enrollment.courseName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(enrollment.enrolledAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                                Active
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
