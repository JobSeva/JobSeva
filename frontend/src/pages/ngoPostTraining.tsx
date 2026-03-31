import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, Video, MapPin, Image as ImageIcon, Save, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createCourse, getCourseById, updateCourse } from "@/services/api";
import { toast } from "sonner";

const categories = [
    "Web Development",
    "Data Science",
    "Digital Marketing",
    "Graphic Design",
    "Accounting",
    "Communication Skills",
    "Soft Skills",
    "Other"
];

export default function NgoPostTraining() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditBus = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        mode: "Online",
        category: "Web Development",
        image: "",
        location: "",
        contactNumber: "",
        status: "published"
    });

    useEffect(() => {
        if (isEditBus) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const res = await getCourseById(id!);
            const course = res.data;
            setFormData({
                title: course.title,
                description: course.description,
                duration: course.duration,
                mode: course.mode,
                category: course.category || "Web Development",
                image: course.image || "",
                location: course.location || "",
                contactNumber: course.contactNumber || "",
                status: course.status || "published"
            });
        } catch {
            toast.error("Failed to load course data");
            navigate("/app/ngo/courses");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (status: string = "published") => {
        if (!formData.title) return toast.error("Course title is required");

        setSubmitting(true);
        try {
            const payload = { ...formData, status };
            if (isEditBus) {
                await updateCourse(id!, payload);
                toast.success("Course updated successfully!");
            } else {
                await createCourse(payload);
                toast.success(`Course ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
            }
            navigate("/app/ngo/courses");
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link to="/app/ngo/courses" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4" /> Back to My Courses
                    </Link>
                    <h1 className="text-3xl font-heading font-bold text-foreground">
                        {isEditBus ? "Edit" : "Post"} <span className="text-secondary text-orange-500">Training</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isEditBus ? "Update your existing course details" : "Create a new professional training program"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="clean-card p-6 space-y-5">
                        <div>
                            <label className="text-sm font-heading font-medium mb-2 block">Course Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Full Stack Web Development"
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-heading font-medium mb-2 block">Description</label>
                            <textarea
                                rows={6}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the course curriculum, learning outcomes, etc..."
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-heading font-medium mb-2 block">Duration</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g. 3 Months / 12 Weeks"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-heading font-medium mb-2 block">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-heading font-medium mb-2 block">Training Location</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Mumbai, India / Hybrid"
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10"
                                    />
                                    <MapPin className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-heading font-medium mb-2 block">Contact Number</label>
                                <input
                                    type="text"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    placeholder="e.g. +91 9988776655"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Mode & Visuals */}
                    <div className="clean-card p-6 space-y-6">
                        <div>
                            <label className="text-sm font-heading font-medium mb-3 block">Training Mode</label>
                            <div className="flex flex-col gap-2">
                                {["Online", "Offline"].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mode: m })}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${formData.mode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
                                    >
                                        {m === "Online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-heading font-medium mb-3 block">Course Banner URL</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10"
                                />
                                <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                            </div>
                            {formData.image && (
                                <div className="mt-3 rounded-xl overflow-hidden aspect-video border border-border">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSubmit("published")}
                            disabled={submitting}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> {isEditBus ? "Update Course" : "Publish Course"}</>}
                        </button>
                        <button
                            onClick={() => handleSubmit("draft")}
                            disabled={submitting}
                            className="w-full py-4 rounded-2xl border border-border text-foreground font-heading font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save as Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
