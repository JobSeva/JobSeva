import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen, Clock, Globe, ArrowRight, Star, Heart, Loader2, ChevronDown, LayoutGrid, List, CheckCircle2, MapPin, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getAllCourses, enrollCourse } from "@/services/api";
import { useAppContext } from "@/contexts/AppContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

const categories = [
    { name: "Web Development", icon: "💻" },
    { name: "Data Science", icon: "📊" },
    { name: "Digital Marketing", icon: "🎯" },
    { name: "Graphic Design", icon: "🎨" },
    { name: "Accounting", icon: "💰" },
    { name: "Communication Skills", icon: "🗣️" },
    { name: "Soft Skills", icon: "🧠" },
    { name: "Other", icon: "🚀" }
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
};

export default function TrainingPage() {
    const { user } = useAppContext();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedMode, setSelectedMode] = useState("All");
    const [sortBy, setSortBy] = useState("Latest");

    const { pathname } = useLocation();
    const isAppView = pathname.startsWith("/app");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await getAllCourses();
            // Backend returns { success: true, data: courses[] }
            if (res && Array.isArray(res.data)) {
                setCourses(res.data);
            } else if (Array.isArray(res)) {
                setCourses(res);
            } else {
                setCourses([]);
            }
        } catch (err) {
            console.error("Fetch courses error:", err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId: string) => {
        if (!user) {
            window.location.href = "/login";
            return;
        }
        if (user.role !== "seeker") {
            alert("Only job seekers can enroll in training programs.");
            return;
        }

        setEnrollingId(courseId);
        try {
            await enrollCourse(courseId);
            alert("Successfully enrolled in the program!");
            fetchCourses();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to enroll. You might already be enrolled.");
        } finally {
            setEnrollingId(null);
        }
    };

    const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => {
        if (!course) return false;

        const titleMatch = (course.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        const ngoMatch = (course.ngo?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSearch = titleMatch || ngoMatch;
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        const matchesMode = selectedMode === "All" || course.mode === selectedMode;

        return matchesSearch && matchesCategory && matchesMode;
    });

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortBy === "Latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "Popular") return (b._count?.enrollments || 0) - (a._count?.enrollments || 0);
        return 0;
    });

    return (
        <div className={`min-h-screen bg-background ${isAppView ? "pb-10" : "pt-20"}`}>
            {!isAppView && <PublicNavbar />}
            {/* Dark Modern Hero */}
            <section className="relative py-24 px-4 overflow-hidden bg-[#0A0118]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl opacity-50" />
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary text-xs font-bold uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-primary" /> Future-Proof Your Career
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight">
                        Master New Skills with <br /><span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Expert Training</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Industry-recognized certifications and professional programs from top NGOs to help you land your dream job.
                    </motion.p>
                </div>
            </section>

            {/* Advanced Search & Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-card/80 backdrop-blur-2xl border border-border/50 rounded-3xl p-4 shadow-2xl flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a course or NGO..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/30 border border-border/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-muted/30 border border-border/50 rounded-2xl px-4 py-4 text-sm font-bold outline-none cursor-pointer hover:bg-muted/50 transition-all text-foreground"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>

                        <select
                            value={selectedMode}
                            onChange={(e) => setSelectedMode(e.target.value)}
                            className="bg-muted/30 border border-border/50 rounded-2xl px-4 py-4 text-sm font-bold outline-none cursor-pointer hover:bg-muted/50 transition-all text-foreground"
                        >
                            <option value="All">All Modes</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-muted/30 border border-border/50 rounded-2xl px-4 py-4 text-sm font-bold outline-none cursor-pointer hover:bg-muted/50 transition-all text-foreground"
                        >
                            <option value="Latest">Latest First</option>
                            <option value="Popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-6">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === "All" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}
                    >
                        🚀 All Access
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat.name ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Matrix */}
            <section className="max-w-7xl mx-auto px-4 mt-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 1, 2, 3, 4].map(i => (
                            <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : sortedCourses.length === 0 ? (
                    <div className="clean-card p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                            <Filter className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold">No programs match your search</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">Try adjusting your filters or search keywords to find the right training for you.</p>
                        <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSelectedMode("All"); }} className="btn-primary px-8 py-3 mt-4">Clear All Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {sortedCourses.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    layout
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="group relative flex flex-col h-full bg-card border border-border/50 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                                >
                                    {/* Card Visual Header */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                        {/* Status Badges */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest text-foreground shadow-sm">
                                                {course.mode === 'Online' ? <Globe className="w-3 h-3 text-primary" /> : <MapPin className="w-3 h-3 text-secondary" />}
                                                {course.location || course.mode}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                                                {course.category}
                                            </span>
                                        </div>

                                        {/* Rating & Heart */}
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-destructive hover:border-destructive transition-all">
                                                <Heart className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                                            <div className="flex text-yellow-400">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-white text-xs font-bold ml-1">{course.rating || 4.5}</span>
                                            </div>
                                            <span className="text-white/80 text-[10px] font-medium">(250+ reviews)</span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {course.ngo?.name?.[0]?.toUpperCase() || "N"}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-1">
                                                {course.ngo?.name || "JobSeva Partner"}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-heading font-extrabold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-4">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mt-auto pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-secondary text-orange-500" />
                                                <span className="text-foreground">{course._count?.enrollments || 0} enrolled</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-6">
                                            <Link
                                                to={isAppView ? `/app/course/${course.id}` : `/login`}
                                                className="flex-1 py-3 rounded-xl bg-muted font-bold text-foreground text-xs flex items-center justify-center gap-2 border border-border/50 hover:bg-muted/80 transition-all"
                                            >
                                                Details <ArrowRight className="w-3 h-3" />
                                            </Link>
                                            <button
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={enrollingId === course.id}
                                                className="flex-[1.5] py-3 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                                            >
                                                {enrollingId === course.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enroll Now"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* Newsletter Section */}
            <section className="max-w-6xl mx-auto px-4 mt-32">
                <div className="clean-card p-12 bg-gradient-to-br from-[#120128] to-[#0A0118] border-primary/20 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
                    <h2 className="text-3xl font-heading font-bold text-white mb-4">Don't miss out on new <span className="text-primary">programs</span></h2>
                    <p className="text-muted-foreground max-w-lg mb-8 font-medium">Get notified whenever a new certified training program is launched in your area.</p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                        <button className="btn-primary py-4 px-8 rounded-2xl shadow-xl shadow-primary/20">Subscribe</button>
                    </div>
                    <div className="flex items-center gap-6 mt-10">
                        <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Partners
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Professional Certification
                        </div>
                    </div>
                </div>
            </section>

            {!isAppView && <PublicFooter />}
        </div>
    );
}

// Add these to icons imports if missing:
// import { MapPin } from "lucide-react";
