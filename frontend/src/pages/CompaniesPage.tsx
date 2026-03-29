import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Users, Star, ExternalLink, Briefcase,
  Building2, ArrowLeft, Filter, ChevronDown, Globe,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import PublicNavbar from "@/components/PublicNavbar";

interface Company {
  name: string;
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

const companies: Company[] = [
  {
    name: "Reliance Retail",
    logoImg: "/logos/reliance.png",
    rating: 3.9,
    reviews: "37.2K+",
    type: "Indian MNC",
    sector: ["Retail"],
    industry: "Retail & E-Commerce",
    description: "Building India's largest retail company.",
    activeJobs: 245,
    headquarters: "Mumbai, India",
    employees: "2,00,000+",
    nature: "B2C",
  },
  {
    name: "Cognizant",
    logoImg: "/logos/cognizant.png",
    rating: 3.7,
    reviews: "41K+",
    type: "Foreign MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Leading IT company with global presence.",
    activeJobs: 532,
    headquarters: "Teaneck, NJ",
    employees: "3,50,000+",
    nature: "B2B",
  },
  {
    name: "Infosys",
    logoImg: "/logos/infosys.png",
    rating: 3.6,
    reviews: "58K+",
    type: "Indian MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Global leader in next-gen digital services & consulting.",
    activeJobs: 678,
    headquarters: "Bengaluru, India",
    employees: "3,40,000+",
    nature: "B2B",
  },
  {
    name: "Amazon",
    logoImg: "/logos/amazon.png",
    rating: 4.1,
    reviews: "25K+",
    type: "Foreign MNC",
    sector: ["Technology", "Retail"],
    industry: "Internet & E-Commerce",
    description: "World's largest internet based company by revenue.",
    activeJobs: 412,
    headquarters: "Seattle, WA",
    employees: "15,00,000+",
    nature: "B2C",
  },
  {
    name: "TCS",
    logoImg: "/logos/tcs.png",
    rating: 3.7,
    reviews: "82K+",
    type: "Indian MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Pioneering innovation in IT services and digital transformation globally.",
    activeJobs: 890,
    headquarters: "Mumbai, India",
    employees: "6,00,000+",
    nature: "B2B",
  },
  {
    name: "Wipro",
    logoImg: "/logos/wipro.png",
    rating: 3.5,
    reviews: "39K+",
    type: "Indian MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Leading global IT, consulting and business process services.",
    activeJobs: 345,
    headquarters: "Bengaluru, India",
    employees: "2,50,000+",
    nature: "B2B",
  },
  {
    name: "Capgemini",
    logoImg: "/logos/capgemini.png",
    rating: 3.8,
    reviews: "27K+",
    type: "Foreign MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Global leader in consulting and technology services.",
    activeJobs: 289,
    headquarters: "Paris, France",
    employees: "3,60,000+",
    nature: "B2B",
  },
  {
    name: "Airtel",
    logoImg: "/logos/airtel.png",
    rating: 3.9,
    reviews: "12K+",
    type: "Indian MNC",
    sector: ["Telecom"],
    industry: "Telecom & Networking",
    description: "Leading global telecom company serving millions of customers.",
    activeJobs: 134,
    headquarters: "New Delhi, India",
    employees: "30,000+",
    nature: "B2C",
  },
  {
    name: "ICICI Bank",
    logoImg: "/logos/icici.png",
    rating: 3.8,
    reviews: "22K+",
    type: "Indian MNC",
    sector: ["BFSI"],
    industry: "Banking & Financial Services",
    description: "Leading private sector bank offering wide financial services.",
    activeJobs: 198,
    headquarters: "Mumbai, India",
    employees: "1,15,000+",
    nature: "B2C",
  },
  {
    name: "JPMorgan Chase",
    logo: "JP",
    logoColor: "bg-slate-800",
    rating: 4.0,
    reviews: "15K+",
    type: "Foreign MNC",
    sector: ["BFSI"],
    industry: "Banking & Financial Services",
    description: "Leader in financial services and global banking.",
    activeJobs: 267,
    headquarters: "New York, NY",
    employees: "2,90,000+",
    nature: "B2B",
  },
  {
    name: "Genpact",
    logo: "GP",
    logoColor: "bg-emerald-600",
    rating: 3.5,
    reviews: "19K+",
    type: "Indian MNC",
    sector: ["BPM"],
    industry: "IT Services & Consulting",
    description: "Global professional services firm focused on digital transformation.",
    activeJobs: 178,
    headquarters: "New York, NY",
    employees: "1,15,000+",
    nature: "B2B",
  },
  {
    name: "Siemens",
    logo: "SI",
    logoColor: "bg-teal-600",
    rating: 4.0,
    reviews: "8K+",
    type: "Foreign MNC",
    sector: ["Technology"],
    industry: "Manufacturing & Engineering",
    description: "Creating a better tomorrow with electrification & automation.",
    activeJobs: 156,
    headquarters: "Munich, Germany",
    employees: "3,20,000+",
    nature: "B2B",
  },
  {
    name: "Schneider Electric",
    logo: "SE",
    logoColor: "bg-green-700",
    rating: 4.1,
    reviews: "6K+",
    type: "Foreign MNC",
    sector: ["Technology"],
    industry: "Manufacturing & Engineering",
    description: "Indian multinational offering energy and automation solutions.",
    activeJobs: 98,
    headquarters: "Rueil-Malmaison, France",
    employees: "1,35,000+",
    nature: "B2B",
  },
  {
    name: "FIS",
    logo: "FIS",
    logoColor: "bg-indigo-700",
    rating: 3.6,
    reviews: "4.5K+",
    type: "Foreign MNC",
    sector: ["BFSI"],
    industry: "FinTech & Payments",
    description: "Global leader in financial technology solutions.",
    activeJobs: 112,
    headquarters: "Jacksonville, FL",
    employees: "65,000+",
    nature: "B2B",
  },
  {
    name: "Optum",
    logo: "OP",
    logoColor: "bg-orange-600",
    rating: 3.9,
    reviews: "10K+",
    type: "Foreign MNC",
    sector: ["Technology"],
    industry: "Healthcare & Life Sciences",
    description: "Leading digital health tech and analytics company.",
    activeJobs: 234,
    headquarters: "Eden Prairie, MN",
    employees: "1,90,000+",
    nature: "B2B",
  },
  {
    name: "Empower",
    logo: "EM",
    logoColor: "bg-cyan-600",
    rating: 4.2,
    reviews: "3K+",
    type: "Foreign MNC",
    sector: ["BFSI"],
    industry: "Financial Services",
    description: "We're a financial services company with fresh ideas.",
    activeJobs: 67,
    headquarters: "Greenwood Village, CO",
    employees: "17,000+",
    nature: "B2B",
  },
  {
    name: "Coforge",
    logo: "CF",
    logoColor: "bg-violet-600",
    rating: 3.4,
    reviews: "5.7K+",
    type: "Indian MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Global digital services and solutions provider.",
    activeJobs: 145,
    headquarters: "Greater Noida, India",
    employees: "23,000+",
    nature: "B2B",
  },
  {
    name: "Persistent Systems",
    logo: "PS",
    logoColor: "bg-rose-600",
    rating: 3.6,
    reviews: "5.1K+",
    type: "Indian MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Trusted global solutions company for product engineering.",
    activeJobs: 112,
    headquarters: "Pune, India",
    employees: "22,000+",
    nature: "B2B",
  },
  {
    name: "Avalara Technologies",
    logo: "AV",
    logoColor: "bg-amber-600",
    rating: 3.9,
    reviews: "1.2K+",
    type: "Foreign MNC",
    sector: ["Technology"],
    industry: "Software Products",
    description: "Simplifying tax compliance through technology.",
    activeJobs: 45,
    headquarters: "Seattle, WA",
    employees: "6,000+",
    nature: "B2B",
  },
  {
    name: "Bread Financial",
    logo: "BF",
    logoColor: "bg-violet-800",
    rating: 3.7,
    reviews: "2K+",
    type: "Foreign MNC",
    sector: ["BFSI"],
    industry: "FinTech & Payments",
    description: "Personalizing payment experiences with tech.",
    activeJobs: 38,
    headquarters: "Columbus, OH",
    employees: "7,000+",
    nature: "B2B",
  },
  {
    name: "Amgen",
    logo: "AM",
    logoColor: "bg-blue-800",
    rating: 4.0,
    reviews: "3.5K+",
    type: "Foreign MNC",
    sector: ["Healthcare"],
    industry: "Healthcare & Life Sciences",
    description: "One. Will. Infinite — pioneering biotechnology.",
    activeJobs: 78,
    headquarters: "Thousand Oaks, CA",
    employees: "27,000+",
    nature: "B2B",
  },
  {
    name: "bp",
    logo: "bp",
    logoColor: "bg-green-600",
    rating: 4.1,
    reviews: "2.8K+",
    type: "Foreign MNC",
    sector: ["Energy"],
    industry: "Oil, Gas & Energy",
    description: "We're with you. Reimagining energy for people and planet.",
    activeJobs: 56,
    headquarters: "London, UK",
    employees: "65,000+",
    nature: "B2B",
  },
  {
    name: "Deloitte",
    logo: "DL",
    logoColor: "bg-emerald-700",
    rating: 3.9,
    reviews: "32K+",
    type: "Foreign MNC",
    sector: ["IT Services"],
    industry: "IT Services & Consulting",
    description: "Making an impact that matters through professional services.",
    activeJobs: 356,
    headquarters: "London, UK",
    employees: "4,15,000+",
    nature: "B2B",
  },
  {
    name: "Flipkart",
    logoImg: "/logos/flipkart.png",
    rating: 4.0,
    reviews: "10K+",
    type: "Indian MNC",
    sector: ["Retail", "Technology"],
    industry: "Internet & E-Commerce",
    description: "India's leading e-commerce marketplace transforming shopping.",
    activeJobs: 189,
    headquarters: "Bengaluru, India",
    employees: "45,000+",
    nature: "B2C",
  },
];

const sectors = ["IT Services", "BFSI", "Technology", "Retail", "BPM", "Telecom", "Healthcare", "Energy"];
const companyTypes = ["Foreign MNC", "Indian MNC", "Corporate", "Startup"];
const natures = ["B2B", "B2C"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4 } }),
};

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedNatures, setSelectedNatures] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (list: string[], item: string, setter: (val: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const filtered = companies.filter((c) => {
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSector = selectedSectors.length === 0 || c.sector.some((s) => selectedSectors.includes(s));
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(c.type);
    const matchNature = selectedNatures.length === 0 || selectedNatures.includes(c.nature);
    return matchSearch && matchSector && matchType && matchNature;
  });

  const totalFilters = selectedSectors.length + selectedTypes.length + selectedNatures.length;

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
            Featured companies <span className="text-primary">actively hiring</span>
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
                <h3 className="font-heading font-semibold text-sm mb-3">All Filters</h3>

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
                  <h4 className="text-xs font-heading font-semibold text-foreground mb-2.5 uppercase tracking-wider">Sector</h4>
                  <div className="space-y-1.5">
                    {sectors.map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer group hover:translate-x-1 transition-transform duration-300">
                        <input
                          type="checkbox"
                          checked={selectedSectors.includes(s)}
                          onChange={() => toggleFilter(selectedSectors, s, setSelectedSectors)}
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
                  <h4 className="text-xs font-heading font-semibold text-foreground mb-2.5 uppercase tracking-wider">Company Type</h4>
                  <div className="space-y-1.5">
                    {companyTypes.map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer group hover:translate-x-1 transition-transform duration-300">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(t)}
                          onChange={() => toggleFilter(selectedTypes, t, setSelectedTypes)}
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
                  <h4 className="text-xs font-heading font-semibold text-foreground mb-2.5 uppercase tracking-wider">Nature</h4>
                  <div className="flex gap-2">
                    {natures.map((n) => (
                      <button
                        key={n}
                        onClick={() => toggleFilter(selectedNatures, n, setSelectedNatures)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${selectedNatures.includes(n)
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
                    onClick={() => { setSelectedSectors([]); setSelectedTypes([]); setSelectedNatures([]); setSearchQuery(""); }}
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
                <button onClick={() => setShowFilters(false)} className="text-sm text-primary font-semibold">Done</button>
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
                  <h4 className="text-xs font-heading font-semibold mb-2.5 uppercase tracking-wider">Sector</h4>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((s) => (
                      <button key={s} onClick={() => toggleFilter(selectedSectors, s, setSelectedSectors)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSectors.includes(s) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-heading font-semibold mb-2.5 uppercase tracking-wider">Company Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {companyTypes.map((t) => (
                      <button key={t} onClick={() => toggleFilter(selectedTypes, t, setSelectedTypes)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTypes.includes(t) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-heading font-semibold mb-2.5 uppercase tracking-wider">Nature</h4>
                  <div className="flex gap-2">
                    {natures.map((n) => (
                      <button key={n} onClick={() => toggleFilter(selectedNatures, n, setSelectedNatures)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedNatures.includes(n) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {totalFilters > 0 && (
                <button
                  onClick={() => { setSelectedSectors([]); setSelectedTypes([]); setSelectedNatures([]); setSearchQuery(""); }}
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
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-sm flex-shrink-0 ${company.logoImg ? "bg-transparent shadow-sm" : company.logoColor + " text-white"}`}>
                        {company.logoImg ? (
                          <img src={company.logoImg} alt={company.name} className="max-w-full max-h-full object-contain" />
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
                            <span className="text-xs font-medium">{company.rating}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">({company.reviews} reviews)</span>
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
                        <span key={s} className="px-2 py-0.5 text-[10px] rounded-md bg-muted text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 mb-4 mt-auto">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <MapPin className="w-3 h-3 flex-shrink-0" /> {company.headquarters}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Users className="w-3 h-3 flex-shrink-0" /> {company.employees} employees
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Briefcase className="w-3 h-3 flex-shrink-0" /> {company.activeJobs} active openings
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
                <p className="text-muted-foreground font-medium">No companies match your filters</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
