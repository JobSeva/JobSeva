export type Role = "seeker" | "company" | "admin";

export type UserStatus = "active" | "suspended";

export interface UserSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  darkMode: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  status: UserStatus;
  profileCompletion: number;
  createdAt: string;
  updatedAt: string;
  settings: UserSettings;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogo: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: "full-time" | "part-time" | "contract";
  remote: boolean;
  skills: string[];
  description: string;
  responsibilities: string[];
  applicants: number;
  postedAt: string;
  active: boolean;
}

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  seekerId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  matchScore: number;
  recruiterRating?: number;
  recruiterNote?: string;
}

export interface SeekerExperience {
  id: string;
  title: string;
  company: string;
  period: string;
}

export interface SeekerProfile {
  userId: string;
  headline: string;
  location: string;
  phone: string;
  avatarUrl?: string;
  skills: string[];
  experiences: SeekerExperience[];
  resumeUrl?: string;
  profileStrength: number;
  updatedAt: string;
}

export interface SavedJob {
  seekerId: string;
  jobId: string;
  savedAt: string;
}

export interface CompanyProfile {
  companyId: string;
  ownerUserId: string;
  name: string;
  logo: string;
  tagline: string;
  about: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  website: string;
  email: string;
  phone: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  recruiterName: string;
  recruiterDesignation: string;
  isHiring: boolean;
  openPositions: number;
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  applicationId?: string; // Optional context if message relates to a specific application
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "application" | "message" | "system";
  isRead: boolean;
  createdAt: string;
}
