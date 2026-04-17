import { motion } from "framer-motion";
import {
    Building2,
    Mail,
    MapPin,
    Globe,
    Phone,
    Edit3,
    Camera,
    Save,
    X,
    Loader2,
    Linkedin,
    Twitter,
    Instagram,
    Calendar,
    Users as UsersIcon,
    Link as LinkIcon
} from "lucide-react";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { getNgoProfile, updateNgoProfile } from "@/services/api";
import { toast } from "sonner";

export default function NgoProfile() {
    const { user } = useAppContext();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
        tagline: "",
        location: "",
        phone: "",
        email: "",
        website: "",
        foundingYear: 0,
        size: "",
        linkedin: "",
        twitter: "",
        instagram: "",
        logoUrl: ""
    });

    const fetchProfile = async () => {
        try {
            const res = await getNgoProfile();
            const data = res.data;
            setProfile(data);
            setEditForm({
                name: user?.name || "",
                description: data.description || "",
                tagline: data.tagline || "",
                location: data.location || "",
                phone: data.phone || "",
                email: data.email || "",
                website: data.website || "",
                foundingYear: data.foundingYear || 0,
                size: data.size || "",
                linkedin: data.linkedin || "",
                twitter: data.twitter || "",
                instagram: data.instagram || "",
                logoUrl: data.logoUrl || ""
            });
        } catch (err) {
            console.error("Failed to fetch NGO profile", err);
            toast.error("Could not load profile data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user?.name]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Clean up submission object - only send fields that are valid
            const submission: any = { ...editForm };
            const year = Number(editForm.foundingYear);

            if (!year || year < 1800 || year > new Date().getFullYear()) {
                delete submission.foundingYear;
            } else {
                submission.foundingYear = year;
            }

            const res = await updateNgoProfile(submission);
            setProfile(res.data);
            setIsEditing(false);
            toast.success("Profile updated successfully");
            // If name changed, we might need a page refresh or context update
            if (editForm.name !== user?.name) {
                window.location.reload();
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            name: user?.name || "",
            description: profile.description || "",
            tagline: profile.tagline || "",
            location: profile.location || "",
            phone: profile.phone || "",
            email: profile.email || "",
            website: profile.website || "",
            foundingYear: profile.foundingYear || 0,
            size: profile.size || "",
            linkedin: profile.linkedin || "",
            twitter: profile.twitter || "",
            instagram: profile.instagram || "",
            logoUrl: profile.logoUrl || ""
        });
        setIsEditing(false);
    };

    if (loading) {
        return <Loader message="Loading organization profile..." />;
    }

    return (
        <div className="space-y-6 max-w-4xl w-full px-0 sm:px-0 mx-auto mobile-content-padding md:pb-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-1 flex items-center justify-between"
            >
                <h1 className="text-2xl sm:text-3xl font-heading font-bold">
                    NGO <span className="text-primary">Profile</span>
                </h1>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCancel}
                            className="p-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground"
                            disabled={saving}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary py-2.5 px-6 flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {saving ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary flex items-center gap-2 py-2.5 px-6 shadow-lg shadow-primary/20"
                    >
                        <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="clean-card p-4 sm:p-8 overflow-hidden relative"
            >
                {/* Branding Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
                    <div className="relative group">
                        {editForm.logoUrl || profile?.logoUrl ? (
                            <img
                                src={editForm.logoUrl || profile.logoUrl}
                                alt={editForm.name}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] object-cover shadow-2xl border-4 border-background ring-1 ring-border/50"
                            />
                        ) : (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-3xl sm:text-4xl font-heading font-bold text-white shadow-2xl">
                                {(editForm.name || user?.name || "N")[0].toUpperCase()}
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-8 h-8 text-white" />
                                <input
                                    type="text"
                                    value={editForm.logoUrl}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    placeholder="Logo URL"
                                    title="Enter Logo URL"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div className="space-y-2">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="text-2xl sm:text-3xl font-heading font-bold bg-muted/50 border border-primary/20 rounded-xl px-4 py-2 w-full outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                        placeholder="NGO Name"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.tagline}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                                        className="text-base text-primary/80 font-medium bg-muted/30 border border-border/50 rounded-lg px-3 py-1.5 w-full outline-none focus:border-primary/30"
                                        placeholder="Tagline (e.g. Empowering through education)"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
                                        {user?.name || "NGO Name"}
                                    </h2>
                                    {profile?.tagline && (
                                        <p className="text-base text-primary font-semibold italic opacity-80">
                                            "{profile.tagline}"
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-muted-foreground font-medium pt-2">
                            <span className="flex items-center gap-2.5">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                        className="bg-muted/50 border border-border/50 rounded-lg px-2 py-1 flex-1 text-xs"
                                        placeholder="Location"
                                    />
                                ) : (profile?.location || "Location not set")}
                            </span>
                            <span className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                {user?.email}
                            </span>
                            <span className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="bg-muted/50 border border-border/50 rounded-lg px-2 py-1 flex-1 text-xs"
                                        placeholder="Phone"
                                    />
                                ) : (profile?.phone || "Phone not set")}
                            </span>
                            <span className="flex items-center gap-2.5">
                                <Globe className="w-4 h-4 text-primary shrink-0" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.website}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                                        className="bg-muted/50 border border-border/50 rounded-lg px-2 py-1 flex-1 text-xs"
                                        placeholder="Website URL"
                                    />
                                ) : (profile?.website ? <a href={profile.website} target="_blank" className="hover:text-primary transition-colors truncate">{profile.website.replace(/^https?:\/\//, "")}</a> : "Not set")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-5 rounded-[1.5rem] bg-muted/30 border border-border/40 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                            Profile Strength Index
                        </span>
                        <span className="text-sm text-primary font-black">
                            {profile?.profileStrength || 0}%
                        </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-background/50 overflow-hidden border border-border/20 p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${profile?.profileStrength || 0}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-primary to-orange-500 shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: About & Mission */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="clean-card p-6 min-h-[250px]"
                    >
                        <h3 className="font-heading font-bold flex items-center gap-3 text-lg mb-6">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Building2 className="w-5 h-5" />
                            </div>
                            Organization Profile
                        </h3>
                        {isEditing ? (
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                className="bg-muted/50 border border-border/50 rounded-2xl p-5 w-full min-h-[180px] outline-none focus:border-primary/50 text-sm leading-relaxed"
                                placeholder="Describe your NGO's mission, impact, and history..."
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                                {profile?.description || "Build trust with job seekers and partners by describing your organization's mission and accomplishments."}
                            </p>
                        )}
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="clean-card p-6"
                    >
                        <h3 className="font-heading font-bold flex items-center gap-3 text-lg mb-6">
                            <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            Connect & Socials
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: "linkedin", icon: Linkedin, color: "text-[#0077B5]", label: "LinkedIn", placeholder: "https://linkedin.com/company/..." },
                                { id: "twitter", icon: Twitter, color: "text-[#1DA1F2]", label: "Twitter", placeholder: "https://twitter.com/..." },
                                { id: "instagram", icon: Instagram, color: "text-[#E4405F]", label: "Instagram", placeholder: "https://instagram.com/..." },
                                { id: "contact_email", icon: Mail, color: "text-primary", label: "Public Contact Info", field: "email", placeholder: "contact@ngo.org" },
                            ].map((social) => (
                                <div key={social.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/40 group hover:border-primary/20 transition-colors">
                                    <social.icon className={`w-5 h-5 ${social.color} shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{social.label}</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={(editForm as any)[social.field || social.id]}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, [social.field || social.id]: e.target.value }))}
                                                className="bg-transparent border-none border-b border-border/30 rounded-none px-0 py-0.5 w-full outline-none focus:border-primary text-xs font-semibold"
                                                placeholder={social.placeholder}
                                            />
                                        ) : (
                                            <p className="text-xs font-bold truncate">
                                                {(profile as any)[social.field || social.id] || "Not linked"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Key Details */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="clean-card p-6"
                    >
                        <h3 className="font-heading font-bold flex items-center gap-3 text-lg mb-6">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            Background
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Founding Year</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.foundingYear || ""}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, foundingYear: Number(e.target.value) }))}
                                        className="bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 w-full outline-none focus:border-primary text-sm font-bold"
                                        placeholder="YYYY"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/30">
                                        <Calendar className="w-5 h-5 text-primary/60" />
                                        <span className="text-sm font-bold">{profile?.foundingYear || "Not recorded"}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Estimated Size</label>
                                {isEditing ? (
                                    <select
                                        value={editForm.size}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, size: e.target.value }))}
                                        className="bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 w-full outline-none focus:border-primary text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Size</option>
                                        <option value="1-10 Employees">1-10 Volunteers</option>
                                        <option value="11-50 Employees">11-50 Members</option>
                                        <option value="51-200 Employees">51-200 Organization</option>
                                        <option value="201-500 Employees">201-500 Scale</option>
                                        <option value="500+ Employees">500+ Large NGO</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/30">
                                        <UsersIcon className="w-5 h-5 text-primary/60" />
                                        <span className="text-sm font-bold">{profile?.size || "Size unknown"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Tools */}
                    <div className="clean-card p-6 bg-primary/5 border-primary/10">
                        <p className="text-[10px] font-black uppercase text-primary mb-4 tracking-tighter">Engagement Tools</p>
                        <div className="space-y-3">
                            <button className="w-full btn-primary py-3 rounded-2xl text-xs font-bold ring-offset-background hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Post New Training
                            </button>
                            <button className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-xs font-bold hover:bg-muted transition-colors">
                                View Enrolled Students
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

