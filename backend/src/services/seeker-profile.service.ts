import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { SeekerExperience, SeekerProfile } from "../types/domain";

const nowIso = () => new Date().toISOString();

const recomputeStrength = (profile: SeekerProfile): number => {
  let strength = 20; // Base strength
  if (profile.headline?.trim().length >= 6) strength += 10;
  if (profile.bio?.trim().length >= 20) strength += 10;
  if (profile.location?.trim().length >= 2) strength += 10;
  if (profile.phone?.trim().length >= 8) strength += 10;
  if (profile.skills?.length >= 3) strength += 10;
  if (profile.languages?.length >= 1) strength += 5;
  if (profile.experiences?.length >= 1) strength += 10;
  if (profile.education?.length >= 1) strength += 10;
  if (profile.resumeUrl) strength += 5;
  if (profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) strength += 10;

  return Math.min(100, strength);
};

const mapDbToSeekerProfile = (
  dbProfile: any,
): SeekerProfile => {
  return {
    userId: dbProfile.userId,
    headline: dbProfile.headline || "",
    bio: dbProfile.bio || "",
    location: dbProfile.location || "",
    phone: dbProfile.phone || "",
    avatarUrl: dbProfile.avatarUrl || undefined,
    skills: JSON.parse(dbProfile.skillsRaw || "[]"),
    languages: JSON.parse(dbProfile.languagesRaw || "[]"),
    experiences: (dbProfile.experiences || []).map((exp: any) => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description || undefined,
      period: exp.period || undefined,
    })),
    education: (dbProfile.education || []).map((edu: any) => ({
      id: edu.id,
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startYear: edu.startYear,
      endYear: edu.endYear,
      grade: edu.grade || undefined,
      period: edu.period || undefined,
    })),
    resumeUrl: dbProfile.resumeUrl || undefined,
    linkedinUrl: dbProfile.linkedinUrl || undefined,
    githubUrl: dbProfile.githubUrl || undefined,
    portfolioUrl: dbProfile.portfolioUrl || undefined,
    profileStrength: dbProfile.profileStrength,
    updatedAt: dbProfile.updatedAt.toISOString(),
  };
};

const getOrCreateProfile = async (userId: string): Promise<SeekerProfile> => {
  // Check if user exists and is a seeker
  const user = await prisma.user.findFirst({
    where: { id: userId, role: "seeker" },
  });

  if (!user) {
    throw new AppError(404, "Seeker not found", "SEEKER_NOT_FOUND");
  }

  // Find or create seeker profile
  let seekerProfile = await prisma.seekerProfile.findUnique({
    where: { userId },
    include: { experiences: true, education: true },
  });

  if (!seekerProfile) {
    seekerProfile = await prisma.seekerProfile.create({
      data: {
        userId,
        headline: "",
        bio: "",
        location: "",
        phone: "",
        skillsRaw: JSON.stringify([]),
        languagesRaw: JSON.stringify([]),
        profileStrength: 20,
      },
      include: { experiences: true, education: true },
    });
  }

  return mapDbToSeekerProfile(seekerProfile);
};

const touch = async (
  userId: string,
  profile: SeekerProfile,
): Promise<SeekerProfile> => {
  profile.profileStrength = recomputeStrength(profile);

  const updated = await prisma.seekerProfile.update({
    where: { userId },
    data: {
      profileStrength: profile.profileStrength,
    },
    include: { experiences: true, education: true },
  });

  return mapDbToSeekerProfile(updated);
};

