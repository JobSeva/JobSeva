import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { CompanyProfile } from "../types/domain";

const nowIso = () => new Date().toISOString();

const mapDbToCompanyProfile = (dbProfile: any): CompanyProfile => {
  return {
    companyId: dbProfile.companyId,
    ownerUserId: dbProfile.ownerUserId,
    name: dbProfile.name,
    logo: dbProfile.logo,
    tagline: dbProfile.tagline,
    about: dbProfile.about,
    industry: dbProfile.industry,
    size: dbProfile.size,
    founded: dbProfile.founded,
    headquarters: dbProfile.headquarters,
    website: dbProfile.website,
    email: dbProfile.email,
    phone: dbProfile.phone,
    linkedin: dbProfile.linkedin || undefined,
    twitter: dbProfile.twitter || undefined,
    instagram: dbProfile.instagram || undefined,
    recruiterName: dbProfile.recruiterName,
    recruiterDesignation: dbProfile.recruiterDesignation,
    isHiring: dbProfile.isHiring,
    openPositions: dbProfile.openPositions,
    onboardingCompleted: dbProfile.onboardingCompleted,
    updatedAt: dbProfile.updatedAt.toISOString(),
  };
};

const findCompanyUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: "company" },
  });

  if (!user) {
    throw new AppError(404, "Company user not found", "COMPANY_USER_NOT_FOUND");
  }

  return user;
};

const getOrCreateProfile = async (
  ownerUserId: string,
): Promise<CompanyProfile> => {
  const user = await findCompanyUser(ownerUserId);

  let companyProfile = await prisma.companyProfile.findUnique({
    where: { ownerUserId },
  });

  if (!companyProfile) {
    companyProfile = await prisma.companyProfile.create({
      data: {
        ownerUserId,
        name: `${user.name} Company`,
        logo: user.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        tagline: "",
        about: "",
        industry: "",
        size: "",
        founded: new Date().getFullYear(),
        headquarters: "",
        website: "",
        email: user.email,
        phone: "",
        recruiterName: user.name,
        recruiterDesignation: "",
        isHiring: false,
        openPositions: 0,
        onboardingCompleted: false,
      },
    });
  }

  return mapDbToCompanyProfile(companyProfile);
};

const touch = (profile: CompanyProfile): CompanyProfile => {
  // updatedAt is automatically handled by Prisma @updatedAt
  return profile;
};

