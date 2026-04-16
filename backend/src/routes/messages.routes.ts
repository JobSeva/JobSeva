import { Router } from "express";
import { commsController } from "../controllers/communications.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res, next) => {
  commsController.getMessages(req, res).catch(next);
});

// Explicit conversations endpoint (alias) to support clients expecting
// GET /messages/conversations
router.get("/conversations", (req, res, next) => {
  commsController.getConversations(req, res).catch(next);
});

router.get("/unread", (req, res, next) => {
  commsController.getUnreadMessagesCount(req, res).catch(next);
});

// Get messages with a specific user by param: GET /messages/:otherUserId
// placed after /unread so literal routes are matched first
router.get("/:otherUserId", (req, res, next) => {
  commsController.getMessages(req, res).catch(next);
});

router.post("/", (req, res, next) => {
  commsController.sendMessage(req, res).catch(next);
});

router.put("/:messageId/read", (req, res, next) => {
  commsController.markMessageRead(req, res).catch(next);
});

export const messagesRouter = router;
