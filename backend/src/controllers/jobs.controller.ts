import { Request, Response } from "express";

import { AppError } from "../common/errors";
import { success } from "../common/http";
import { jobsService } from "../services/jobs.service";
import { ListJobsQuery } from "../services/jobs.service";

export const jobsController = {
  async list(req: Request, res: Response): Promise<void> {
    const query = req.query as Record<string, string | string[] | undefined>;

    const skillsValue = query.skills;
    const skills = Array.isArray(skillsValue)
      ? skillsValue
      : typeof skillsValue === "string" && skillsValue.length > 0
        ? skillsValue
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

    const sort: ListJobsQuery["sort"] =
      query.sort === "newest" ||
      query.sort === "relevance" ||
      query.sort === "salary_desc" ||
      query.sort === "salary_asc"
        ? query.sort
        : "relevance";

    const parsed: ListJobsQuery = {
      search: typeof query.search === "string" ? query.search : undefined,
      location: typeof query.location === "string" ? query.location : undefined,
      remote:
        typeof query.remote === "string"
          ? query.remote === "true"
            ? true
            : query.remote === "false"
              ? false
              : undefined
          : undefined,
      salaryMin:
        typeof query.salaryMin === "string"
          ? Number(query.salaryMin) || undefined
          : undefined,
      salaryMax:
        typeof query.salaryMax === "string"
          ? Number(query.salaryMax) || undefined
          : undefined,
      skills,
      sort,
      page:
        typeof query.page === "string"
          ? Math.max(1, Number(query.page) || 1)
          : 1,
      limit:
        typeof query.limit === "string"
          ? Math.min(100, Math.max(1, Number(query.limit) || 10))
          : 10,
    };

    const result = await jobsService.list(parsed);
    res.status(200).json(
      success(result.items, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      }),
    );
  },

  async getById(req: Request, res: Response): Promise<void> {
    const { jobId } = req.params;
    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    const job = await jobsService.getById(jobId);
    res.status(200).json(success(job));
  },

  async recommendations(_req: Request, res: Response): Promise<void> {
    const jobs = await jobsService.recommendations();
    res.status(200).json(success(jobs));
  },
};
