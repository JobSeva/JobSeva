import { motion } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  Shield,
  Globe,
  Mail,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

export default function Settings() {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          Account <span className="text-primary">Settings</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Manage your account preferences and security settings.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4.5 h-4.5" />
              {tab.label}
              {activeTab === tab.id && (
                <ChevronRight className="ml-auto w-4 h-4" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="clean-card p-6"
          >
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-bold mb-4">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Senior Software Engineer passionate about building scalable web applications."
                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <button className="btn-primary py-2.5 px-8 text-sm font-bold">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-bold mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-border mt-6">
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Two-Factor
                    Authentication
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add an extra layer of security to your account.
                  </p>
                  <button className="px-4 py-2 rounded-xl border border-primary/30 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                    Enable 2FA
                  </button>
                </div>
                <button className="btn-primary py-2.5 px-8 text-sm font-bold">
                  Update Password
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-bold mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Email Notifications",
                      desc: "Receive alerts for new jobs and applications via email.",
                      icon: Mail,
                    },
                    {
                      title: "Job Alerts",
                      desc: "Get notified when a job matches your saved search criteria.",
                      icon: Globe,
                    },
                    {
                      title: "Application Status",
                      desc: "Real-time updates when your application is viewed or shortlisted.",
                      icon: Bell,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-primary border border-border">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground max-w-xs">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6 text-center py-10">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Sun className="w-10 h-10 dark:hidden" />
                  <Moon className="w-10 h-10 hidden dark:block" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">
                  Dark Mode
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  Toggle between light and dark themes to customize your viewing
                  experience.
                </p>
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
