import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Calendar, Award, Save, School } from "lucide-react";
import Loader from "@/components/Loader";

interface EducationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function EducationFormModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: EducationFormModalProps) {
  const [formData, setFormData] = useState({
    school: initialData?.school || "",
    degree: initialData?.degree || "",
    field: initialData?.field || "",
    startYear: initialData?.startYear || 2020,
    endYear: initialData?.endYear || 2024,
    grade: initialData?.grade || "",
  });
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submissionData = {
        ...formData,
        school: formData.school.trim(),
        degree: formData.degree.trim(),
        field: formData.field.trim(),
        startYear: parseInt(formData.startYear.toString()),
        endYear: parseInt(formData.endYear.toString()),
      };
      await onSave(submissionData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              < GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold">
                {initialData ? "Edit" : "Add"} <span className="text-primary">Education</span>
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Academic History</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">School / University</label>
            <div className="relative group">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                required
                type="text"
                placeholder="e.g. University of Mumbai"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Degree</label>
              <div className="relative group">
                < GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Bachelor of Science"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Field of Study</label>
              <div className="relative group">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Start Year</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="number"
                  placeholder="2020"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">End Year</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="number"
                  placeholder="2024"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.endYear}
                  onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Grade (Optional)</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors flex items-center justify-center font-bold text-xs">
                A+
              </div>
              <input
                type="text"
                placeholder="e.g. 3.8 / 4.0 or 85%"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
              {initialData ? "Update" : "Save"} Education
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
