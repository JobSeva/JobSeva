import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import Settings from "@/pages/Settings";
import LoginSelection from "@/pages/auth/LoginSelection";
import SignupSelection from "@/pages/auth/SignupSelection";
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
import AdminNgos from "@/pages/AdminNgos";
import AdminUsers from "@/pages/AdminUsers";
import AdminJobModeration from "@/pages/AdminJobModeration";
import AdminPlacements from "@/pages/AdminPlacements";
import AdminReports from "@/pages/AdminReports";
import JobDetails from "@/pages/JobDetails";
import CompanyJobs from "@/pages/CompanyJobs";
import NotFound from "@/pages/NotFound";
import TrainingPage from "@/pages/TrainingPage";
import CourseDetails from "@/pages/CourseDetails";

import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";

// NGO Pages
import NgoDashboard from "@/pages/ngoDashboard";
import NgoPostTraining from "@/pages/ngoPostTraining";
import NgoCourses from "@/pages/ngoCourses";
import NgoEnrollments from "@/pages/ngoEnrollments";
import NgoLogin from "@/pages/ngoLogin";
import NgoSignup from "@/pages/ngoSignup";
import VerifyEmail from "@/pages/VerifyEmail";
import NgoProfile from "@/pages/NgoProfile";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

function ProfileGate() {
  const { role } = useAppContext();
  if (role === "ngo") return <NgoProfile />;
  return <SeekerProfile />;
}

/** Blocks unauthenticated users from accessing protected routes */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthLoading, user } = useAppContext();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();

  if (user?.role !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

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
            ) : role === "ngo" ? (
              <NgoDashboard />
            ) : (
              <AdminDashboard />
            )
          }
        />
        <Route path="explore" element={<ExploreJobs />} />
        <Route path="applications" element={<Applications />} />
        <Route path="profile" element={<ProfileGate />} />
        <Route path="saved" element={<SavedJobs />} />
        <Route path="messages" element={<Messages />} />
        <Route path="job/:id" element={<JobDetails />} />
        <Route path="course/:id" element={<CourseDetails />} />

        {/* NGO Management */}
        <Route path="ngo" element={<NgoDashboard />} />
        <Route path="ngo/post-training" element={<NgoPostTraining />} />
        <Route path="ngo/courses" element={<NgoCourses />} />
        <Route path="ngo/enrollments" element={<NgoEnrollments />} />

        <Route path="company" element={<CompanyDashboard />} />
        <Route path="company/jobs" element={<CompanyJobs />} />
        <Route path="company/onboarding" element={<CompanyOnboarding />} />
        <Route path="company/profile" element={<CompanyProfileView />} />
        <Route path="company/post-job" element={<PostJob />} />
        <Route path="company/post-job/:id" element={<PostJob />} />
        <Route path="company/applicants" element={<CompanyApplicants />} />
        <Route path="company/messages" element={<Messages />} />

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/companies"
          element={
            <AdminRoute>
              <AdminCompanies />
            </AdminRoute>
          }
        />
        <Route
          path="admin/ngos"
          element={
            <AdminRoute>
              <AdminNgos />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="admin/jobs"
          element={
            <AdminRoute>
              <AdminJobModeration />
            </AdminRoute>
          }
        />
        <Route
          path="admin/placements"
          element={
            <AdminRoute>
              <AdminPlacements />
            </AdminRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />

        <Route path="training" element={<TrainingPage />} />
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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });

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
              {/* Auth routes */}
              <Route path="/login" element={<LoginSelection />} />
              <Route path="/signup" element={<SignupSelection />} />
              <Route path="/login/:role" element={<RoleLogin />} />
              <Route path="/signup/:role" element={<RoleSignup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Public routes */}
              <Route path="/jobs" element={<ExploreJobsGate />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Protected app routes */}
              <Route
                path="/app/*"
                element={
                  <ProtectedRoute>
                    <AppRoutes />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
