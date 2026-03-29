import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import AboutUs from "@/pages/AboutUs";
import Settings from "@/pages/Settings";
import LoginSelection from "@/pages/auth/LoginSelection";
import RoleLogin from "@/pages/auth/RoleLogin";
import RoleSignup from "@/pages/auth/RoleSignup";
import ExploreJobsGate from "@/pages/ExploreJobsGate";
import CompaniesPage from "@/pages/CompaniesPage";
import SeekerDashboard from "@/pages/SeekerDashboard";
import ExploreJobs from "@/pages/ExploreJobs";
import Applications from "@/pages/Applications";
import SeekerProfile from "@/pages/SeekerProfile";
import SavedJobs from "@/pages/SavedJobs";
import Messages from "@/pages/Messages";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyOnboarding from "@/pages/CompanyOnboarding";
import CompanyProfileView from "@/pages/CompanyProfileView";
import PostJob from "@/pages/PostJob";
import CompanyApplicants from "@/pages/CompanyApplicants";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCompanies from "@/pages/AdminCompanies";
import AdminUsers from "@/pages/AdminUsers";
import AdminJobModeration from "@/pages/AdminJobModeration";
import AdminPlacements from "@/pages/AdminPlacements";
import AdminReports from "@/pages/AdminReports";
import JobDetails from "@/pages/JobDetails";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { role } = useAppContext();

  return (
    <AppLayout>
      <Routes>
        <Route
          index
          element={
            role === "seeker" ? (
              <SeekerDashboard />
            ) : role === "company" ? (
              <CompanyDashboard />
            ) : (
              <AdminDashboard />
            )
          }
        />
        <Route path="explore" element={<ExploreJobs />} />
        <Route path="applications" element={<Applications />} />
        <Route path="profile" element={<SeekerProfile />} />
        <Route path="saved" element={<SavedJobs />} />
        <Route path="messages" element={<Messages />} />
        <Route path="job/:id" element={<JobDetails />} />

        <Route path="company" element={<CompanyDashboard />} />
        <Route path="company/onboarding" element={<CompanyOnboarding />} />
        <Route path="company/profile" element={<CompanyProfileView />} />
        <Route path="company/post-job" element={<PostJob />} />
        <Route path="company/applicants" element={<CompanyApplicants />} />
        <Route path="company/messages" element={<Messages />} />

        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/companies" element={<AdminCompanies />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/jobs" element={<AdminJobModeration />} />
        <Route path="admin/placements" element={<AdminPlacements />} />
        <Route path="admin/reports" element={<AdminReports />} />

        <Route path="notifications" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force instant scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Secondary fallback for after framer-motion mounts
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutUs />} />
              {/* Auth routes */}
              <Route path="/login" element={<LoginSelection />} />
              <Route path="/login/:role" element={<RoleLogin />} />
              <Route path="/signup/:role" element={<RoleSignup />} />
              {/* Public routes */}
              <Route path="/jobs" element={<ExploreJobsGate />} />
              <Route path="/companies" element={<CompaniesPage />} />
              {/* App routes */}
              <Route path="/app/*" element={<AppRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