export const companyProfileService = {
  async onboarding(
    ownerUserId: string,
    payload: Omit<CompanyProfile, "companyId" | "ownerUserId" | "updatedAt">,
  ): Promise<CompanyProfile> {
    await getOrCreateProfile(ownerUserId);

    const updates: any = {
      name: payload.name,
      logo: payload.logo,
      tagline: payload.tagline,
      about: payload.about,
      industry: payload.industry,
      size: payload.size,
      founded: payload.founded,
      headquarters: payload.headquarters,
      website: payload.website,
      email: payload.email,
      phone: payload.phone,
      recruiterName: payload.recruiterName,
      recruiterDesignation: payload.recruiterDesignation,
      isHiring: payload.isHiring,
      openPositions: payload.openPositions,
      onboardingCompleted: true,
    };

    if (payload.linkedin) {
      updates.linkedin = payload.linkedin;
    }

    if (payload.twitter) {
      updates.twitter = payload.twitter;
    }

    if (payload.instagram) {
      updates.instagram = payload.instagram;
    }

    const updated = await prisma.companyProfile.update({
      where: { ownerUserId },
      data: updates,
    });

    return mapDbToCompanyProfile(updated);
  },

  async get(ownerUserId: string): Promise<CompanyProfile> {
    return getOrCreateProfile(ownerUserId);
  },

  async update(
    ownerUserId: string,
    patch: Partial<
      Omit<CompanyProfile, "companyId" | "ownerUserId" | "updatedAt">
    >,
  ): Promise<CompanyProfile> {
    await getOrCreateProfile(ownerUserId);

    const updates: any = {};

    if (patch.name !== undefined) updates.name = patch.name;
    if (patch.logo !== undefined) updates.logo = patch.logo;
    if (patch.tagline !== undefined) updates.tagline = patch.tagline;
    if (patch.about !== undefined) updates.about = patch.about;
    if (patch.industry !== undefined) updates.industry = patch.industry;
    if (patch.size !== undefined) updates.size = patch.size;
    if (patch.founded !== undefined) updates.founded = patch.founded;
    if (patch.headquarters !== undefined)
      updates.headquarters = patch.headquarters;
    if (patch.website !== undefined) updates.website = patch.website;
    if (patch.email !== undefined) updates.email = patch.email;
    if (patch.phone !== undefined) updates.phone = patch.phone;
    if (patch.linkedin !== undefined) updates.linkedin = patch.linkedin;
    if (patch.twitter !== undefined) updates.twitter = patch.twitter;
    if (patch.instagram !== undefined) updates.instagram = patch.instagram;
    if (patch.recruiterName !== undefined)
      updates.recruiterName = patch.recruiterName;
    if (patch.recruiterDesignation !== undefined)
      updates.recruiterDesignation = patch.recruiterDesignation;
    if (patch.isHiring !== undefined) updates.isHiring = patch.isHiring;
    if (patch.openPositions !== undefined)
      updates.openPositions = patch.openPositions;
    if (patch.onboardingCompleted !== undefined)
      updates.onboardingCompleted = patch.onboardingCompleted;

    const updated = await prisma.companyProfile.update({
      where: { ownerUserId },
      data: updates,
    });

    return touch(mapDbToCompanyProfile(updated));
  },

  async updateLogo(ownerUserId: string, logo: string): Promise<CompanyProfile> {
    await getOrCreateProfile(ownerUserId);

    const updated = await prisma.companyProfile.update({
      where: { ownerUserId },
      data: { logo },
    });

    return touch(mapDbToCompanyProfile(updated));
  },

  async dashboard(ownerUserId: string): Promise<{
    activeJobs: number;
    totalApplicants: number;
    shortlistedApplicants: number;
    interviewApplicants: number;
    hiredApplicants: number;
    hireRate: number;
    chartData: { name: string; applications: number }[];
    hiringData: { month: string; hired: number }[];
    recentJobs: any[];
    recentCandidates: any[];
  }> {
    const profile = await getOrCreateProfile(ownerUserId);

    // Get active jobs for this company
    const activeJobs = await prisma.job.count({
      where: {
        companyId: profile.companyId,
        active: true,
      },
    });

    // Get all applications for jobs of this company
    const allApplications = await prisma.application.findMany({
      where: {
        job: {
          companyId: profile.companyId,
        },
      },
    });

    const shortlistedApplicants = allApplications.filter(
      (app) => app.status === "shortlisted",
    ).length;

    const interviewApplicants = allApplications.filter(
      (app) => app.status === "interview",
    ).length;

    const hiredApplications = allApplications.filter(
      (app) => app.status === "hired",
    );
    const hiredApplicants = hiredApplications.length;

    const totalApplicants = allApplications.length;
    const hireRate =
      totalApplicants > 0
        ? Number(((hiredApplicants / totalApplicants) * 100).toFixed(2))
        : 0;

    // Calculate actual applications per day of week (last 7 days approx)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartDataMap = new Map<string, number>(days.map((d) => [d, 0]));
    allApplications.forEach((app) => {
      const dayName = days[app.appliedAt.getDay()] as string;
      chartDataMap.set(dayName, chartDataMap.get(dayName)! + 1);
    });
    // Let's sort them starting from Monday
    const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (d) => ({
        name: d,
        applications: chartDataMap.get(d) || 0,
      }),
    );

    // Calculate hired per month for last 6 months
    const hiringData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const hiredInMonth = hiredApplications.filter(
        (a) => a.updatedAt >= d && a.updatedAt < nextMonth,
      ).length;
      hiringData.push({
        month: d.toLocaleString("default", { month: "short" }),
        hired: hiredInMonth,
      });
    }

    // Get recent jobs
    const recentJobs = await prisma.job.findMany({
      where: { companyId: profile.companyId },
      include: { company: true },
      orderBy: { postedAt: "desc" },
      take: 3,
    });

    // Get recent candidates across ALL jobs of this company
    const recentCandidatesRaw = await prisma.application.findMany({
      where: {
        job: { companyId: profile.companyId },
      },
      include: {
        seeker: {
          include: { seekerProfile: true },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: 5,
    });

    const recentCandidates = recentCandidatesRaw.map((app) => ({
      applicationId: app.id,
      name: app.seeker.name,
      email: app.seeker.email,
      headline: app.seeker.seekerProfile?.headline || "",
      skills: JSON.parse(app.seeker.seekerProfile?.skillsRaw || "[]"),
      status: app.status,
      matchScore: app.matchScore,
      appliedAt: app.appliedAt.toISOString(),
      jobId: app.jobId,
    }));

    return {
      activeJobs,
      totalApplicants,
      shortlistedApplicants,
      interviewApplicants,
      hiredApplicants,
      hireRate,
      chartData,
      hiringData,
      recentJobs: recentJobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        location: j.location,
        type: j.type,
        applicants: j.applicantsCount,
        postedAt: j.postedAt.toISOString(),
        active: j.active,
      })),
      recentCandidates,
    };
  },
};
