import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden p-6 text-center"
      >
        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
          variant === "danger" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        }`}>
          <AlertCircle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium mb-8">
          {message}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl text-sm font-bold border border-border hover:bg-muted transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
              variant === "danger" 
                ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" 
                : "bg-primary hover:bg-primary/90 shadow-primary/20"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
