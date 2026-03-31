import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, Monitor, Users, ArrowLeft, CheckCircle, Loader2, GraduationCap, Phone } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { getCourseById, enrollCourse, getUserEnrollments } from "@/services/api";
import { toast } from "sonner";

export default function CourseDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }
        loadCourse();
    }, [id, user]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const res = await getCourseById(id!);
            setCourse(res.data);

            // Check if already enrolled
            try {
                const enrollRes = await getUserEnrollments();
                const enrollments = enrollRes.data || [];
                const isEnrolled = enrollments.some((e: any) => e.courseId === id);
                setAlreadyEnrolled(isEnrolled);
            } catch { }
        } catch (err) {
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            await enrollCourse(id!);
            setAlreadyEnrolled(true);
            toast.success("Successfully enrolled in this course!");
        } catch (err: any) {
            if (err?.response?.status === 409) {
                setAlreadyEnrolled(true);
                toast.info("You are already enrolled in this course.");
            } else {
                toast.error("Failed to enroll. Please try again.");
            }
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Course not found.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline text-sm">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Course Header */}
                <div className="clean-card p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-orange-400" />

                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-7 h-7 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">{course.title}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                by <span className="text-foreground font-medium">{course.ngo?.name || "NGO"}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {course.mode === "Online" ? <Monitor className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            <span>{course.mode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{course._count?.enrollments || 0} Enrolled</span>
                        </div>
                        {course.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{course.location}</span>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-sm max-w-none text-foreground/80 mb-8">
                        <h3 className="font-heading font-semibold text-foreground text-lg mb-3">About This Course</h3>
                        <p className="whitespace-pre-line leading-relaxed">{course.description}</p>
                    </div>

                    {/* NGO Info */}
                    <div className="bg-muted/50 rounded-xl p-5 mb-8">
                        <h3 className="font-heading font-semibold text-foreground mb-3">Training Provider</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-muted-foreground">Organization:</span> <span className="font-medium text-foreground">{course.ngo?.name}</span></p>
                            <p><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{course.ngo?.email}</span></p>
                            {(course.contactNumber || course.ngo?.phone) && (
                                <p className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Contact:</span>
                                    <span className="font-medium text-foreground flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-primary" />
                                        {course.contactNumber || "N/A"}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Enroll Button */}
                    {alreadyEnrolled ? (
                        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 text-green-600 font-semibold text-sm">
                            <CheckCircle className="w-5 h-5" />
                            You are enrolled in this course
                        </div>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll Now"}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
