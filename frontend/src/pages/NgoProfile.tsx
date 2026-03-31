import { motion } from "framer-motion";
import {
    Building2,
    Mail,
    MapPin,
    Globe,
    Phone,
    Edit3,
    Camera,
    Plus,
    BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { getNgoProfile } from "@/services/api";

export default function NgoProfile() {
    const { user } = useAppContext();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getNgoProfile();
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch NGO profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl w-full px-0 sm:px-0 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-1"
            >
                <h1 className="text-2xl sm:text-3xl font-heading font-bold">
                    NGO <span className="text-primary">Profile</span>
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="clean-card p-4 sm:p-6 overflow-hidden"
            >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div className="relative">
                        {profile?.logoUrl ? (
                            <img src={profile.logoUrl} alt={user?.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg" />
                        ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary flex items-center justify-center text-2xl sm:text-3xl font-heading font-bold text-white shadow-lg">
                                {user?.name
                                    ? user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase()
                                    : "N"}
                            </div>
                        )}
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                            <div className="w-full">
                                <h2 className="text-xl sm:text-2xl font-heading font-bold">
                                    {user?.name || "NGO Name"}
                                </h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-primary" /> {profile?.location || "Location not set"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-primary" />{" "}
                                        {user?.email || "ngo@example.com"}
                                    </span>
                                    {profile?.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-4 h-4 text-primary" /> {profile.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 shadow-lg shadow-primary/20">
                                <Edit3 className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Profile Strength
                        </span>
                        <span className="text-xs sm:text-sm text-primary font-black">
                            {profile?.profileStrength || 0}%
                        </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-background overflow-hidden border border-border/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${profile?.profileStrength || 0}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-orange-500 shadow-sm"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="clean-card p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                <Building2 className="w-5 h-5" />
                            </div>
                            About our NGO
                        </h3>
                        <button className="text-xs sm:text-sm text-primary hover:underline font-bold">
                            Edit
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {profile?.description || "Add a description about your organization's mission and goals."}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="clean-card p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-bold flex items-center gap-2.5 text-base sm:text-lg">
                            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                                <Globe className="w-5 h-5" />
                            </div>
                            Online Presence
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                            <Globe className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Official Website</p>
                                <p className="text-sm font-semibold truncate">{profile?.website || "Not linked"}</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Connect</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
