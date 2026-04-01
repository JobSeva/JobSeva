import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Briefcase,
    Search,
    Plus,
    MoreVertical,
    MapPin,
    Clock,
    Users,
    ExternalLink,
    Loader2,
    Trash2,
    Edit2
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCompanyJobs } from "@/services/api";
import { toast } from "sonner";
import api from "@/lib/api";

interface Job {
    id: string;
    title: string;
    location: string;
    type: string;
    applicants: number;
    postedAt: string;
    active: boolean;
}

export default function CompanyJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await getCompanyJobs();
            if (res.success) {
                setJobs(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch jobs", err);
            toast.error("Failed to load your jobs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return;
        try {
            await api.delete(`/company/jobs/${id}`);
            toast.success("Job deleted successfully");
            setJobs(prev => prev.filter(j => j.id !== id));
        } catch (err) {
            toast.error("Failed to delete job");
        }
    };

    const filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-heading font-bold">
                        My <span className="text-primary">Posted Jobs</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage and track your active job listings</p>
                </div>
                <Link
                    to="/app/company/post-job"
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Post New Job
                </Link>
            </motion.div>

            <div className="clean-card p-4">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 font-body"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="clean-card p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-heading font-semibold text-lg">No jobs found</h3>
                        <p className="text-muted-foreground">You haven't posted any jobs matching your search.</p>
                    </div>
                    <Link to="/app/company/post-job" className="btn-primary inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Post Your First Job
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredJobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="clean-card-hover p-5"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" /> {formatDate(job.postedAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="capitalize px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold">
                                                    {job.type}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 md:border-l border-border md:pl-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-heading font-bold text-primary">{job.applicants}</p>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Applicants</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/app/job/${job.id}`}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                            title="View Live"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to={`/app/company/post-job/${job.id}`}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-warning transition-colors"
                                            title="Edit Job"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to={`/app/company/applicants?jobId=${job.id}`}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                            title="View Applicants"
                                        >
                                            <Users className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                                            title="Delete Job"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
