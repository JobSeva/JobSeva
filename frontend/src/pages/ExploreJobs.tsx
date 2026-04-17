import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Bookmark,
  LayoutGrid,
  List,
  Wifi,
  DollarSign,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import Loader from "@/components/Loader";

type Job = {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  remote: boolean;
  skills: string[];
  description: string;
  postedAt: string;
};

export default function ExploreJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    // Fetch live jobs from our new Express/Node Backend
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.data);
      } catch (err) {
        console.error("Failed to load live jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    if (remoteOnly && !j.remote) return false;
    if (
      searchQuery &&
      !j.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !j.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumSignificantDigits: 3,
    }).format(amt);
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 mobile-content-padding md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Explore <span className="text-primary">Jobs</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover your next opportunity
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="clean-card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border flex-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Job title, company, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 font-body"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${remoteOnly ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground border border-border hover:text-foreground"}`}
            >
              <Wifi className="w-4 h-4" /> Remote
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            "Data Entry",
            "Back Office",
            "HR",
            "Analyst",
            "Customer Support",
            "Accountant",
          ].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 rounded-lg bg-muted text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} jobs found
        </p>
        <select className="bg-card border border-border rounded-xl px-3 py-1.5 text-sm text-foreground outline-none font-body">
          <option>Newest</option>
          <option>Highest Salary</option>
          <option>Most Relevant</option>
        </select>
      </div>

      {isLoading ? (
        <Loader message="Fetching the best jobs for you..." />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "space-y-3"
          }
        >
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/app/job/${job.id}`}
                className="clean-card-hover p-5 cursor-pointer group block relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-primary before:to-secondary before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold flex-shrink-0">
                    {job.companyLogo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                      <button
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-warning"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add save logic native hook here later
                          api
                            .post(`/saved-jobs/${job.id}`)
                            .then(() => alert("Job Saved!"))
                            .catch(console.error);
                        }}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />{" "}
                        {formatCurrency(job.salaryMin)} -{" "}
                        {formatCurrency(job.salaryMax)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(job.postedAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {job.remote && (
                          <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-xs font-medium">
                            Remote
                          </span>
                        )}
                        {/* Removed hardcoded match score since live data doesn't provide it here yet without ML mapping */}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
