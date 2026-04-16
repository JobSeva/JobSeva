import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { mailService } from "./mail.service";
import { ApplicationStatus, Job } from "../types/domain";

interface CompanyJobPayload {
  title: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: "full-time" | "part-time" | "contract";
  remote: boolean;
  skills: string[];
  description: string;
  responsibilities: string[];
  education?: string;
  experience?: string;
  workMode?: string;
  openings?: number;
  deadline?: string;
}

interface ApplicantView {
  applicationId: string;
  seekerId: string;
  name: string;
  email: string;
  headline: string;
  skills: string[];
  resumeUrl?: string;
  experienceCount: number;
  status: ApplicationStatus;
  matchScore: number;
  recruiterRating?: number;
  recruiterNote?: string;
  appliedAt: string;
  updatedAt: string;
  education: any[];
  experiences: any[];
}

const JOB_POST_EMAIL_BATCH_LIMIT = 5000;

const notifySeekersAboutNewJob = async (job: any): Promise<void> => {
  const seekers = await prisma.user.findMany({
    where: {
      role: "seeker",
    },
    select: {
      email: true,
      name: true,
    },
    take: JOB_POST_EMAIL_BATCH_LIMIT,
  });

  if (seekers.length === 0) {
    return;
  }

  const frontendBaseUrl = (
    process.env.FRONTEND_URL || "http://localhost:8080"
  ).replace(/\/$/, "");
  const jobUrl = `${frontendBaseUrl}/app/jobs/${job.id}`;

  const deliveryResults = await Promise.allSettled(
    seekers.map((recipient) =>
      mailService.sendJobPostedEmail(recipient.email, recipient.name, {
        jobTitle: job.title,
        companyName: job.company?.name || "JobSeva",
        location: job.location,
        type: job.type,
        jobUrl,
      }),
    ),
  );

  const failedCount = deliveryResults.filter(
    (result) => result.status === "rejected",
  ).length;

  if (failedCount > 0) {
    console.warn(
      `[MAIL] New job alert delivery failed for ${failedCount} of ${seekers.length} seekers.`,
    );
  }
};

const getCompanyProfile = async (ownerUserId: string) => {
  const profile = await prisma.companyProfile.findUnique({
    where: { ownerUserId },
  });

  if (!profile) {
    console.error(
      `[CRITICAL] Company profile missing for user: ${ownerUserId}. Job operations will fail.`,
    );
    throw new AppError(
      409,
      "Company profile not found. Please complete your company onboarding first.",
      "COMPANY_PROFILE_REQUIRED",
    );
  }

  return profile;
};

const getOwnedJob = async (ownerUserId: string, jobId: string) => {
  const profile = await getCompanyProfile(ownerUserId);

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId: profile.companyId,
    },
  });

  if (!job) {
    throw new AppError(404, "Job not found", "JOB_NOT_FOUND");
  }

  return job;
};

const jobToDto = (job: any): Job => {
  const safeJsonParse = (str: string) => {
    try {
      return JSON.parse(str || "[]");
    } catch (e) {
      console.warn("Failed to parse JSON field, returning empty array:", str);
      return [];
    }
  };

  return {
    id: job.id,
    title: job.title,
    company: job.company?.name || "Unknown Company",
    companyId: job.companyId,
    companyLogo: job.company?.logo || "",
    location: job.location,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    type: job.type as "full-time" | "part-time" | "contract",
    remote: job.remote,
    skills: safeJsonParse(job.skillsRaw),
    description: job.description,
    responsibilities: safeJsonParse(job.responsibilitiesRaw),
    applicants: job.applicantsCount,
    postedAt: job.postedAt
      ? job.postedAt.toISOString()
      : new Date().toISOString(),
    active: job.active,
    education: job.education || undefined,
    experience: job.experience || undefined,
    workMode: job.workMode || undefined,
    openings: job.openings,
    deadline:
      job.deadline && !isNaN(job.deadline.getTime())
        ? job.deadline.toISOString()
        : undefined,
  };
};

