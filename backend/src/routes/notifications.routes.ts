import { Router } from "express";
import { commsController } from "../controllers/communications.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res, next) => {
  commsController.getNotifications(req, res).catch(next);
});

router.get("/unread", (req, res, next) => {
  commsController.getUnreadNotificationsCount(req, res).catch(next);
});

router.put("/read-all", (req, res, next) => {
  commsController.markAllNotificationsRead(req, res).catch(next);
});

router.put("/:notificationId/read", (req, res, next) => {
  commsController.markNotificationRead(req, res).catch(next);
});

export const notificationsRouter = router;
