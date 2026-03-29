import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2, UploadCloud, MapPin, Globe, Mail, Phone,
  Linkedin, Twitter, Instagram, User, Briefcase, CheckCircle,
  ChevronRight, ChevronLeft, Building, Users
} from "lucide-react";
import { toast } from "sonner";

export interface CompanyProfileData {
  name: string;
  logo: string | null;
  tagline: string;
  about: string;
  industry: string;
  size: string;
  founded: string;
  hq: string;
  website: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  recruiterName: string;
  recruiterDesignation: string;
  isHiring: boolean;
  openPositions: string;
}

const initialData: CompanyProfileData = {
  name: "",
  logo: null,
  tagline: "",
  about: "",
  industry: "",
  size: "",
  founded: "",
  hq: "",
  website: "",
  email: "",
  phone: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  recruiterName: "",
  recruiterDesignation: "",
  isHiring: true,
  openPositions: "",
};

const steps = [
  "Basic Info",
  "Company Details",
  "Contact Info",
  "Social Links",
  "Recruiter Info",
  "Hiring Status"
];

// Reusable animated input component
function FormInput({ label, type = "text", value, onChange, placeholder, icon: Icon, required = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-heading font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-muted/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground outline-none transition-all duration-300 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-none ${Icon ? "pl-9 p-3" : "p-3"}`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-muted/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground outline-none transition-all duration-300 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 py-2.5 ${Icon ? "pl-9 pr-3" : "px-3"}`}
          />
        )}
      </div>
    </div>
  );
}

// Subcomponents for each step
function BasicInfoStep({ data, updateData }: { data: CompanyProfileData, updateData: (partial: Partial<CompanyProfileData>) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateData({ logo: reader.result as string });
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a PNG or JPG file.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-xs font-heading font-semibold text-foreground">Company Logo <span className="text-destructive">*</span></label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative overflow-hidden w-full h-32 rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group"
        >
          {data.logo ? (
             <img src={data.logo} alt="Logo preview" className="absolute inset-0 w-full h-full object-contain p-2" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium text-foreground">Click or drag logo to upload</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB</p>
            </>
          )}
          <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleImageUpload} />
          {data.logo && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs font-semibold">Change Logo</span>
            </div>
          )}
        </div>
      </div>

      <FormInput 
        label="Company Name" 
        value={data.name} 
        onChange={(e: any) => updateData({ name: e.target.value })} 
        placeholder="e.g. Acme Corporation" 
        icon={Building2} 
        required 
      />
      
      <FormInput 
        label="Tagline" 
        value={data.tagline} 
        onChange={(e: any) => updateData({ tagline: e.target.value })} 
        placeholder="e.g. Innovating the future of work" 
      />

      <FormInput 
        label="About Company" 
        type="textarea"
        value={data.about} 
        onChange={(e: any) => updateData({ about: e.target.value })} 
        placeholder="Describe what your company does..." 
        required
      />
    </div>
  );
}

