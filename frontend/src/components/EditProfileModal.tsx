import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    MapPin,
    Phone,
    Briefcase,
    GraduationCap,
    Globe,
    Linkedin,
    Github,
    Link as LinkIcon,
    Plus,
    Trash2,
    Save
} from "lucide-react";
import Loader from "@/components/Loader";
import {
    updateSeekerProfile,
    addSeekerExperience,
    updateSeekerExperience,
    deleteSeekerExperience,
    addSeekerEducation,
    updateSeekerEducation,
    deleteSeekerEducation
} from "@/services/api";
import ExperienceFormModal from "./profile/ExperienceFormModal";
import EducationFormModal from "./profile/EducationFormModal";
import ConfirmModal from "./profile/ConfirmModal";
import { toast } from "sonner";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
    onUpdate: () => void;
}

type Tab = "basic" | "experience" | "education" | "social";

export default function EditProfileModal({ isOpen, onClose, profile, onUpdate }: EditProfileModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("basic");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});

    // Sub-modal states
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Initialize form data when profile changes or modal opens
    useEffect(() => {
        if (profile) {
            setFormData({
                headline: profile.headline || "",
                bio: profile.bio || "",
                location: profile.location || "",
                phone: profile.phone || "",
                skills: profile.skills || [],
                languages: profile.languages || [],
                linkedinUrl: profile.linkedinUrl || "",
                githubUrl: profile.githubUrl || "",
                portfolioUrl: profile.portfolioUrl || "",
            });
        }
    }, [profile, isOpen]);

    const handleSaveBasic = async () => {
        setIsLoading(true);
        try {
            await updateSeekerProfile(formData);
            onUpdate();
            // We don't close here to allow editing other tabs
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExperience = async (data: any) => {
        setIsLoading(true);
        try {
            if (editingItem) {
                await updateSeekerExperience(editingItem.id, data);
                toast.success("Experience updated!");
            } else {
                await addSeekerExperience(data);
                toast.success("Experience added!");
            }
            onUpdate();
        } catch (error) {
            toast.error("Failed to save experience");
            console.error(error);
        } finally {
            setIsLoading(false);
            setEditingItem(null);
        }
    };

    const handleDeleteExperience = (id: string) => {
        setConfirmAction({
            title: "Delete Experience",
            message: "Are you sure you want to remove this work experience? This action cannot be undone.",
            onConfirm: async () => {
                setIsLoading(true);
                try {
                    await deleteSeekerExperience(id);
                    toast.success("Experience removed");
                    onUpdate();
                } catch (error) {
                    toast.error("Failed to delete experience");
                } finally {
                    setIsLoading(false);
                }
            }
        });
        setIsConfirmOpen(true);
    };

    const handleAddEducation = async (data: any) => {
        setIsLoading(true);
        try {
            if (editingItem) {
                await updateSeekerEducation(editingItem.id, data);
                toast.success("Education updated!");
            } else {
                await addSeekerEducation(data);
                toast.success("Education added!");
            }
            onUpdate();
        } catch (error) {
            toast.error("Failed to save education");
            console.error(error);
        } finally {
            setIsLoading(false);
            setEditingItem(null);
        }
    };

    const handleDeleteEducation = (id: string) => {
        setConfirmAction({
            title: "Delete Education",
            message: "Are you sure you want to remove this education entry? This action cannot be undone.",
            onConfirm: async () => {
                setIsLoading(true);
                try {
                    await deleteSeekerEducation(id);
                    toast.success("Education removed");
                    onUpdate();
                } catch (error) {
                    toast.error("Failed to delete education");
                } finally {
                    setIsLoading(false);
                }
            }
        });
        setIsConfirmOpen(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                    <div>
                        <h2 className="text-xl font-heading font-bold">Edit <span className="text-primary">Profile</span></h2>
                        <p className="text-xs text-muted-foreground font-medium">Customize your professional presence</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 bg-muted/50 border-b border-border overflow-x-auto no-scrollbar">
                    {[
                        { id: "basic", label: "Basic Info", icon: User },
                        { id: "experience", label: "Experience", icon: Briefcase },
                        { id: "education", label: "Education", icon: GraduationCap },
                        { id: "social", label: "Social", icon: Globe },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-background"
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === "basic" && (
                            <motion.div
                                key="basic"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Headline</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Software Engineer | React Specialist"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                                            value={formData.headline}
                                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bio</label>
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm resize-none"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Mumbai, India"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleSaveBasic}
                                        disabled={isLoading}
                                        className="btn-primary w-full py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        {isLoading ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
                                        Save Basic Information
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "experience" && (
                            <motion.div
                                key="experience"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold">Work History</h3>
                                    <button
                                        onClick={() => {
                                            setEditingItem(null);
                                            setIsExpModalOpen(true);
                                        }}
                                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add New
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {profile.experiences?.map((exp: any) => (
                                        <div key={exp.id} className="p-4 rounded-2xl border border-border bg-muted/10 flex items-center justify-between group">
                                            <div>
                                                <h4 className="text-sm font-bold">{exp.title}</h4>
                                                <p className="text-xs text-muted-foreground font-medium">{exp.company} • {exp.period}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(exp);
                                                        setIsExpModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-all"
                                                >
                                                    <Plus className="w-4 h-4 rotate-45 scale-75" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExperience(exp.id)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!profile.experiences || profile.experiences.length === 0) && (
                                        <div className="text-center py-12 rounded-3xl border-2 border-dashed border-border bg-muted/5">
                                            <p className="text-xs text-muted-foreground font-medium italic">No work experience listed</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "education" && (
                            <motion.div
                                key="education"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold">Education History</h3>
                                    <button
                                        onClick={() => {
                                            setEditingItem(null);
                                            setIsEduModalOpen(true);
                                        }}
                                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add New
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {profile.education?.map((edu: any) => (
                                        <div key={edu.id} className="p-4 rounded-2xl border border-border bg-muted/10 flex items-center justify-between group">
                                            <div>
                                                <h4 className="text-sm font-bold">{edu.degree} in {edu.field}</h4>
                                                <p className="text-xs text-muted-foreground font-medium">{edu.school} • {edu.period}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(edu);
                                                        setIsEduModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-all"
                                                >
                                                    <Plus className="w-4 h-4 rotate-45 scale-75" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEducation(edu.id)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!profile.education || profile.education.length === 0) && (
                                        <div className="text-center py-12 rounded-3xl border-2 border-dashed border-border bg-muted/5">
                                            <p className="text-xs text-muted-foreground font-medium italic">No education history listed</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "social" && (
                            <motion.div
                                key="social"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">LinkedIn Profile</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="https://linkedin.com/in/username"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                                            value={formData.linkedinUrl}
                                            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">GitHub Portfolio</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Github className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="https://github.com/username"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Other Portfolio</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <LinkIcon className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="https://yourportfolio.com"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                                            value={formData.portfolioUrl}
                                            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleSaveBasic}
                                        disabled={isLoading}
                                        className="btn-primary w-full py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        {isLoading ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
                                        Save Social Links
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
                    >
                        Done
                    </button>
                </div>

                {/* Submodals */}
                <ExperienceFormModal
                    isOpen={isExpModalOpen}
                    onClose={() => {
                        setIsExpModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSave={handleAddExperience}
                    initialData={editingItem}
                />

                <EducationFormModal
                    isOpen={isEduModalOpen}
                    onClose={() => {
                        setIsEduModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSave={handleAddEducation}
                    initialData={editingItem}
                />

                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={confirmAction?.onConfirm || (() => { })}
                    title={confirmAction?.title || "Confirm Action"}
                    message={confirmAction?.message || "Are you sure?"}
                />
            </motion.div>
        </div>
    );
}
