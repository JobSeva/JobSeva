import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
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
}

interface ApplicantView {
  applicationId: string;
  seekerId: string;
  name: string;
  email: string;
  headline: string;
  skills: string[];
  experienceCount: number;
  status: ApplicationStatus;
  matchScore: number;
  recruiterRating?: number;
  recruiterNote?: string;
  appliedAt: string;
  updatedAt: string;
}

const getCompanyProfile = async (ownerUserId: string) => {
  const profile = await prisma.companyProfile.findUnique({
    where: { ownerUserId },
  });

  if (!profile) {
    throw new AppError(
      409,
      "Company profile not found. Complete onboarding first",
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
  return {
    id: job.id,
    title: job.title,
    company: job.company?.name || "",
    companyId: job.companyId,
    companyLogo: job.company?.logo || "",
    location: job.location,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    type: job.type as "full-time" | "part-time" | "contract",
    remote: job.remote,
    skills: JSON.parse(job.skillsRaw),
    description: job.description,
    responsibilities: JSON.parse(job.responsibilitiesRaw),
    applicants: job.applicantsCount,
    postedAt: job.postedAt.toISOString(),
    active: job.active,
  };
};

export const companyJobsService = {
  async list(
    ownerUserId: string,
    page: number,
    limit: number,
  ): Promise<{ items: Job[]; total: number; page: number; limit: number }> {
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
    };
  },

  async create(
    ownerUserId: string,
    payload: CompanyJobPayload,
  ): Promise<Job> {
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
        skillsRaw: JSON.stringify(payload.skills),
        description: payload.description,
        responsibilitiesRaw: JSON.stringify(payload.responsibilities),
        applicantsCount: 0,
        active: true,
      },
      include: { company: true },
    });

    // Update company profile open positions
    await prisma.companyProfile.update({
      where: { companyId: profile.companyId },
      data: { openPositions: { increment: 1 } },
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
      updateData.responsibilitiesRaw = JSON.stringify(
        patch.responsibilities,
      );

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
        skills,
        experienceCount: 0, // Will be populated if we fetch experiences
        status: app.status as ApplicationStatus,
        matchScore: app.matchScore,
        recruiterRating: app.recruiterRating || undefined,
        recruiterNote: app.recruiterNote || undefined,
        appliedAt: app.appliedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
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