export const companyJobsService = {
  async list(
    ownerUserId: string,
    page: number,
    limit: number,
  ): Promise<{
    items: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const profile = await getCompanyProfile(ownerUserId);

    const total = await prisma.job.count({
      where: { companyId: profile.companyId },
    });

    const jobs = await prisma.job.findMany({
      where: { companyId: profile.companyId },
      include: { company: true },
      orderBy: { postedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: jobs.map(jobToDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async create(ownerUserId: string, payload: CompanyJobPayload): Promise<Job> {
    const profile = await getCompanyProfile(ownerUserId);

    const job = await prisma.job.create({
      data: {
        title: payload.title,
        companyId: profile.companyId,
        location: payload.location,
        salaryMin: payload.salaryMin,
        salaryMax: payload.salaryMax,
        type: payload.type,
        remote: payload.remote,
        skillsRaw: JSON.stringify(payload.skills || []),
        description: payload.description,
        responsibilitiesRaw: JSON.stringify(payload.responsibilities || []),
        applicantsCount: 0,
        active: true,
        education: payload.education || null,
        experience: payload.experience || null,
        workMode: payload.workMode || "onsite",
        openings: payload.openings || 1,
        deadline:
          payload.deadline && !isNaN(Date.parse(payload.deadline))
            ? new Date(payload.deadline)
            : null,
      },
      include: { company: true },
    });

    // Update company profile open positions
    await prisma.companyProfile.update({
      where: { companyId: profile.companyId },
      data: { openPositions: { increment: 1 } },
    });

    // Trigger email broadcast in the background to keep job creation responsive.
    void notifySeekersAboutNewJob(job).catch((error) => {
      console.error("Failed to send new job alert emails:", error);
    });

    return jobToDto(job);
  },

  async getById(ownerUserId: string, jobId: string): Promise<Job> {
    const job = await getOwnedJob(ownerUserId, jobId);
    const jobWithCompany = await prisma.job.findUnique({
      where: { id: job.id },
      include: { company: true },
    });

    if (!jobWithCompany) {
      throw new AppError(404, "Job not found", "JOB_NOT_FOUND");
    }

    return jobToDto(jobWithCompany);
  },

  async update(
    ownerUserId: string,
    jobId: string,
    patch: Partial<CompanyJobPayload>,
  ): Promise<Job> {
    await getOwnedJob(ownerUserId, jobId);

    const updateData: any = {};
    if (patch.title !== undefined) updateData.title = patch.title;
    if (patch.location !== undefined) updateData.location = patch.location;
    if (patch.salaryMin !== undefined) updateData.salaryMin = patch.salaryMin;
    if (patch.salaryMax !== undefined) updateData.salaryMax = patch.salaryMax;
    if (patch.type !== undefined) updateData.type = patch.type;
    if (patch.remote !== undefined) updateData.remote = patch.remote;
    if (patch.skills !== undefined)
      updateData.skillsRaw = JSON.stringify(patch.skills);
    if (patch.description !== undefined)
      updateData.description = patch.description;
    if (patch.responsibilities !== undefined)
      updateData.responsibilitiesRaw = JSON.stringify(patch.responsibilities);
    if (patch.education !== undefined) updateData.education = patch.education;
    if (patch.experience !== undefined)
      updateData.experience = patch.experience;
    if (patch.workMode !== undefined) updateData.workMode = patch.workMode;
    if (patch.openings !== undefined) updateData.openings = patch.openings;
    if (patch.deadline !== undefined)
      updateData.deadline = patch.deadline ? new Date(patch.deadline) : null;

    const job = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
      include: { company: true },
    });

    return jobToDto(job);
  },

  async remove(ownerUserId: string, jobId: string): Promise<void> {
    const profile = await getCompanyProfile(ownerUserId);
    const job = await getOwnedJob(ownerUserId, jobId);

    if (job.active) {
      await prisma.job.update({
        where: { id: jobId },
        data: { active: false },
      });

      await prisma.companyProfile.update({
        where: { companyId: profile.companyId },
        data: { openPositions: { decrement: 1 } },
      });
    }
  },

  async listApplicants(
    ownerUserId: string,
    jobId: string,
  ): Promise<ApplicantView[]> {
    await getOwnedJob(ownerUserId, jobId);

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        seeker: {
          include: { seekerProfile: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return applications.map((app: any) => {
      const seekerProfile = app.seeker.seekerProfile;
      const skills = seekerProfile?.skillsRaw
        ? JSON.parse(seekerProfile.skillsRaw)
        : [];

      return {
        applicationId: app.id,
        seekerId: app.seekerId,
        name: app.seeker.name,
        email: app.seeker.email,
        headline: seekerProfile?.headline || "",
        resumeUrl: app.resumeUrl || seekerProfile?.resumeUrl,
        skills,
        experienceCount: seekerProfile?.experiences?.length || 0,
        status: app.status as ApplicationStatus,
        matchScore: app.matchScore,
        recruiterRating: app.recruiterRating || undefined,
        recruiterNote: app.recruiterNote || undefined,
        appliedAt: app.appliedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        education: seekerProfile?.education || [],
        experiences: seekerProfile?.experiences || [],
      };
    });
  },

  async updateApplicationStatus(
    ownerUserId: string,
    applicationId: string,
    status: ApplicationStatus,
  ) {
    const profile = await getCompanyProfile(ownerUserId);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new AppError(404, "Application not found", "APPLICATION_NOT_FOUND");
    }

    if (application.job.companyId !== profile.companyId) {
      throw new AppError(
        403,
        "Not allowed to modify this application",
        "FORBIDDEN",
      );
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return updated;
  },

  async updateApplicationRating(
    ownerUserId: string,
    applicationId: string,
    rating: number,
    note?: string,
  ) {
    const profile = await getCompanyProfile(ownerUserId);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new AppError(404, "Application not found", "APPLICATION_NOT_FOUND");
    }

    if (application.job.companyId !== profile.companyId) {
      throw new AppError(
        403,
        "Not allowed to modify this application",
        "FORBIDDEN",
      );
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        recruiterRating: rating,
        recruiterNote: note,
      },
    });

    return updated;
  },
};
