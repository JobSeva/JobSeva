import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Calendar, AlignLeft, Save } from "lucide-react";
import Loader from "@/components/Loader";

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export default function ExperienceFormModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: ExperienceFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    company: initialData?.company || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    description: initialData?.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submissionData = {
        ...formData,
        title: formData.title.trim(),
        company: formData.company.trim(),
        startDate: formData.startDate.trim(),
        endDate: formData.endDate.trim(),
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
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold">
                {initialData ? "Edit" : "Add"} <span className="text-primary">Experience</span>
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Work History</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Developer"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Company Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors flex items-center justify-center font-bold text-xs">
                  @
                </div>
                <input
                  required
                  type="text"
                  placeholder="e.g. Google"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Start Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Jan 2022"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">End Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Present"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description (Optional)</label>
            <div className="relative group">
              <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <textarea
                rows={3}
                placeholder="What were your key responsibilities and achievements?"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {initialData ? "Update" : "Save"} Experience
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
