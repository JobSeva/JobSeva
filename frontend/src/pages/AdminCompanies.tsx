import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Search,
  Trash2,
  Mail,
  Globe,
  MapPin,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";

interface CompanyProfile {
  companyId: string;
  name: string;
  logo: string;
  tagline: string;
  industry: string;
  headquarters: string;
  email: string;
  website: string;
}

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/companies");
      const list = res.data?.success ? res.data.data : res.data;
      if (Array.isArray(list)) {
        setCompanies(list);
      }
    } catch (err) {
      console.error("Failed to load companies", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to completely remove this company from the platform?",
      )
    )
      return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c.companyId !== id));
    } catch (err) {
      console.error("Failed to delete company", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Company <span className="text-primary">Management</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and manage registered companies
        </p>
      </motion.div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search companies by name or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((company, i) => (
            <motion.div
              key={company.companyId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="clean-card p-5 flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-xl text-primary flex-shrink-0">
                  {company.logo || company.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3
                    className="font-heading font-bold text-lg truncate"
                    title={company.name}
                  >
                    {company.name}
                  </h3>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground mb-1">
                    {company.industry}
                  </span>
                  <p
                    className="text-xs text-muted-foreground line-clamp-2"
                    title={company.tagline}
                  >
                    {company.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-auto space-y-2 text-sm text-muted-foreground">
                {company.headquarters && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{company.headquarters}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:text-primary hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-5 pt-4 border-t border-border">
                <button
                  onClick={() => handleReject(company.companyId)}
                  disabled={deletingId === company.companyId}
                  className="flex-1 px-4 py-2 rounded-xl border border-destructive/20 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === company.companyId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Remove Company
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full p-12 text-center clean-card flex flex-col items-center">
              <Building2 className="w-12 h-12 mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No companies found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
