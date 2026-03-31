import { Router } from "express";
import { enrollmentsController } from "../controllers/enrollments.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/mine", requireAuth, requireRole("seeker"), enrollmentsController.getUserEnrollments);
router.get("/course/:courseId", requireAuth, enrollmentsController.getCourseEnrollments);

router.post("/", requireAuth, requireRole("seeker"), enrollmentsController.enroll);

export { router as enrollmentsRouter };
