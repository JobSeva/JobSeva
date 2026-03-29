import { prisma } from "../lib/prisma";
import { AppError } from "../common/errors";
import { SavedJob } from "../types/domain";
import { mapPrismaJobToJob } from "./jobs.service";

export interface SavedJobItem {
  savedAt: string;
  job: ReturnType<typeof mapPrismaJobToJob>;
}

export const savedJobsService = {
  async list(
    seekerId: string,
    page: number,
    limit: number,
  ): Promise<{ items: SavedJobItem[]; total: number; page: number; limit: number }> {
    const total = await prisma.savedJob.count({
      where: { seekerId },
    });

    const start = (page - 1) * limit;
    const savedJobs = await prisma.savedJob.findMany({
      where: { seekerId },
      include: { job: { include: { company: true } } },
      orderBy: { savedAt: "desc" },
      skip: start,
      take: limit,
    });

    const items: SavedJobItem[] = savedJobs.map((savedJob) => ({
      savedAt: savedJob.savedAt.toISOString(),
      job: mapPrismaJobToJob(savedJob.job),
    }));

    return {
      items,
      total,
      page,
      limit,
    };
  },

  async save(seekerId: string, jobId: string): Promise<SavedJob> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || !job.active) {
      throw new AppError(404, "Job not found", "JOB_NOT_FOUND");
    }

    const savedJob = await prisma.savedJob.upsert({
      where: { seekerId_jobId: { seekerId, jobId } },
      update: {},
      create: { seekerId, jobId },
    });

    return {
      seekerId: savedJob.seekerId,
      jobId: savedJob.jobId,
      savedAt: savedJob.savedAt.toISOString(),
    };
  },

  async remove(seekerId: string, jobId: string): Promise<void> {
    const savedJob = await prisma.savedJob.findUnique({
      where: { seekerId_jobId: { seekerId, jobId } },
    });

    if (!savedJob) {
      throw new AppError(404, "Saved job not found", "SAVED_JOB_NOT_FOUND");
    }

    await prisma.savedJob.delete({
      where: { seekerId_jobId: { seekerId, jobId } },
    });
  },
};
