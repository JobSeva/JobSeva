import { prisma } from "../lib/prisma";
import { AppError } from "../common/errors";
import { Job } from "../types/domain";

export interface ListJobsQuery {
  search?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  sort?: "relevance" | "newest" | "salary_desc" | "salary_asc";
  page: number;
  limit: number;
}

export const mapPrismaJobToJob = (prismaJob: any): Job => ({
  id: prismaJob.id,
  title: prismaJob.title,
  company: prismaJob.company.name,
  companyId: prismaJob.companyId,
  companyLogo: prismaJob.company.logo,
  location: prismaJob.location,
  salaryMin: prismaJob.salaryMin,
  salaryMax: prismaJob.salaryMax,
  type: prismaJob.type,
  remote: prismaJob.remote,
  skills: JSON.parse(prismaJob.skillsRaw || "[]"),
  description: prismaJob.description,
  responsibilities: JSON.parse(prismaJob.responsibilitiesRaw || "[]"),
  applicants: prismaJob.applicantsCount,
  postedAt: prismaJob.postedAt.toISOString(),
  active: prismaJob.active,
  education: prismaJob.education || undefined,
  experience: prismaJob.experience || undefined,
  workMode: prismaJob.workMode || undefined,
  openings: prismaJob.openings,
  deadline: prismaJob.deadline?.toISOString() || undefined,
});

export const jobsService = {
  async list(query: ListJobsQuery): Promise<{
    items: Job[];
    total: number;
    page: number;
    limit: number;
  }> {
    const where: any = { active: true };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { company: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }
    if (query.location) {
      where.location = { contains: query.location, mode: "insensitive" };
    }
    if (typeof query.remote === "boolean") {
      where.remote = query.remote;
    }
    if (typeof query.salaryMin === "number") {
      where.salaryMax = { gte: query.salaryMin };
    }
    if (typeof query.salaryMax === "number") {
      where.salaryMin = { lte: query.salaryMax };
    }

    let orderBy: any = { applicantsCount: "desc" };
    switch (query.sort) {
      case "salary_desc": orderBy = { salaryMax: "desc" }; break;
      case "salary_asc": orderBy = { salaryMin: "asc" }; break;
      case "newest": orderBy = { postedAt: "desc" }; break;
    }

    const total = await prisma.job.count({ where });
    const start = (query.page - 1) * query.limit;
    const prismaJobs = await prisma.job.findMany({
      where,
      include: { company: true },
      orderBy,
      skip: start,
      take: query.limit,
    });

    let items = prismaJobs.map(mapPrismaJobToJob);
    if (query.skills && query.skills.length > 0) {
      const normalizedSkills = query.skills.map((skill) => skill.toLowerCase());
      items = items.filter((job) =>
        normalizedSkills.some((skill) =>
          job.skills.some((jobSkill: string) => jobSkill.toLowerCase() === skill)
        )
      );
    }
    return { items, total, page: query.page, limit: query.limit };
  },

  async getById(jobId: string): Promise<Job> {
    const prismaJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });
    if (!prismaJob || !prismaJob.active) {
      throw new AppError(404, "Job not found", "JOB_NOT_FOUND");
    }
    return mapPrismaJobToJob(prismaJob);
  },

  async recommendations(limit = 6): Promise<Job[]> {
    const prismaJobs = await prisma.job.findMany({
      where: { active: true },
      include: { company: true },
      orderBy: { applicantsCount: "desc" },
      take: limit,
    });
    return prismaJobs.map(mapPrismaJobToJob);
  },
};