export const seekerProfileService = {
  async get(userId: string): Promise<SeekerProfile> {
    return getOrCreateProfile(userId);
  },

  async update(
    userId: string,
    patch: Partial<
      SeekerProfile
    >,
  ): Promise<SeekerProfile> {
    const profile = await getOrCreateProfile(userId);

    if (typeof patch.headline === "string") {
      profile.headline = patch.headline;
    }

    if (typeof patch.location === "string") {
      profile.location = patch.location;
    }

    if (typeof patch.phone === "string") {
      profile.phone = patch.phone;
    }

    if (Array.isArray(patch.skills)) {
      profile.skills = patch.skills;
    }

    if (typeof patch.bio === "string") {
      profile.bio = patch.bio;
    }

    if (Array.isArray(patch.languages)) {
      profile.languages = patch.languages;
    }

    if (typeof patch.linkedinUrl === "string") {
      profile.linkedinUrl = patch.linkedinUrl;
    }

    if (typeof patch.githubUrl === "string") {
      profile.githubUrl = patch.githubUrl;
    }

    if (typeof patch.portfolioUrl === "string") {
      profile.portfolioUrl = patch.portfolioUrl;
    }

    // Update in database
    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: {
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
        skillsRaw: JSON.stringify(profile.skills),
        languagesRaw: JSON.stringify(profile.languages),
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        portfolioUrl: profile.portfolioUrl,
      },
      include: { experiences: true, education: true },
    });

    return touch(userId, mapDbToSeekerProfile(updated));
  },

  async uploadAvatar(userId: string, avatarUrl: string): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: {
        avatarUrl,
      },
      include: { experiences: true, education: true },
    });

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async uploadResume(
    userId: string,
    resumeUrl: string,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: {
        resumeUrl,
      },
      include: { experiences: true, education: true },
    });

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async deleteResume(userId: string): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const updated = await prisma.seekerProfile.update({
      where: { userId },
      data: {
        resumeUrl: null,
      },
      include: { experiences: true, education: true },
    });

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async addExperience(
    userId: string,
    payload: Omit<SeekerExperience, "id">,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    await prisma.seekerExperience.create({
      data: {
        seekerProfileId: userId,
        title: payload.title,
        company: payload.company,
        startDate: payload.startDate,
        endDate: payload.endDate,
        description: payload.description,
        period: payload.period || `${payload.startDate} - ${payload.endDate}`,
      },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true, education: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async updateExperience(
    userId: string,
    experienceId: string,
    payload: Omit<SeekerExperience, "id">,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const experience = await prisma.seekerExperience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      throw new AppError(404, "Experience not found", "EXPERIENCE_NOT_FOUND");
    }

    await prisma.seekerExperience.update({
      where: { id: experienceId },
      data: {
        title: payload.title,
        company: payload.company,
        startDate: payload.startDate,
        endDate: payload.endDate,
        description: payload.description,
        period: payload.period || `${payload.startDate} - ${payload.endDate}`,
      },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true, education: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async deleteExperience(
    userId: string,
    experienceId: string,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    const experience = await prisma.seekerExperience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      throw new AppError(404, "Experience not found", "EXPERIENCE_NOT_FOUND");
    }

    await prisma.seekerExperience.delete({
      where: { id: experienceId },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true, education: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async addEducation(
    userId: string,
    payload: any,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    await prisma.seekerEducation.create({
      data: {
        seekerProfileId: userId,
        school: payload.school,
        degree: payload.degree,
        field: payload.field,
        startYear: payload.startYear,
        endYear: payload.endYear,
        grade: payload.grade,
        period: payload.period || `${payload.startYear} - ${payload.endYear}`,
      },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true, education: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async updateEducation(
    userId: string,
    educationId: string,
    payload: any,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    await prisma.seekerEducation.update({
      where: { id: educationId },
      data: {
        school: payload.school,
        degree: payload.degree,
        field: payload.field,
        startYear: payload.startYear,
        endYear: payload.endYear,
        grade: payload.grade,
        period: payload.period || `${payload.startYear} - ${payload.endYear}`,
      },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true, education: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async deleteEducation(
    userId: string,
    educationId: string,
  ): Promise<SeekerProfile> {
    await getOrCreateProfile(userId);

    await prisma.seekerEducation.delete({
      where: { id: educationId },
    });

    const updated = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { experiences: true, education: true },
    });

    if (!updated) {
      throw new AppError(404, "Seeker profile not found", "SEEKER_NOT_FOUND");
    }

    const profile = mapDbToSeekerProfile(updated);
    return touch(userId, profile);
  },

  async dashboard(userId: string): Promise<{
    totalApplications: number;
    savedJobsCount: number;
    activeInterviews: number;
    profileStrength: number;
    recentApplications: any[];
    recommendations: any[];
    chartData: { name: string; applications: number }[];
  }> {
    const profile = await getOrCreateProfile(userId);

    const totalApplications = await prisma.application.count({
      where: { seekerId: userId },
    });

    const savedJobsCount = await prisma.savedJob.count({
      where: { seekerId: userId },
    });

    const activeInterviews = await prisma.application.count({
      where: {
        seekerId: userId,
        status: "interview",
      },
    });

    const recentApplicationsRaw = await prisma.application.findMany({
      where: { seekerId: userId },
      include: { job: { include: { company: true } } },
      orderBy: { appliedAt: "desc" },
      take: 5,
    });

    const recentApplications = recentApplicationsRaw.map((app) => ({
      id: app.id,
      jobTitle: app.job.title,
      company: app.job.company.name,
      companyLogo: app.job.company.logo,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
    }));

    // Simple recommendation engine: active jobs with most applicants first (or just recent)
    const recommendationsRaw = await prisma.job.findMany({
      where: { active: true },
      include: { company: true },
      orderBy: { postedAt: "desc" },
      take: 3,
    });

    const recommendations = recommendationsRaw.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company.name,
      companyLogo: job.company.logo,
      location: job.location,
      type: job.type,
      skills: JSON.parse(job.skillsRaw),
      education: job.education || undefined,
      experience: job.experience || undefined,
      workMode: job.workMode || undefined,
      openings: job.openings,
      deadline: job.deadline?.toISOString() || undefined,
    }));

    // Last 7 days chart data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartDataMap = new Map<string, number>(days.map((d) => [d, 0]));
    
    const last7DaysApps = await prisma.application.findMany({
      where: {
        seekerId: userId,
        appliedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    last7DaysApps.forEach((app) => {
      const dayName = days[app.appliedAt.getDay()] as string;
      chartDataMap.set(dayName, chartDataMap.get(dayName)! + 1);
    });

    const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (d) => ({
        name: d,
        applications: chartDataMap.get(d) || 0,
      }),
    );

    return {
      totalApplications,
      savedJobsCount,
      activeInterviews,
      profileStrength: profile.profileStrength,
      recentApplications,
      recommendations,
      chartData,
    };
  },
};