function CompanyDetailsStep({ data, updateData }: { data: CompanyProfileData, updateData: (partial: Partial<CompanyProfileData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-xs font-heading font-semibold text-foreground">Industry <span className="text-destructive">*</span></label>
        <select 
          value={data.industry} 
          onChange={(e) => updateData({ industry: e.target.value })}
          className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none"
        >
          <option value="">Select Industry</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="E-Commerce">E-Commerce</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Education">Education</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-heading font-semibold text-foreground">Company Size <span className="text-destructive">*</span></label>
        <select 
          value={data.size} 
          onChange={(e) => updateData({ size: e.target.value })}
          className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none"
        >
          <option value="">Select Size</option>
          <option value="1-10">1-10 employees (Startup)</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="500+">500+ employees (Enterprise)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput 
          label="Founded Year" 
          type="number"
          value={data.founded} 
          onChange={(e: any) => updateData({ founded: e.target.value })} 
          placeholder="e.g. 2012" 
        />
        <FormInput 
          label="Headquarters" 
          value={data.hq} 
          onChange={(e: any) => updateData({ hq: e.target.value })} 
          placeholder="e.g. San Francisco, CA" 
          icon={MapPin}
          required
        />
      </div>

      <FormInput 
        label="Website URL" 
        value={data.website} 
        onChange={(e: any) => updateData({ website: e.target.value })} 
        placeholder="https://example.com" 
        icon={Globe}
      />
    </div>
  );
}

function ContactInfoStep({ data, updateData }: { data: CompanyProfileData, updateData: (partial: Partial<CompanyProfileData>) => void }) {
  return (
    <div className="space-y-6">
      <FormInput 
        label="Official Email" 
        type="email"
        value={data.email} 
        onChange={(e: any) => updateData({ email: e.target.value })} 
        placeholder="contact@company.com" 
        icon={Mail}
        required
      />
      <FormInput 
        label="Phone Number" 
        type="tel"
        value={data.phone} 
        onChange={(e: any) => updateData({ phone: e.target.value })} 
        placeholder="+1 (555) 000-0000" 
        icon={Phone}
      />
    </div>
  );
}

function SocialLinksStep({ data, updateData }: { data: CompanyProfileData, updateData: (partial: Partial<CompanyProfileData>) => void }) {
  return (
    <div className="space-y-6">
      <FormInput 
        label="LinkedIn Profile" 
        value={data.linkedin} 
        onChange={(e: any) => updateData({ linkedin: e.target.value })} 
        placeholder="https://linkedin.com/company/yourcompany" 
        icon={Linkedin}
      />
      <FormInput 
        label="Twitter Profile" 
        value={data.twitter} 
        onChange={(e: any) => updateData({ twitter: e.target.value })} 
        placeholder="https://twitter.com/yourcompany" 
        icon={Twitter}
      />
      <FormInput 
        label="Instagram Profile" 
        value={data.instagram} 
        onChange={(e: any) => updateData({ instagram: e.target.value })} 
        placeholder="https://instagram.com/yourcompany" 
        icon={Instagram}
      />
    </div>
  );
}

function RecruiterInfoStep({ data, updateData }: { data: CompanyProfileData, updateData: (partial: Partial<CompanyProfileData>) => void }) {
  return (
    <div className="space-y-6">
      <FormInput 
        label="Contact Person Name" 
        value={data.recruiterName} 
        onChange={(e: any) => updateData({ recruiterName: e.target.value })} 
        placeholder="e.g. Jane Doe" 
        icon={User}
        required
      />
      <FormInput 
        label="Designation" 
        value={data.recruiterDesignation} 
        onChange={(e: any) => updateData({ recruiterDesignation: e.target.value })} 
        placeholder="e.g. Senior Technical Recruiter" 
        icon={Briefcase}
        required
      />
    </div>
  );
}

function HiringDetailsStep({ data, updateData }: { data: CompanyProfileData, updateData: (partial: Partial<CompanyProfileData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-border bg-muted/30 flex items-center justify-between">
        <div>
          <h4 className="font-heading font-semibold text-sm">Hiring Status</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Are you currently accepting applications?</p>
        </div>
        <button 
          onClick={() => updateData({ isHiring: !data.isHiring })}
          className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${data.isHiring ? "bg-primary" : "bg-border"}`}
        >
          <motion.div 
            layout 
            className="w-4 h-4 rounded-full bg-white shadow-sm"
            animate={{ x: data.isHiring ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {data.isHiring && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
           <FormInput 
              label="Number of Open Positions" 
              type="number"
              value={data.openPositions} 
              onChange={(e: any) => updateData({ openPositions: e.target.value })} 
              placeholder="e.g. 5" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Live Preview Sidebar Component
function LivePreviewCard({ data }: { data: CompanyProfileData }) {
  return (
    <div className="clean-card p-6 sticky top-24 w-full h-fit flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Building className="w-4 h-4" />
        </div>
        <h3 className="font-heading font-bold text-lg">Profile <span className="text-primary">Preview</span></h3>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Banner Area (Mocked visually) */}
        <div className="h-24 w-full rounded-t-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative mb-16">
           <div className="absolute -bottom-12 left-6">
             <div className="w-32 h-32 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center overflow-hidden">
                {data.logo ? (
                  <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground/30" />
                )}
             </div>
           </div>
        </div>

        <div className="px-2">
          <h2 className="text-xl font-heading font-bold break-words">{data.name || "Company Name"}</h2>
          <p className="text-sm text-primary font-medium mt-1 mb-4">{data.tagline || "Your inspiring tagline goes here"}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
               <Briefcase className="w-3.5 h-3.5" /> {data.industry || "Industry"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
               <Users className="w-3.5 h-3.5" /> {data.size || "Size"}
            </span>
            {data.hq && (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {data.hq}
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground leading-relaxed w-full min-h-[80px]">
            {data.about ? data.about : "Tell the world about what makes your company unique. This is where candidates will learn about your mission and culture..."}
          </div>

          {data.isHiring && (
            <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-primary text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> 
              Actively Hiring {data.openPositions ? `for ${data.openPositions} roles` : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompanyOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CompanyProfileData>(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const updateData = (partial: Partial<CompanyProfileData>) => {
    setData(prev => ({ ...prev, ...partial }));
  };

  const handleNext = () => {
    // Basic validation
    if (currentStep === 0 && (!data.name || !data.about)) {
      toast.error("Please fill in the required fields (Name, About).");
      return;
    }
    if (currentStep === 1 && (!data.industry || !data.size || !data.hq)) {
      toast.error("Please fill in the required layout details.");
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit phase
      toast.success("Company Profile registered successfully!");
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/app/company");
      }, 2500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const StepComponent = [
    BasicInfoStep,
    CompanyDetailsStep,
    ContactInfoStep,
    SocialLinksStep,
    RecruiterInfoStep,
    HiringDetailsStep
  ][currentStep];

  if (isSubmitted) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
         <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary"
         >
           <CheckCircle className="w-10 h-10" />
         </motion.div>
         <h2 className="text-3xl font-heading font-bold mb-3">Profile Created!</h2>
         <p className="text-muted-foreground mb-8 max-w-sm">
           Your company profile is completely set up. Redirecting you to the dashboard...
         </p>
         <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
       </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Company <span className="text-primary">Registration</span></h1>
        <p className="text-sm text-muted-foreground">Setup your employer brand to attract top talent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Area */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          {/* Progress Bar & Stepper */}
          <div className="clean-card p-6 mb-6 relative">
            <div className="flex justify-between items-center relative z-10">
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center gap-2 w-16">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      idx < currentStep ? "bg-primary text-white" : 
                      idx === currentStep ? "bg-primary/20 text-primary border-2 border-primary" : 
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx < currentStep ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] hidden sm:block font-medium ${idx <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            {/* Connecting line */}
            <div className="absolute left-[8%] right-[8%] top-[38px] h-[2px] bg-muted z-0 hidden sm:block">
               <motion.div 
                 className="h-full bg-primary" 
                 initial={{ width: "0%" }}
                 animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                 transition={{ duration: 0.4 }}
               />
            </div>
          </div>

          {/* Form Step Content */}
          <div className="clean-card p-6 sm:p-8 flex-1 flex flex-col min-h-[400px]">
            <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-2">
              <div className="w-2 h-6 rounded-full bg-primary" />
              {steps[currentStep]}
            </h2>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepComponent data={data} updateData={updateData} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
              {currentStep > 0 && (
                <button 
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              
              <button 
                onClick={handleNext}
                className="ml-auto px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
              >
                {currentStep === steps.length - 1 ? "Submit Profile" : "Next Step"}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Side */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 relative">
          <LivePreviewCard data={data} />
        </div>
      </div>
    </div>
  );
}
