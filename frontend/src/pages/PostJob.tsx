import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  DollarSign,
  Plus,
  X,
  Lightbulb,
  Wand2,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  GraduationCap,
  Building,
  LayoutGrid,
  Users2,
  Clock3,
  Globe,
  Briefcase,
  History,
  Smartphone
} from "lucide-react";
import api from "@/lib/api";
import { getCompanyJobById, updateCompanyJob, createJob } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";

const suggestedSkills = [
  "MS Office",
  "Excel",
  "Tally",
  "Communication",
  "Data Entry",
  "SQL",
  "Python",
  "HR",
  "Typing",
  "Filing",
];

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [type, setType] = useState("full-time");
  const [workMode, setWorkMode] = useState<"remote" | "hybrid" | "onsite">("onsite");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("fresher");
  const [openings, setOpenings] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResp, setNewResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    fetchCompanyInfo();
    if (isEdit) {
      fetchJobData();
    }
  }, [id]);

  const fetchCompanyInfo = async () => {
    try {
      const res = await api.get("/company/profile");
      if (res.data?.success) {
        setCompanyInfo(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch company info", e);
    }
  };

  const fetchJobData = async () => {
    setIsLoadingData(true);
    try {
      const res = await getCompanyJobById(id!);
      if (res.success) {
        const data = res.data;
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setSalaryMin(data.salaryMin.toString());
        setSalaryMax(data.salaryMax.toString());
        setType(data.type);
        setWorkMode((data.workMode as any) || "onsite");
        setEducation(data.education || "");
        setExperience(data.experience || "fresher");
        setOpenings(data.openings?.toString() || "1");
        setDeadline(data.deadline ? data.deadline.split("T")[0] : "");
        setSelectedSkills(data.skills || []);
        setResponsibilities(data.responsibilities || []);
      }
    } catch (err) {
      toast.error("Failed to load job details");
      navigate("/app/company/jobs");
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const addResponsibility = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp("");
    }
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title || !description) {
        return toast.error("Job title and description are required");
    }

    try {
      setLoading(true);
      const payload = {
        title,
        description,
        location,
        salaryMin: parseInt(salaryMin) || 0,
        salaryMax: parseInt(salaryMax) || 0,
        type,
        workMode,
        remote: workMode === "remote",
        education,
        experience,
        openings: parseInt(openings) || 1,
        deadline: deadline || undefined,
        skills: selectedSkills,
        responsibilities: responsibilities.length > 0 ? responsibilities : ["Attend team meetings", "Fulfill daily tasks"],
      };

      if (isEdit) {
        await updateCompanyJob(id!, payload);
        toast.success("Job updated successfully!");
      } else {
        await createJob(payload);
        toast.success("Job published successfully!");
      }
      navigate("/app/company/jobs");
    } catch (e: any) {
      console.error("Failed to post job", e);
      // Detailed error message from backend if available
      const message = e.response?.data?.message || e.response?.data?.error || e.message || "Failed to post job";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full px-4 sm:px-6">
      <div className="w-full max-w-6xl py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card p-6 rounded-3xl border border-border shadow-xl shadow-primary/5"
        >
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/app/company/jobs")}
              className="p-3 rounded-2xl border border-border hover:bg-muted hover:border-primary/30 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-3 h-3" /> Recruitment Suite
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight">
                {isEdit ? "Update" : "Publish"} <span className="text-primary">{isEdit ? "Listing" : "Opportunity"}</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm font-medium">
                {isEdit ? "Refine your requirements to attract the best fit." : "Launch a new career path for top talent."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end mr-2 text-right">
                <p className="text-xs font-bold">{companyInfo?.name || "Company"}</p>
                <p className="text-[10px] text-muted-foreground">Active Recruiter</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px]">
                <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center font-heading font-bold text-primary">
                    {companyInfo?.logo ? (
                        companyInfo.logo.length > 3 ? <img src={companyInfo.logo} className="w-full h-full object-cover rounded-[14px]" /> : companyInfo.logo
                    ) : "C"}
                </div>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Details - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-8"
          >
            <section className="clean-card p-8 space-y-8 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <LayoutGrid className="w-24 h-24 text-primary" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase className="w-4 h-4" />
                   </div>
                   <h3 className="font-heading font-bold text-lg">Primary Details</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                      Job Title
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Engineer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-lg font-semibold"
                      />
                      <Wand2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input
                          type="text"
                          placeholder="City, State"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-body"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Monthly Salary (₹)
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <input
                            type="number"
                            placeholder="Min"
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-body"
                          />
                        </div>
                        <span className="text-muted-foreground font-bold">to</span>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            placeholder="Max"
                            value={salaryMax}
                            onChange={(e) => setSalaryMax(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-body"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block font-heading">
                      Role Overview & Description
                    </label>
                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Share what makes this role unique and what the ideal candidate looks like..."
                      className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                 <div className="flex items-center gap-2 mb-6">
                   <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <History className="w-4 h-4" />
                   </div>
                   <h3 className="font-heading font-bold text-lg">Key Responsibilities</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {responsibilities.map((r, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border group hover:border-primary/30 transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      </div>
                      <p className="text-sm font-medium flex-1 text-foreground/80">{r}</p>
                      <button 
                          onClick={() => removeResponsibility(i)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                          <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  {responsibilities.length === 0 && (
                    <div className="text-center py-8 bg-muted/10 rounded-2xl border-dashed border-2 border-border/50">
                       <p className="text-sm text-muted-foreground">No responsibilities added yet.</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <History className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Add a key responsibility..."
                      value={newResp}
                      onChange={(e) => setNewResp(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                      className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-muted/30 border border-border text-sm outline-none focus:border-primary focus:bg-background transition-all"
                    />
                  </div>
                  <button
                    onClick={addResponsibility}
                    type="button"
                    className="p-3.5 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </motion.div>

          {/* Job Settings - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Classification Card */}
            <div className="clean-card p-6 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
               
               <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 block">
                    Job Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: "full-time", label: "Full-time" },
                        { id: "part-time", label: "Part-time" },
                        { id: "contract", label: "Contract" },
                        { id: "internship", label: "Internship" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setType(t.id)}
                        className={`px-3 py-3 rounded-xl border text-[11px] font-bold uppercase tracking-tight transition-all text-center ${
                          type === t.id
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 block">
                    Work Mode
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                        { id: "onsite", label: "On-site", icon: Building },
                        { id: "hybrid", label: "Hybrid", icon: Globe },
                        { id: "remote", label: "Remote", icon: Smartphone },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setWorkMode(m.id as any)}
                        className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center gap-3 ${
                          workMode === m.id
                            ? "bg-secondary/10 text-secondary border-secondary/30"
                            : "bg-muted/30 text-muted-foreground border-border hover:border-secondary/30"
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        {m.label}
                        {workMode === m.id && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Requirements Card */}
            <div className="clean-card p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                            Experience Level
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <select 
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-muted/30 border border-border outline-none focus:border-primary transition-all text-sm font-semibold appearance-none"
                            >
                                <option value="fresher">Fresher / Entry Level</option>
                                <option value="1-3 years">1-3 Years</option>
                                <option value="3-5 years">3-5 Years</option>
                                <option value="5-10 years">5-10 Years</option>
                                <option value="10+ years">10+ Years (Senior)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ArrowLeft className="w-4 h-4 text-muted-foreground -rotate-90" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                            Education Requirement
                        </label>
                        <div className="relative">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <input 
                                type="text"
                                placeholder="e.g. B.Tech, MBA"
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-muted/30 border border-border outline-none focus:border-primary transition-all text-sm font-semibold"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                            Openings
                        </label>
                        <div className="relative">
                            <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                            <input 
                                type="number"
                                value={openings}
                                onChange={(e) => setOpenings(e.target.value)}
                                className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/30 border border-border outline-none focus:border-primary text-sm font-bold"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                            Deadline
                        </label>
                        <div className="relative">
                            <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                            <input 
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/30 border border-border outline-none focus:border-primary text-xs font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Card */}
            <div className="clean-card p-6 space-y-4">
               <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Required Skills
                  </label>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {selectedSkills.length} Selected
                  </span>
               </div>
               <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                      selectedSkills.includes(skill)
                        ? "bg-primary text-white border-primary"
                        : "bg-muted/20 text-muted-foreground border-border hover:bg-muted/40"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Card */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handlePublish}
                disabled={loading}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-heading font-bold text-xl flex justify-center items-center gap-4 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-6 h-6" />
                    {isEdit ? "Update Job Post" : "Post Job"}
                  </>
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                 <button 
                  onClick={() => navigate("/app/company/jobs")}
                  className="py-3.5 rounded-2xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all"
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => navigate("/app/company/jobs")}
                  className="py-3.5 rounded-2xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-all"
                >
                  Preview
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Sparkles className="w-16 h-16 text-primary scale-150 rotate-12" />
               </div>
               <div className="flex items-start gap-4">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Impact Optimized</h4>
                    <p className="text-[10px] leading-relaxed text-muted-foreground/80 font-medium">Complete profiles receive 8x more relevant applicants. Ensure all sectors are detailed for best matching score.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

