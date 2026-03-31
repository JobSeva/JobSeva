import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Users, Loader2, BookOpen, Search, Filter, MoreVertical, FileText, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getNgoCourses, deleteCourse } from "@/services/api";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function NgoCourses() {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const ngoId = user?.id || "ngo-mock-id";

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await getNgoCourses(ngoId);
            setCourses(res.data || []);
        } catch {
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await deleteCourse(id);
            setCourses(courses.filter((c) => c.id !== id));
            toast.success("Course deleted successfully");
        } catch {
            toast.error("Failed to delete course");
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold">My <span className="text-primary tracking-tight">Courses</span></h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor all your training programs</p>
                </div>
                <Link to="/app/ngo/post-training" className="btn-primary py-3 px-6 flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                    <Plus className="w-5 h-5" /> Post New Training
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search courses by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading courses...</p>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="clean-card p-16 text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-heading font-bold">No courses found</h3>
                    <p className="text-muted-foreground">
                        {searchTerm ? "No courses match your search criteria." : "You haven't posted any training courses yet. Start by creating your first one!"}
                    </p>
                    {!searchTerm && (
                        <Link to="/app/ngo/post-training" className="inline-block btn-primary px-8 py-3 mt-4">
                            Create First Course
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="clean-card group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-border/60"
                            >
                                <div className="relative h-40 overflow-hidden rounded-t-2xl">
                                    {course.image ? (
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                            <BookOpen className="w-10 h-10 text-primary/40" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/90 backdrop-blur-md text-[10px] font-bold text-foreground border border-border/50">
                                        {course.category || "General"}
                                    </div>
                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold border ${course.status === 'draft' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                                        {course.status === 'draft' ? 'DRAFT' : 'LIVE'}
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div>
                                        <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.duration}</span>
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course._count?.enrollments || 0} Enrolled</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/app/ngo/post-training/${course.id}`)}
                                                className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                                title="Edit Course"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                                title="Delete Course"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <Link to={`/app/course/${course.id}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group/link">
                                            Preview Course <ChevronRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
