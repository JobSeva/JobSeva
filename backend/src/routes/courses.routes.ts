import { Router } from "express";
import { coursesController } from "../controllers/courses.controller";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", coursesController.listAll);
router.get("/ngo/:ngoId", coursesController.listByNgo);
router.get("/:id", requireAuth, coursesController.getById);

router.post("/", requireAuth, requireRole("ngo"), coursesController.create);
router.put("/:id", requireAuth, requireRole("ngo", "admin"), coursesController.update);
router.delete("/:id", requireAuth, requireRole("ngo", "admin"), coursesController.remove);

export { router as coursesRouter };
