import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  DollarSign,
  Plus,
  X,
  Lightbulb,
  Wand2,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";

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
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [type, setType] = useState("Full-time");
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      await api.post("/company/jobs", {
        title,
        description,
        location,
        salaryMin: parseInt(salaryMin) || 0,
        salaryMax: parseInt(salaryMax) || 0,
        type: type.toLowerCase().replace("-", ""),
        remote: location.toLowerCase().includes("remote"),
        skills: selectedSkills,
        responsibilities: [],
      });
      navigate("/app/company/jobs");
    } catch (e) {
      console.error("Failed to post job", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Post a <span className="text-primary">New Job</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a job listing with AI-powered suggestions
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="clean-card p-6 space-y-6"
      >
        <div>
          <label className="text-sm font-heading font-medium mb-2 block">
            Job Title
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Back Office Executive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="AI Suggest"
            >
              <Wand2 className="w-4 h-4" />
            </button>
          </div>
          {title.length > 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2"
            >
              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">AI Tip:</span>{" "}
                Consider adding seniority level and team context for 40% more
                qualified applicants
              </p>
            </motion.div>
          )}
        </div>

        <div>
          <label className="text-sm font-heading font-medium mb-2 block">
            Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-heading font-medium mb-2 block">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="City, State or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-body"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-heading font-medium mb-2 block">
              Salary Range
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Min"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-body"
                />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Max"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-body"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-warning" /> Market average:
              ₹3.5L – ₹6L
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-heading font-medium mb-2 block">
            Job Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {["Full-time", "Part-time", "Contract", "Freelance"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl border border-border text-sm transition-all ${
                  type === t
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-heading font-medium mb-2 block">
            Required Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  selectedSkills.includes(skill)
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {selectedSkills.includes(skill) ? (
                  <X className="w-3 h-3 inline mr-1" />
                ) : (
                  <Plus className="w-3 h-3 inline mr-1" />
                )}
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handlePublish}
            disabled={loading}
            className="btn-primary flex-1 py-3 flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Publish Job"
            )}
          </button>
          <button className="px-6 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            Save Draft
          </button>
        </div>
      </motion.div>
    </div>
  );
}
