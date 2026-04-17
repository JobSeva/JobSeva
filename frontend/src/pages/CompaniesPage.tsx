import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Users,
  Star,
  ExternalLink,
  Briefcase,
  Building2,
  ArrowLeft,
  Filter,
  ChevronDown,
  Globe,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import PublicNavbar from "@/components/PublicNavbar";
import api, { RAW_BASE_URL } from "@/lib/api";

interface Company {
  name: string;
  logoImg?: string;
  logo: string;
  logoColor: string;
  rating: number;
  reviews: string;
  type: string;
  sector: string[];
  industry: string;
  description: string;
  activeJobs: number;
  headquarters: string;
  employees: string;
  nature: string;
}

type JobItem = {
  companyId?: string;
  company?: string;
  companyLogo?: string;
  location?: string;
  type?: string;
};

const LOGO_BG_COLORS = [
  "bg-slate-800",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-green-700",
  "bg-indigo-700",
  "bg-orange-600",
  "bg-cyan-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-blue-800",
];

const getLogoColor = (companyName: string): string => {
  let hash = 0;
  for (let i = 0; i < companyName.length; i += 1) {
    hash = (hash * 31 + companyName.charCodeAt(i)) >>> 0;
  }
  return LOGO_BG_COLORS[hash % LOGO_BG_COLORS.length];
};

const getInitials = (companyName: string): string => {
  return (
    companyName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "CO"
  );
};

const isImageLikeLogo = (logo?: string): boolean => {
  if (!logo) return false;
  const normalized = logo.toLowerCase();
  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("/") ||
    normalized.includes(".")
  );
};

const normalizeLogoUrl = (logo?: string): string | undefined => {
  if (!logo || !isImageLikeLogo(logo)) return undefined;
  if (logo.startsWith("http://") || logo.startsWith("https://")) {
    return logo;
  }
  if (logo.startsWith("/")) {
    return `${RAW_BASE_URL}${logo}`;
  }
  return `${RAW_BASE_URL}/${logo}`;
};

