import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all routes in this file
router.use(requireAuth);
router.use(requireRole("admin"));

router.get("/dashboard", (req, res, next) => {
  adminController.getDashboard(req, res).catch(next);
});

router.get("/reports", (req, res, next) => {
  adminController.getReports(req, res).catch(next);
});

router.get("/users", (req, res, next) => {
  adminController.listUsers(req, res).catch(next);
});

router.put("/users/:userId/status", (req, res, next) => {
  adminController.updateUserStatus(req, res).catch(next);
});

router.get("/companies", (req, res, next) => {
  adminController.listCompanies(req, res).catch(next);
});

router.get("/ngos", (req, res, next) => {
  adminController.listNgos(req, res).catch(next);
});

router.get("/export/users", (req, res, next) => {
  adminController.exportUsersCsvData(req, res).catch(next);
});

router.get("/export/companies", (req, res, next) => {
  adminController.exportCompaniesCsvData(req, res).catch(next);
});

router.get("/export/ngos", (req, res, next) => {
  adminController.exportNgosCsvData(req, res).catch(next);
});

router.delete("/companies/:companyId", (req, res, next) => {
  adminController.deleteCompany(req, res).catch(next);
});

router.get("/jobs", (req, res, next) => {
  adminController.listJobs(req, res).catch(next);
});

router.put("/jobs/:jobId/moderate", (req, res, next) => {
  adminController.moderateJob(req, res).catch(next);
});

router.delete("/jobs/:jobId", (req, res, next) => {
  adminController.deleteJob(req, res).catch(next);
});

router.get("/applications", (req, res, next) => {
  adminController.listAllApplications(req, res).catch(next);
});

export default router;
