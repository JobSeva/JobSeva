import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { Application } from "../types/domain";

export const mapPrismaAppToApp = (prismaApp: any): Application => ({
  id: prismaApp.id,
  jobId: prismaApp.jobId,
  seekerId: prismaApp.seekerId,
  jobTitle: prismaApp.jobTitle,
  company: prismaApp.company,
  companyLogo: prismaApp.companyLogo,
  status: prismaApp.status as any,
  appliedAt: prismaApp.appliedAt.toISOString(),
  updatedAt: prismaApp.updatedAt.toISOString(),
  matchScore: prismaApp.matchScore,
  recruiterRating: prismaApp.recruiterRating || undefined,
  recruiterNote: prismaApp.recruiterNote || undefined,
});

export const applicationsService = {
  async listForSeeker(seekerId: string): Promise<Application[]> {
    const apps = await prisma.application.findMany({
      where: { seekerId },
      orderBy: { appliedAt: "desc" },
    });
    return apps.map(mapPrismaAppToApp);
  },

  async getById(applicationId: string): Promise<Application> {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) {
      throw new AppError(404, "Application not found", "APPLICATION_NOT_FOUND");
    }
    return mapPrismaAppToApp(app);
  },

  async apply(seekerId: string, jobId: string, matchScore = 0): Promise<Application> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      throw new AppError(404, "Job not found", "JOB_NOT_FOUND");
    }

    const existing = await prisma.application.findFirst({
      where: { seekerId, jobId },
    });

    if (existing) {
      throw new AppError(409, "Already applied to this job", "ALREADY_APPLIED");
    }

    const [app] = await prisma.$transaction([
      prisma.application.create({
        data: {
          seekerId,
          jobId,
          jobTitle: job.title,
          company: job.company.name,
          companyLogo: job.company.logo,
          matchScore,
          status: "applied",
        },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: { applicantsCount: { increment: 1 } },
      }),
    ]);

    return mapPrismaAppToApp(app);
  },

  async withdraw(seekerId: string, applicationId: string): Promise<void> {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      throw new AppError(404, "Application not found", "APPLICATION_NOT_FOUND");
    }

    if (app.seekerId !== seekerId) {
      throw new AppError(403, "Not authorized to withdraw this application", "FORBIDDEN");
    }

    await prisma.$transaction([
      prisma.application.delete({
        where: { id: applicationId },
      }),
      prisma.job.update({
        where: { id: app.jobId },
        data: { applicantsCount: { decrement: 1 } },
      }),
    ]);
  }
};
