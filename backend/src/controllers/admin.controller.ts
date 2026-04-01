import { Request, Response } from "express";
import { success } from "../common/http";
import { adminService } from "../services/admin.service";

export class AdminController {
  // GET /api/admin/dashboard
  async getDashboard(req: Request, res: Response) {
    const stats = await adminService.getDashboardStats();
    res.json(success(stats));
  }

  // GET /api/admin/users
  async listUsers(req: Request, res: Response) {
    const data = await adminService.listUsers();
    res.json(success(data));
  }

  // PUT /api/admin/users/:userId/status
  async updateUserStatus(req: Request<{ userId: string }>, res: Response) {
    try {
      const { status } = req.body;
      const user = await adminService.updateUserStatus(
        req.params.userId,
        status,
      );
      res.json(success(user));
    } catch (err: any) {
      if (err.message === "User not found")
        return res.status(404).json({ error: err.message });
      throw err;
    }
  }

  // GET /api/admin/companies
  async listCompanies(req: Request, res: Response) {
    const lists = await adminService.listCompanies();
    res.json(success(lists));
  }

  // DELETE /api/admin/companies/:companyId
  async deleteCompany(req: Request<{ companyId: string }>, res: Response) {
    try {
      await adminService.deleteCompany(req.params.companyId);
      res.json(success({ message: "Company deleted" }));
    } catch (err: any) {
      if (err.message === "Company not found")
        return res.status(404).json({ error: err.message });
      throw err;
    }
  }

  // GET /api/admin/jobs
  async listJobs(req: Request, res: Response) {
    const all = await adminService.listJobs();
    res.json(success(all));
  }

  // PUT /api/admin/jobs/:jobId/moderate
  async moderateJob(req: Request<{ jobId: string }>, res: Response) {
    try {
      const { active } = req.body;
      const moder = await adminService.moderateJob(req.params.jobId, active);
      res.json(success(moder));
    } catch (err: any) {
      if (err.message === "Job not found")
        return res.status(404).json({ error: err.message });
      throw err;
    }
  }

  // DELETE /api/admin/jobs/:jobId
  async deleteJob(req: Request<{ jobId: string }>, res: Response) {
    try {
      await adminService.deleteJob(req.params.jobId);
      res.json(success({ message: "Job deleted" }));
    } catch (err: any) {
      if (err.message === "Job not found")
        return res.status(404).json({ error: err.message });
      throw err;
    }
  }

  // GET /api/admin/applications
  async listAllApplications(req: Request, res: Response) {
    const result = await adminService.listAllApplications();
    res.json(success(result));
  }

  // GET /api/admin/reports
  async getReports(req: Request, res: Response) {
    const range = (req.query.range as string | undefined) ?? "6m";
    const result = await adminService.getReportsAnalytics(range);
    res.json(success(result));
  }
}

export const adminController = new AdminController();
