import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Briefcase,
  Users,
  CheckCircle,
  Edit,
  ExternalLink,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import Loader from "@/components/Loader";

export default function CompanyProfileView() {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/company/profile")
      .then((res) => setCompanyData(res.data.data.profile))
      .catch((e) => console.error("Failed to fetch company profile", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader message="Fetching organizational profile..." />;
  }

  if (!companyData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
        <Link
          to="/app/company/onboarding"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl"
        >
          Complete Onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Company <span className="text-primary">Profile</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage exactly how candidates view your organization.
          </p>
        </div>
        <Link
          to="/app/company/onboarding"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit Profile
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clean-card overflow-hidden"
      >
        {/* Banner */}
        <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/10 relative">
          <div className="absolute -bottom-16 left-8 sm:left-12">
            <div className="w-48 h-48 rounded-3xl bg-card border-8 border-card shadow-xl flex items-center justify-center overflow-hidden">
              {companyData.logo ? (
                <img
                  src={companyData.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                  <Building2 className="w-12 h-12 text-muted-foreground/30 mb-1" />
                  <span className="text-xs font-heading font-bold text-muted-foreground/50">
                    {companyData.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {companyData.isHiring && (
            <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-sm text-primary text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Actively Hiring ({companyData.openPositions})
            </div>
          )}
        </div>

        {/* Core Info */}
        <div className="pt-20 px-8 sm:px-12 pb-8">
          <h2 className="text-3xl font-heading font-bold mb-1">
            {companyData.name}
          </h2>
          <p className="text-primary font-medium text-sm sm:text-base mb-6">
            {companyData.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4" /> {companyData.industry}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" /> {companyData.size} Employees
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />{" "}
              {companyData.headquarters || "Not specified"}
            </div>
            {companyData.website && (
              <a
                href={companyData.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" /> Visit Website{" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Area */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full bg-primary" /> About Us
                </h3>
                <div className="p-6 rounded-2xl bg-muted/30 border border-border text-foreground leading-relaxed">
                  {companyData.about}
                </div>
              </section>
            </div>

            {/* Sidebar Data */}
            <div className="space-y-6">
              <div className="clean-card p-6 border-transparent bg-primary/5 shadow-none">
                <h4 className="font-heading font-bold text-sm text-primary mb-4 flex items-center gap-2">
                  Contact Details
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                        Email
                      </p>
                      <p className="font-medium">{companyData.email}</p>
                    </div>
                  </div>
                  {companyData.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                          Phone
                        </p>
                        <p className="font-medium">{companyData.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                        Founded
                      </p>
                      <p className="font-medium">
                        {companyData.founded || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="clean-card p-6 shadow-sm border-border">
                <h4 className="font-heading font-bold text-sm mb-4">
                  Social Profiles
                </h4>
                <div className="flex items-center gap-3">
                  {companyData.linkedin && (
                    <a
                      href={companyData.linkedin}
                      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors shadow-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {companyData.twitter && (
                    <a
                      href={companyData.twitter}
                      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors shadow-sm"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {companyData.instagram && (
                    <a
                      href={companyData.instagram}
                      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors shadow-sm"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