const sectors = [
  "IT Services",
  "BFSI",
  "Technology",
  "Retail",
  "BPM",
  "Telecom",
  "Healthcare",
  "Energy",
];
const companyTypes = ["Foreign MNC", "Indian MNC", "Corporate", "Startup"];
const natures = ["B2B", "B2C"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4 },
  }),
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedNatures, setSelectedNatures] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/jobs", {
          params: {
            page: 1,
            limit: 100,
            sort: "newest",
          },
        });

        const jobs: JobItem[] = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const byCompany = new Map<
          string,
          {
            name: string;
            logo?: string;
            location?: string;
            jobTypes: Set<string>;
            activeJobs: number;
          }
        >();

        jobs.forEach((job) => {
          const name = (job.company || "").trim();
          if (!name) return;

          const key = job.companyId || name;
          const existing = byCompany.get(key);

          if (existing) {
            existing.activeJobs += 1;
            if (!existing.logo && job.companyLogo) {
              existing.logo = job.companyLogo;
            }
            if (!existing.location && job.location) {
              existing.location = job.location;
            }
            if (job.type) {
              existing.jobTypes.add(job.type);
            }
            return;
          }

          byCompany.set(key, {
            name,
            logo: job.companyLogo,
            location: job.location,
            jobTypes: new Set(job.type ? [job.type] : []),
            activeJobs: 1,
          });
        });

        const mappedCompanies: Company[] = Array.from(byCompany.values())
          .map((entry) => {
            const normalizedLogo = normalizeLogoUrl(entry.logo);
            return {
              name: entry.name,
              logoImg: normalizedLogo,
              logo: normalizedLogo ? "" : getInitials(entry.name),
              logoColor: getLogoColor(entry.name),
              rating: 0,
              reviews: "0",
              type: "Company",
              sector:
                entry.jobTypes.size > 0
                  ? Array.from(entry.jobTypes)
                  : ["Hiring"],
              industry: "",
              description: `Currently hiring for ${entry.activeJobs} role${entry.activeJobs > 1 ? "s" : ""}.`,
              activeJobs: entry.activeJobs,
              headquarters: entry.location || "Not specified",
              employees: "N/A",
              nature: "B2B",
            };
          })
          .sort((a, b) => b.activeJobs - a.activeJobs);

        setCompanies(mappedCompanies);
      } catch (error) {
        console.error("Failed to load companies:", error);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  const toggleFilter = (
    list: string[],
    item: string,
    setter: (val: string[]) => void,
  ) => {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const filtered = companies.filter((c) => {
    const matchSearch =
      !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSector =
      selectedSectors.length === 0 ||
      c.sector.some((s) => selectedSectors.includes(s));
    const matchType =
      selectedTypes.length === 0 || selectedTypes.includes(c.type);
    const matchNature =
      selectedNatures.length === 0 || selectedNatures.includes(c.nature);
    return matchSearch && matchSector && matchType && matchNature;
  });

  const totalFilters =
    selectedSectors.length + selectedTypes.length + selectedNatures.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
            Featured companies{" "}
            <span className="text-primary">actively hiring</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} companies
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="clean-card p-5">
                <h3 className="font-heading font-semibold text-sm mb-3">
                  All Filters
                </h3>

                {/* Search */}
                <div className="relative mb-5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/50 focus:bg-background focus:border-primary outline-none text-xs"
                  />
                </div>

                {/* Sector */}
                <div className="mb-5">
                  <h4 className="text-xs font-heading font-semibold text-foreground mb-2.5 uppercase tracking-wider">
                    Sector
                  </h4>
                  <div className="space-y-1.5">
                    {sectors.map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-2 cursor-pointer group hover:translate-x-1 transition-transform duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSectors.includes(s)}
                          onChange={() =>
                            toggleFilter(selectedSectors, s, setSelectedSectors)
                          }
                          className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                        />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Type */}
                <div className="mb-5">
                  <h4 className="text-xs font-heading font-semibold text-foreground mb-2.5 uppercase tracking-wider">
                    Company Type
                  </h4>
                  <div className="space-y-1.5">
                    {companyTypes.map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 cursor-pointer group hover:translate-x-1 transition-transform duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(t)}
                          onChange={() =>
                            toggleFilter(selectedTypes, t, setSelectedTypes)
                          }
                          className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                        />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nature of Business */}
                <div>
                  <h4 className="text-xs font-heading font-semibold text-foreground mb-2.5 uppercase tracking-wider">
                    Nature
                  </h4>
                  <div className="flex gap-2">
                    {natures.map((n) => (
                      <button
                        key={n}
                        onClick={() =>
                          toggleFilter(selectedNatures, n, setSelectedNatures)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          selectedNatures.includes(n)
                            ? "bg-primary text-primary-foreground hover:scale-105"
                            : "bg-muted text-muted-foreground hover:text-foreground hover:scale-105"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {totalFilters > 0 && (
                  <button
                    onClick={() => {
                      setSelectedSectors([]);
                      setSelectedTypes([]);
                      setSelectedNatures([]);
                      setSearchQuery("");
                    }}
                    className="mt-4 text-xs text-destructive hover:scale-105 font-medium w-full text-center transition-transform"
                  >
                    Clear all filters ({totalFilters})
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground rounded-full px-5 py-3 shadow-lg flex items-center gap-2 font-heading font-semibold text-sm hover:scale-105 transition-transform"
          >
            <Filter className="w-4 h-4" />
            Filters {totalFilters > 0 && `(${totalFilters})`}
          </button>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-sm text-primary font-semibold"
                >
                  Done
                </button>
              </div>

              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-muted/50 focus:bg-background focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-heading font-semibold mb-2.5 uppercase tracking-wider">
                    Sector
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          toggleFilter(selectedSectors, s, setSelectedSectors)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSectors.includes(s) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-heading font-semibold mb-2.5 uppercase tracking-wider">
                    Company Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {companyTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          toggleFilter(selectedTypes, t, setSelectedTypes)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTypes.includes(t) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-heading font-semibold mb-2.5 uppercase tracking-wider">
                    Nature
                  </h4>
                  <div className="flex gap-2">
                    {natures.map((n) => (
                      <button
                        key={n}
                        onClick={() =>
                          toggleFilter(selectedNatures, n, setSelectedNatures)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedNatures.includes(n) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {totalFilters > 0 && (
                <button
                  onClick={() => {
                    setSelectedSectors([]);
                    setSelectedTypes([]);
                    setSelectedNatures([]);
                    setSearchQuery("");
                  }}
                  className="mt-6 text-sm text-destructive hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Company Cards Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((company, i) => (
                <motion.div
                  key={company.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="clean-card-hover p-5 h-full flex flex-col group">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-sm flex-shrink-0 ${company.logoImg ? "bg-transparent shadow-sm" : company.logoColor + " text-white"}`}
                      >
                        {company.logoImg ? (
                          <img
                            src={company.logoImg}
                            alt={company.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          company.logo
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors truncate">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning fill-warning" />
                            <span className="text-xs font-medium">
                              {company.rating}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            ({company.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                      {company.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-primary/10 text-primary font-medium">
                        {company.type}
                      </span>
                      {company.sector.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-[10px] rounded-md bg-muted text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 mb-4 mt-auto">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <MapPin className="w-3 h-3 flex-shrink-0" />{" "}
                        {company.headquarters}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Users className="w-3 h-3 flex-shrink-0" />{" "}
                        {company.employees} employees
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Briefcase className="w-3 h-3 flex-shrink-0" />{" "}
                        {company.activeJobs} active openings
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      to="/login/user"
                      className="w-full text-center py-2 rounded-lg border border-primary/30 text-primary text-xs font-heading font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    >
                      View Jobs
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">
                  No companies match your filters
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
