import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Loader2,
  Download,
  Building2,
} from "lucide-react";
import api from "@/lib/api";
import { buildCsv, downloadCsv } from "@/lib/csv";

type NgoRecord = {
  userId: string;
  description: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export default function AdminNgos() {
  const [ngos, setNgos] = useState<NgoRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    void fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const res = await api.get("/admin/ngos");
      const list = res.data?.success ? res.data.data : [];
      if (Array.isArray(list)) {
        setNgos(list);
      } else {
        setNgos([]);
      }
    } catch (err) {
      console.error("Failed to load NGOs", err);
      setNgos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportNgos = async () => {
    setIsExporting(true);
    try {
      const res = await api.get("/admin/export/ngos");
      const rows = res.data?.success ? (res.data.data ?? []) : [];
      const csv = buildCsv(rows, ["Name", "Email", "Phone no."]);
      downloadCsv(csv, "ngos.csv");
    } catch (err) {
      console.error("Failed to export NGOs CSV", err);
    } finally {
      setIsExporting(false);
    }
  };

  const filtered = ngos.filter((ngo) => {
    const ngoName = ngo.user?.name ?? "";
    const ngoEmail = ngo.email || ngo.user?.email || "";
    const searchTerm = search.toLowerCase();
    return (
      ngoName.toLowerCase().includes(searchTerm) ||
      ngoEmail.toLowerCase().includes(searchTerm) ||
      (ngo.location || "").toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          NGO <span className="text-primary">Management</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and review NGOs listed on the platform
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border max-w-md w-full">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search NGOs by name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={exportNgos}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export Data
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ngo, i) => {
            const displayName = ngo.user?.name || "Unnamed NGO";
            const displayEmail = ngo.email || ngo.user?.email || "";

            return (
              <motion.div
                key={ngo.userId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="clean-card p-5 flex flex-col h-full"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-xl text-primary flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3
                      className="font-heading font-bold text-lg truncate"
                      title={displayName}
                    >
                      {displayName}
                    </h3>
                    <p
                      className="text-xs text-muted-foreground line-clamp-2"
                      title={ngo.tagline || ngo.description}
                    >
                      {ngo.tagline ||
                        ngo.description ||
                        "No description provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-2 text-sm text-muted-foreground">
                  {ngo.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{ngo.location}</span>
                    </div>
                  )}
                  {displayEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{displayEmail}</span>
                    </div>
                  )}
                  {ngo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{ngo.phone}</span>
                    </div>
                  )}
                  {ngo.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={ngo.website}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate hover:text-primary hover:underline"
                      >
                        {ngo.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full p-12 text-center clean-card flex flex-col items-center">
              <Building2 className="w-12 h-12 mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No NGOs found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
